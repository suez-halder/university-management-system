// src/app/modules/student/student.joi.validation.ts

import Joi from 'joi';

const userNameJoiValidationSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .max(20)
    .trim()
    .pattern(/^[A-Z][a-z]*$/),
  middleName: Joi.string(),
  lastName: Joi.string()
    .required()
    .pattern(/^[a-zA-Z]+$/),
});

const guardianJoiValidationSchema = Joi.object({
  fatherName: Joi.string().required(),
  fatherOccupation: Joi.string().required(),
  fatherContactNo: Joi.string().required(),
  motherName: Joi.string().required(),
  motherOccupation: Joi.string().required(),
  motherContactNo: Joi.string().required(),
});

const localGuardianJoiValidationSchema = Joi.object({
  name: Joi.string().required(),
  occupation: Joi.string().required(),
  contactNo: Joi.string().required(),
  address: Joi.string().required(),
});

const studentJoiValidationSchema = Joi.object({
  id: Joi.string().required(),
  name: userNameJoiValidationSchema.required(),
  gender: Joi.string().valid('male', 'female', 'other'),
  dateOfBirth: Joi.string(),
  email: Joi.string().email().required(),
  contactNo: Joi.string().required(),
  emergencyContactNo: Joi.string().required(),
  bloodGroup: Joi.string().valid(
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardian: guardianJoiValidationSchema.required(),
  localGuardian: localGuardianJoiValidationSchema.required(),
  profileImg: Joi.string(),
  isActive: Joi.string().valid('active', 'blocked').default('active'),
});

export default studentJoiValidationSchema;
