import { Response, Request, NextFunction } from "express";
import User from "../models/user";

async function userAuth(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  if (!id) {
    // invalid id
    // send not found
    return res.status(404).json({
      success: false,
      message: "not found",
    });
  }
  const host = await User.findById(id);
  if (!host) {
    // invalid id
    // no user found
    // send 404 response
    return res.status(404).json({
      success: false,
      message: "not found",
    });
  }
  if (!req.body) {
    req.body = {};
  }
  req.body.host = host;
  return next();
}
export default userAuth;
