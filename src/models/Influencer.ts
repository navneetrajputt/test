import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs"

export interface IInfluencer {
  email: string;
  password: string;
  name: string;
  profilePicture?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  category: string; // e.g., Tech, Fashion, Fitness
  followersCount?: number;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const influencerSchema = new Schema<IInfluencer>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    profilePicture: { type: String },
    socialLinks: {
      instagram: { type: String },
      youtube: { type: String },
      tiktok: { type: String },
    },
    category: { type: String, required: true },
    followersCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

influencerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Influencer = models?.Influencer || model<IInfluencer>("Influencer", influencerSchema);

export default Influencer;
