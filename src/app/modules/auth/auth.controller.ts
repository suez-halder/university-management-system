// * src/app/modules/auth/auth.controller.ts

import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

// * ---------------- * //
// ! Auth Validation
// * ----------------* //

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);

  // for setting refresh token in cookies
  const { refreshToken, accessToken, needsPasswordChange } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

// * ---------------- * //
// ! Refresh Token
// * ----------------* //

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully',
    data: result,
  });
});

// * ------------------ * //
// ! Change Password
// * ------------------ * //

const changePassword = catchAsync(async (req, res) => {
  // console.log(req.user, req.body);
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  refreshToken,
  changePassword,
};
