import mongoose, {
  Schema,
  type Model,
} from "mongoose";

export type RoleName =
  | "admin"
  | "manager"
  | "user";

export interface IRole {
  name: RoleName;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      enum: [
        "admin",
        "manager",
        "user",
      ],
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
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

export const Role: Model<IRole> =
  mongoose.models.Role ||
  mongoose.model<IRole>(
    "Role",
    RoleSchema
  );