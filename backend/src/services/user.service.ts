import bcrypt from "bcrypt";
import { createUser } from "../repositories/user.repository.js";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await createUser(
    name,
    email,
    passwordHash
  );

  return user;
};