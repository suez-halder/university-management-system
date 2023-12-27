// * src/app/modules/auth/auth.service.ts

import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';

// * ---------------- * //
// ! Auth Validation
// * ----------------* //

const loginUser = async (payload: TLoginUser) => {
  //! check-1: if the user exist
  const user = await User.isUserExistsByCustomId(payload?.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }

  //! check-2: if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  //! check-3: if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  //! check-4: if the password is correct
  const isPasswordMatched = await User.isPasswordMatched(
    payload?.password,
    user?.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not match');
  }

  // * ---------------------------------------------- * //
  // ! Access Granted: Send AccessToken, RefreshToken
  // * ---------------------------------------------- * //

  // * create access token and send to the client

  const jwtPayload = {
    userId: user.id,
    role: user?.role,
  };

  // to generate secret --> require('crypto').randomBytes(64).toString('hex')
  // const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
  //   expiresIn: '1d',
  // });

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  // * create refresh token and send to the cookies

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

// * ---------------- * //
// ! Refresh Token
// * ----------------* //

const refreshToken = async (token: string) => {
  //! check-1: if the token in valid / verify the token
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;
  // const role = decoded?.role;
  // const id = decoded.userId
  const { userId, iat } = decoded;

  // * user status change hoile jeno jekhane auth guard authorized chilo, sekhane user access korte na pare

  //! check-2: if the user exist
  const user = await User.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }

  //! check-3: if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  //! check-4: if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  //! check-5: jodi kokhno token churi hoye jaay, password change kori tahole check dite hobe
  if (
    user.passwordChangedAt &&
    (await User.isJWTIssuedBeforePasswordChanged(
      user.passwordChangedAt,
      iat as number,
    ))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const jwtPayload = {
    userId: user.id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return { accessToken };
};

// * ------------------ * //
// ! Change Password
// * ------------------ * //
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // check-1: if the user exist
  const user = await User.isUserExistsByCustomId(userData?.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }

  // check-2: if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  // check-3: if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  // check-4: if the password is correct
  const isPasswordMatched = await User.isPasswordMatched(
    payload?.oldPassword,
    user?.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not match');
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // update password
  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
  return null;
};

// * -----------------* //
// ! Forget Password
// * -----------------* //

const forgetPassword = async (userId: string) => {
  //! check-1: if the user exist
  const user = await User.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }

  //! check-2: if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  //! check-3: if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  const jwtPayload = {
    userId: user.id,
    role: user?.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`;

  sendEmail(user.email, resetUILink);

  // console.log(resetUILink);
};

// * -----------------* //
// ! Reset Password
// * -----------------* //

const resetPassword = async (
  payload: {
    id: string;
    newPassword: string;
  },
  token: string,
) => {
  //! check-1: if the user exist
  const user = await User.isUserExistsByCustomId(payload.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }

  //! check-2: if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  //! check-3: if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  //! check-4 verify token coming from payload
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  // console.log(decoded);

  if (payload.id !== decoded.userId) {
    // console.log(payload.id, decoded.userId);
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden !');
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // update password
  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
