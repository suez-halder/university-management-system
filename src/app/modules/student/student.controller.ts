// src/app/modules/student/student.controller.ts

import { Request, Response } from 'express';
import { StudentServices } from './student.service';
import StudentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    // creating a schema validation using Zod
    const { student: studentData } = req.body;

    // data validation using zod
    const zodparsedData = StudentValidationSchema.parse(studentData);

    const result = await StudentServices.createStudentIntoDB(zodparsedData);

    // send response
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
    });
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    // will call service function to send this data
    const result = await StudentServices.getAllStudentsFromDB();

    // send response
    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
    });
  }
};

const getSingleStudents = async (req: Request, res: Response) => {
  try {
    // will call service function to send this data
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentsFromDB(studentId);

    // send response
    res.status(200).json({
      success: true,
      message: 'Single student retrieved successfully',
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
    });
  }
};

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const result = await StudentServices.deleteStudentsFromDB(studentId);

    // send response
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
    });
  }
};

export const StudentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudents,
  deleteStudent,
};
