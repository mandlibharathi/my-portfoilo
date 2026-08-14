
import mongoose, {
  Schema,
  type Model,
} from "mongoose";

export type UserRole =
  | "admin"
  | "manager"
  | "user";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "admin",
        "manager",
        "user",
      ],
      default: "user",
    },

    active: {
      type: Boolean,
      default: true,
    },

    permissions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>(
    "User",
    UserSchema
  );

