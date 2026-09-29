import bcrypt from "bcrypt";
import { findUserByEmail } from "../repositories/user.repository.js";
import { generateAccessToken } from "../utils/jwt.js";

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = generateAccessToken(
    user.id.toString(),
    user.role
  );

  return {
    user:{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    },
    accessToken
  };
};