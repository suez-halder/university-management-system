// * src/app/middlewares/auth.ts

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

/**
 * req er moddhe user naame ekta property dhukacchi. 
 * eivabe dile prottekar req er moddhe user dite hoito
 * eijnw interface er moddhe index.d.ts file create kore 'user' add kore disi req er moddhe
    
    interface CustomRequest extends Request {
        user: JwtPayload;
    }
 */

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.headers.authorization);

    // check-1: if the token is send from the client
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    // check-2: if the token in valid / verify the token
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    // const role = decoded?.role;
    // const id = decoded.userId
    const { role, userId, iat } = decoded;

    // * user status change hoile jeno jekhane auth guard authorized chilo, sekhane user access korte na pare

    // check-3: if the user exist
    const user = await User.isUserExistsByCustomId(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
    }

    // check-4: if the user is already deleted
    const isDeleted = user?.isDeleted;

    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
    }

    // check-5: if the user is blocked
    const userStatus = user?.status;

    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
    }

    // check-6: jodi kokhno token churi hoye jaay, password change kori tahole check dite hobe
    if (
      user.passwordChangedAt &&
      (await User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      ))
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }
    // decoded undefined
    // const {userId, role} = decoded
    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
