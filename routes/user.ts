import express from "express";
import userAuth from "../middleware/userAuth";
import Token from "../models/tokens";
import { addEvent, listEvents } from "../oauth/calander";
import findAllBustSlots from "../utils/findAllBusySlots";
const router = express.Router();

// get hosts busy slots
router.get("/:id/calender/busy", userAuth, async (req, res) => {
  let { maxResults, timeMin, timeMax, summary } = req.query;
  const { host } = req.body;
  const { access_token } = await Token.findOne({
    user: host._id,
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
});

// add an event to host calender
router.post("/:id/calender/add", userAuth, async (req, res) => {
  try {
    const { host } = req.body;
    const { access_token } = await Token.findOne({
      user: host._id,
    });
    const { location, start, end, summary, description, attendees } = req.body;
    if (!attendees.length) {
      return res.status(400).json({
        success: false,
        message: "invalid attendee list",
      });
    }
    if (!attendees.includes(host.email)) {
      attendees.push(host.email);
    }
    const events = await listEvents(access_token, {
      maxResults: 30,
      timeMin: new Date(start),
      timeMax: new Date(end),
    });

    if (events.length) {
      return res.status(400).json({
        success: false,
        message: "in between busy slot.",
      });
    }

    const event = {
      summary,
      location,
      description,
      start: {
        dateTime: new Date(start),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: new Date(end),
        timeZone: "Asia/Kolkata",
      },
      recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
      attendees: attendees.map((email: string) => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    const request = addEvent(access_token, event);

    return res.status(200).json({
      success: true,
      event,
      addedEvent: request,
      message: "event added.",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
