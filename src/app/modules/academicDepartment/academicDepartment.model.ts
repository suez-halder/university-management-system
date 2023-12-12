// * src/app/modules/academicDepartment/academicDepartment.model.ts

import httpStatus from 'http-status';
import { model, Schema } from 'mongoose';
import AppError from '../../errors/AppError';
import { TAcademicDepartment } from './academicDepartment.interface';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
);

academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExists = await AcademicDepartment.findOne({
    name: this.name,
  });

  if (isDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This department already exists!');
  }
  next();
});

// !Validation check: update korar shomoye check korte hobe id db te ache kina
academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();

  const isDepartmentExists = await AcademicDepartment.findOne({ query });
  if (!isDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, "This department doesn't exists!");
  }

  next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
