// * src/app/modules/auth/auth.validation.ts

import { z } from 'zod';

// * ---------------- * //
// ! Auth Validation
// * ----------------* //

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'ID is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

// * ------------------ * //
// ! Change Password
// * ------------------ * //

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({
      required_error: 'New password is required',
    }),
  }),
});

export const AuthValidations = {
  loginValidationSchema,
  changePasswordValidationSchema,
};
