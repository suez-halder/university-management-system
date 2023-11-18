// src/app/modules/student/student.controller.ts
import { Request, Response } from "express";
import { StudentServices } from "./student.service";

const createStudent = async (req: Request, res: Response) => {
    try {
        const { student: studentData } = req.body; // amra student er moddhe data ke pathaisi, tai destructuring kore nicchi

        // will call service function to send this data
        const result = await StudentServices.createStudentIntoDB(studentData);

        // send response
        res.status(200).json({
            success: true,
            message: "Student created successfully",
            data: result,
        });
    } catch (error) {
        console.log(error);
    }
};

const getAllStudents = async (req: Request, res: Response) => {
    try {
        // will call service function to send this data
        const result = await StudentServices.getAllStudentsFromDB();

        // send response
        res.status(200).json({
            success: true,
            message: "Students retrieved successfully",
            data: result,
        });
    } catch (error) {
        console.log(error);
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
            message: "Single student retrieved successfully",
            data: result,
        });
    } catch (error) {
        console.log(error);
    }
};

export const StudentControllers = {
    createStudent,
    getAllStudents,
    getSingleStudents,
};
