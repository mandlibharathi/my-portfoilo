import mongoose, {
  Schema,
  models,
  model,
} from "mongoose";

const AuditLogSchema =
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },

      action: {
        type: String,
        required: true,
      },

      resource: {
        type: String,
        required: true,
      },

      resourceId: {
        type: String,
      },

      description: {
        type: String,
      },

      method: {
        type: String,
      },

      path: {
        type: String,
      },

      ipAddress: {
        type: String,
      },

      userAgent: {
        type: String,
      },

      status: {
        type: String,
        enum: [
          "success",
          "failed",
        ],
        default: "success",
      },
    },
    {
      timestamps: true,
    }
  );

export const AuditLog =
  models.AuditLog ||
  model(
    "AuditLog",
    AuditLogSchema
  );