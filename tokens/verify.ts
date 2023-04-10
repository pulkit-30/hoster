import jwt from "jsonwebtoken";
const secret = process.env.TOKEN_SECRET;
const verifyJwt = (token: string) => {
  if (!secret) {
    throw new Error("invalid token secret");
  }
  const decoded = jwt.verify(token, secret);
  return decoded;
};
export default verifyJwt;
