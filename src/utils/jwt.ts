import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export function generateToken(payload: object) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
}
