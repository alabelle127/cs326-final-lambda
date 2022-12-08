import dotenv from "dotenv";
import { Request, Response } from "express";
import { Auth, google } from "googleapis";

dotenv.config();

export function get_google_auth_url(req: Request, res: Response) {
  const oauth_client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:8080/api/google_auth"
  );
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
  const oauth_client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:8080/api/google_auth"
  );
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

export async function createGoogleCalendar(
  classes: Array<Object>,
  credentials: Auth.Credentials
) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:8080/api/google_auth"
  );
  client.setCredentials(credentials);
  const calendar = google.calendar({ version: "v3", auth: client });

  // TODO Create calendar with class schedule and return URL
  // Currently prints next 10 events on user's calendar
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log("No upcoming events found.");
    return "url";
  }
  console.log("Upcoming 10 events:");
  events.map((event, i) => {
    const start = event.start?.dateTime || event.start?.date;
    console.log(`${start} - ${event.summary}`);
  });

  return "url";
}
