// * src/app/modules/academicDepartment/academicDepartment.interface.ts

import { Types } from 'mongoose';

export type TAcademicDepartment = {
  name: string;
  academicFaculty: Types.ObjectId;
};
