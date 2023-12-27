// * src/app/modules/user/user.route.ts

import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendImageToCloudinary';
import { createAdminValidationSchema } from '../admin/admin.validation';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import { StudentValidations } from '../student/student.validation';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { userValidations } from './user.validation';

const router = express.Router();

/* --------------------------- */
//! upload image to cloudinary
/* --------------------------- */
router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);

/* ------------------- */
//! getMe functionality
/* ------------------- */

router.get('/me', auth('student', 'faculty', 'admin'), UserControllers.getMe);

/* ------------------- */
//! change status
/* ------------------- */

router.post(
  '/change-status/:id',
  auth('admin'),
  validateRequest(userValidations.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

export const UserRoutes = router;
