const { google } = require("googleapis");
import { getAuth } from "./auth";

async function listEvents(
  access_token: string,
  { timeMax, timeMin, maxResults }: any
) {
  try {
    const auth = getAuth(access_token);
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date(timeMin || "").toISOString(),
      timeMax: new Date(timeMax || "").toISOString(),
      maxResults: maxResults || 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
      return [];
    }
    return events;
  } catch (err) {
    console.log(err);
    return {};
  }
}

async function addEvent(access_token: string, event: any) {
  try {
    const auth = getAuth(access_token);
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });
    return res;
  } catch (err) {
    console.log(err);
    throw {};
  }
}

export { listEvents, addEvent };
