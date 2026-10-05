import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hash_password = (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};