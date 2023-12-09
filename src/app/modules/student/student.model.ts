// src/app/modules/student/student.model.ts

import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentModel,
  TUserName,
  StudentMethod,
} from './student.interface';
import config from '../../config';

// schema create
const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'], // Validation message for missing First Name
    maxlength: [20, 'First Name cannot be 20 characters'],
    trim: true, // whitespace remove korte chaile trim use korte hoy,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'], // Validation message for missing Last Name
  },
});

const GuardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father Name is required'], // Validation message for missing Father Name
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation is required'], // Validation message for missing Father Occupation
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father Contact Number is required'], // Validation message for missing Father Contact Number
  },
  motherName: {
    type: String,
    required: [true, 'Mother Name is required'], // Validation message for missing Mother Name
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation is required'], // Validation message for missing Mother Occupation
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother Contact Number is required'], // Validation message for missing Mother Contact Number
  },
});

const LocalGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local Guardian Name is required'], // Validation message for missing Local Guardian Name
  },
  occupation: {
    type: String,
    required: [true, 'Local Guardian Occupation is required'], // Validation message for missing Local Guardian Occupation
  },
  contactNo: {
    type: String,
    required: [true, 'Local Guardian Contact Number is required'], // Validation message for missing Local Guardian Contact Number
  },
  address: {
    type: String,
    required: [true, 'Local Guardian Address is required'], // Validation message for missing Local Guardian Address
  },
});

const studentSchema = new Schema<TStudent, StudentModel, StudentMethod>(
  {
    id: { type: String, required: [true, 'ID is required'], unique: true },
    password: {
      type: String,
      required: [true, 'Password is required'],
      maxlength: [20, 'Password cannot be more than 20 characters'],
    },
    name: {
      type: userNameSchema,
      required: true,
    },
    gender: {
      type: String,
      enum: {
        // built in validation for enum type
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not valid',
      },
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: {
      type: String,
      required: true,
      message: 'Contact Number is required',
    }, // Validation message for missing Contact Number
    emergencyContactNo: {
      type: String,
      required: true,
      message: 'Emergency Contact Number is required',
    }, // Validation message for missing Emergency Contact Number
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: {
      type: GuardianSchema,
      required: true,
    },
    localGuardian: {
      type: LocalGuardianSchema,
      required: true,
    },
    profileImg: { type: String },
    isActive: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// virtual
studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

// mongoose middlewares (pre and post)
// pre save middleware / hook: will work on create() or save()

studentSchema.pre('save', async function (next) {
  // console.log(this, 'pre hook: We will save our data');

  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // eikhane this refer kore document ke

  // hashing password and save into db
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds), // jehetu saltRounds number hisebe ashbe, eijnw Number diye wrap kore dite hobe
  );
  next();
});

// post save middleware / hook
studentSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// Query Middleware
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });

  next();
});

studentSchema.pre('findOne', function (next) {
  this.findOne({ isDeleted: { $ne: true } });

  next();
});

// [ { '$match': { isDeleted: {$ne: true} } }  ,{ '$match': { id: 'BD202ffff566' } } ]

// Aggregation middleware
studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } }); // je document gula te isDeleted property true nai, sei property gula jabe

  next();
});

// creating custom instance method
studentSchema.methods.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

// create a model
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
