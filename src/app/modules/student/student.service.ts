// src/app/modules/student/student.service.ts

import { TStudent } from './student.interface';
import { Student } from './student.model';

const createStudentIntoDB = async (studentData: TStudent) => {
  // const result = await StudentModel.create(student); // built in static method

  const student = new Student(studentData); // create an instance

  if (await student.isUserExists(studentData.id)) {
    throw new Error('User Already Exists!');
  }

  const result = await student.save(); // built in instance method

  return result;
};

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentsFromDB = async (id: string) => {
  //   const result = await Student.findOne({ id });

  const result = await Student.aggregate([
    {
      $match: { id: id },
    },
  ]);

  return result;
};

const deleteStudentsFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });

  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentsFromDB,
  deleteStudentsFromDB,
};
