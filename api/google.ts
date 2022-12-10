import dotenv from "dotenv";
import { Request, Response } from "express";
import { Auth, calendar_v3, google } from "googleapis";
import moment from "moment-timezone";

import { FALL_2022_DAYS } from "./data/2022_fall_days";

dotenv.config();

function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:8080/api/google_auth"
  );
}

export function get_google_auth_url(req: Request, res: Response) {
  const oauth_client = createOAuthClient();
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  const url = oauth_client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
  res.json({
    url: url,
  });
}

export async function handle_google_auth_redirect(req: Request, res: Response) {
  const oauth_client = createOAuthClient();
  const code = req.query.code;
  if (typeof code !== "string") {
    return res.sendStatus(502);
  }
  const { tokens } = await oauth_client.getToken(code);
  req.session.credentials = tokens;
  req.session.save();
  res.send(
    `<!doctype html>
    <html lang="en">
    <head><title>Success</title></head>
    <body>
    Success. You may now close this page
    </body>
    </html>`
  );
}

async function createClassEvent(
  calendar: calendar_v3.Calendar,
  calendarId: string,
  curDay: Date,
  cls: any
) {
  const event: any = {
    summary: cls.class.subject.id + " " + cls.class.number,
    description: cls.class.name,
  };
  if (cls.room) {
    event["location"] = cls.room;
  }
  if (cls.meeting_times) {
    let start: Date | moment.Moment = new Date(curDay.getTime());
    let end: Date | moment.Moment = new Date(curDay.getTime());
    start.setHours(Math.floor(cls.meeting_times.startTime / 100));
    start.setMinutes(cls.meeting_times.startTime % 100);
    end.setHours(Math.floor(cls.meeting_times.endTime / 100));
    end.setMinutes(cls.meeting_times.endTime % 100);
    start = moment(start).tz("America/New_York", true);
    end = moment(end).tz("America/New_York", true);
    event["start"] = {
      dateTime: start.toISOString(),
    };
    event["end"] = {
      dateTime: end.toISOString(),
    };
  }
  const r = await calendar.events.insert({
    calendarId: calendarId,
    requestBody: event,
  });
  return r.data.htmlLink;
}

async function promiseAllInBatches(
  items: Array<Promise<any>>,
  batchSize: number
) {
  let position = 0;
  let results: Array<any> = [];
  while (position < items.length) {
    const itemsForBatch = items.slice(position, position + batchSize);
    results = [...results, ...(await Promise.all(itemsForBatch))];
    position += batchSize;
  }
  return results;
}

export async function createGoogleCalendar(
  classes: Array<any>, // TODO: Type signatures for database documents
  credentials: Auth.Credentials
) {
  const client = createOAuthClient();
  client.setCredentials(credentials);
  const calendar = google.calendar({ version: "v3", auth: client });

  const calendarId = (
    await calendar.calendars.insert({
      // Request body metadata
      requestBody: {
        // request body parameters
        description: "UMass Amherst class schedule for Fall 2022 semester",
        summary: "Class Schedule",
        timeZone: "America/New_York",
      },
    })
  ).data.id;

  if (!calendarId) {
    return;
  }

  const promises: Array<Promise<string | undefined | null>> = [];
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  for (
    let curDay = FALL_2022_DAYS.start;
    curDay <= FALL_2022_DAYS.end;
    curDay.setDate(curDay.getDate() + 1)
  ) {
    const curDateStr = curDay.toISOString().substring(0, 10);
    if (FALL_2022_DAYS.daysOff.includes(curDateStr)) {
      // day is a holiday
      continue;
    }
    let day = days[curDay.getDay()];
    if (curDateStr in FALL_2022_DAYS.specialDays) {
      // day is on an abnormal schedule
      day = FALL_2022_DAYS.specialDays[curDateStr];
    }
    for (const cls of classes) {
      if (cls.meeting_times !== null && cls.meeting_times.days[day]) {
        // class meets on curDay - make event for calendar
        promises.push(createClassEvent(calendar, calendarId, curDay, cls));
      }
    }
  }

  await promiseAllInBatches(promises, 4);
}
