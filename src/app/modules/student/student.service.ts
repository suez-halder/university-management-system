// src/app/modules/student/student.service.ts
import { Student } from "./student.interface";
import { StudentModel } from "./student.model";

const createStudentIntoDB = async (student: Student) => {
    const result = await StudentModel.create(student);
    return result;
};

const getAllStudentsFromDB = async () => {
    const result = await StudentModel.find();
    return result;
};

const getSingleStudentsFromDB = async (id: string) => {
    const result = await StudentModel.findOne({ id }); // eita mongodb er id na, eijnw _id deya hoynai
    return result;
};

export const StudentServices = {
    createStudentIntoDB,
    getAllStudentsFromDB,
    getSingleStudentsFromDB,
};
