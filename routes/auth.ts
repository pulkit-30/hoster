import express from "express";
import User from "../models/user";
import signJwt from "../tokens/sign";
import Tokens from "../models/tokens";
import { generateAuthUrl, getUserProfile, verifyCode } from "../oauth/auth";

const router = express.Router();

// generate auth url
router.get("/g/user", (req, res) => {
  const url = generateAuthUrl(req.query.q as string | undefined);
  return res.status(200).json({
    success: true,
    url,
    message: "url generated successfully.",
  });
});

// callback url to verify user
router.get("/g/callback", async (req, res) => {
  try {
    if (!req.query.code) {
      return res.send("Invalid Request");
    }
    // verify code
    const code = req.query.code as string;
    const tokens = await verifyCode({ code });

    // get user profile
    const user = await getUserProfile();
    if (!user) {
      throw new Error("invalid user");
    }
    // find existing user
    let userRecord = await User.findOne({ email: user.email });
    if (!userRecord) {
      // no user found then create token record.
      userRecord = await User.create(user);
      await Tokens.create({
        user: userRecord.id,
        access_token: tokens.access_token,
      });
    } else {
      // else update user token records
      await Tokens.updateOne(
        {
          user: userRecord.id,
        },
        {
          access_token: tokens.access_token,
        }
      );
    }

    // generate jwt auth token
    const authToken = signJwt({
      user: userRecord._id,
    });

    if (req.query.state === "frontend") {
      return res
        .status(200)
        .redirect(`${process.env.PUBLIC_FRONTEND_URL}/auth?token=${authToken}`);
    }
    // return response
    return res
      .status(200)
      .set({ [process.env.AUTH_HEADER]: authToken })
      .json({
        success: true,
        message: "user authorized",
        authToken,
      });
  } catch (err) {
    // catch any error
    // return 400 response
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
