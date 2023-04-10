import jwt from "jsonwebtoken";

const secret: string = process.env.TOKEN_SECRET || "";

const signJwt = (payload: Record<string, any>) => {
  if (!secret) {
    throw new Error("invalid token secret");
  }
  const token: string = jwt.sign(payload, secret);
  return token;
};

export default signJwt;
