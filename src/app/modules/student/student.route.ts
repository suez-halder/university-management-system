// src/app/modules/student/student.route.ts
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StudentControllers } from './student.controller';
import { StudentValidations } from './student.validation';

const router = express.Router();

// will call controller function
router.get('/', StudentControllers.getAllStudents);

router.get(
  '/:id',
  auth('admin', 'faculty'),
  StudentControllers.getSingleStudent,
);

router.patch(
  '/:id',
  validateRequest(StudentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent,
);

router.delete('/:id', StudentControllers.deleteStudent);

export const StudentRoutes = router;
