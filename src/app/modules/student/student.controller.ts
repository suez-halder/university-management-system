// src/app/modules/student/student.controller.ts

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { StudentServices } from './student.service';

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // will call service function to send this data
    const result = await StudentServices.getAllStudentsFromDB();

    // send response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Students retrieved successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getSingleStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // will call service function to send this data
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentsFromDB(studentId);

    // send response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single student retrieved successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;

    const result = await StudentServices.deleteStudentsFromDB(studentId);

    // send response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student deleted successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const StudentControllers = {
  getAllStudents,
  getSingleStudents,
  deleteStudent,
};
