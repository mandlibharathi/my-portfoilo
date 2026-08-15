import {
  Schema,
  models,
  model,
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
      enum: ["admin", "manager", "user"],
      required: true,
      unique: true,
    },

    description: {
      type: String,
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

export const Role =
  models.Role ||
  model<IRole>("Role", RoleSchema);