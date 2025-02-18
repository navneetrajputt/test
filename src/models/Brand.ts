import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs"

export interface IBrand {
  email: string;
  password: string;
  name: string;
  logo?: string;
  website?: string;
  industry: string; // e.g., Fashion, Tech, Food
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    logo: { type: String },
    website: { type: String },
    industry: { type: String, required: true },
    socialMedia: {
      instagram: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
    },
  },
  { timestamps: true }
);

brandSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Brand = models?.Brand || model<IBrand>("Brand", brandSchema);

export default Brand;
