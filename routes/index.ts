import express from "express";
const router = express.Router();
import auth from "../middleware/auth";
import { addEvent, listEvents } from "../oauth/calander";
import Token from "../models/tokens";
import findAllBustSlots from "../utils/findAllBusySlots";
import generateUrl from "../utils/generateUrl";

// get user upcoming event lists
router.get("/events", auth, async (req, res) => {
  try {
    let { maxResults, timeMin, timeMax, summary } = req.query;
    const { access_token } = await Token.findOne({
      user: req.body.user._id,
    });
    let events = await listEvents(access_token, {
      maxResults: maxResults || 30,
      timeMin: timeMin || new Date(),
      timeMax: timeMax || new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
    });
    if (summary) {
      events = findAllBustSlots(events);
    }
    return res.status(200).json({
      success: true,
      events,
      message: "request success.",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// get user public url to share with non-hosts
router.get("/events/generate/url", auth, async (req, res) => {
  try {
    const user = req.body.user;
    // generate a public url for given user
    // which can be shared with non-hosts
    const url = generateUrl(user._id);
    return res.status(200).json({
      success: true,
      url,
      message: "public user generated successfully.",
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message || "something went wrong.",
    });
  }
});

export default router;
