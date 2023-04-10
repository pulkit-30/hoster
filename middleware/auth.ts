import { Response, Request, NextFunction } from "express";
import verifyJwt from "../tokens/verify";
import User from "../models/user";

async function auth(req: Request, res: Response, next: NextFunction) {
  let token = req.headers.authorization;
  if(!token) {
    return res.status(401).json({
      success: false,
      message: "unauthorized."
    });
  }
  token = token.split(" ")[1];
  const decodedToken = verifyJwt(token);
  if (!decodedToken) {
    return res.status(400).json({
      success: false,
      message: "unauthorized."
    });
  }
  const verifiedToken: any = decodedToken;
  if(!verifiedToken.user) {
    return res.status(401).json({
      success: false,
      message: "unauthorized"
    })
  }
  const user = await User.findById({
    _id: verifiedToken.user
  });
  if(!user) {
    return res.status(401).json({
      success: false,
      message: "unauthorized"
    })
  }
  if(!req.body) {
    req.body = {};
  }
  req.body.user = user;
  return next();
}
export default auth;
