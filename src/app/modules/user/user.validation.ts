// * src/app/modules/user/user.validation.ts

import { z } from 'zod';
import { UserStatus } from './user.constant';

const userValidationSchema = z.object({
  body: z.object({
    password: z
      .string({
        invalid_type_error: 'Password must be string',
      })
      .max(20, { message: 'Password cannot be more than 20 characters' })
      .optional(),
  }),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const userValidations = {
  userValidationSchema,
  changeStatusValidationSchema,
};
