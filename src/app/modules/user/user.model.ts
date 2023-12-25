// * src/app/modules/user/user.model.ts

import { model, Schema } from 'mongoose';
import config from '../../config';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0, // ! eikhane unselect kora hoise, eijnw jokhn laagbe explicitely select korte hobe jemon isUserExistsByCustomId ei static method use korar shomoye
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date, // ! password kon shomoye change hocceh seta track korte hobe
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set empty string after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// custom static method for checking user using id
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({
    id,
  }).select('+password'); // + deya mane, existing datar sathe password field add hobe
};

// custom static method for checking similar password
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// password ki jwt issue korar por change kora hoise?
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;

  // console.log(passwordChangedTime > jwtIssuedTimestamp);

  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
