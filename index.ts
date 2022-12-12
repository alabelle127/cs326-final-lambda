import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import { Auth } from "googleapis";
import { MongoClient, ServerApiVersion } from "mongodb";
import path from "path";
import { get_google_auth_url, handle_google_auth_redirect } from "./api/google";
import { login, logout, me } from "./api/login";
import { get_notifications, send_meeting_request, create_meeting } from "./api/notifications";
import { register, username_exists } from "./api/register";
import { search } from "./api/search";
import {
  get_compatible_partners,
  get_matches,
  get_meetings,
  get_partners,
  get_previous_courses,
  get_registered_classes,
  get_user,
  set_registered_classes,
  set_user,
} from "./api/users";

declare module "express-session" {
  interface SessionData {
    userID: string | null;
    credentials: Auth.Credentials | undefined;
  }
}

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

(async () => {
  try {
    await client.connect();
    app.locals.client = client;

    if (!process.env.SECRET) {
      throw new Error("SECRET environment variable not set");
    }
    app.use(
      session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 1000 * 3600 * 24 * 7,
        },
        store: MongoStore.create({
          client: client,
          dbName: "users",
        }),
      })
    );

    // Serve HTML/js/css files
    app.use(express.static("public"));

    // Student profile
    app.get("/students/:studentID", (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../public/Student.html"));
    });

    /**
     * API Routes
     */

    /**
     * Google
     */
    app.get("/api/google_auth_url", get_google_auth_url);
    app.get("/api/google_auth", handle_google_auth_redirect);

    /**
     * Search
     */
    app.get("/api/classes/search", search);

    /**
     * Login/Logout
     */
    app.post("/api/login", login);
    app.post("/api/logout", logout);
    app.get("/api/me", me);
    app.post("/api/register", register);
    app.get("/api/exists/:username", username_exists);

    /**
     * User
     */
    app.get("/api/users/:userID/registered_classes", get_registered_classes);
    app.post("/api/users/:userID/registered_classes", set_registered_classes);
    app.get("/api/users/:userID/previousCourses", get_previous_courses);
    app.get("/api/users/:userID", get_user);
    app.post("/api/users/:userID", set_user);
    app.get("/api/users/:userID/compatible_partners", get_compatible_partners);
    app.get("/api/users/:userID/matches", get_matches);
    app.get("/api/users/:userID/meetings", get_meetings);
    app.get("/api/users/:userID/partners", get_partners);
    /**
     * Meetings
     */
    app.get("/api/notifications/:userID", get_notifications);
    app.post("/api/notifications/:userID1/:userID2", send_meeting_request);
    app.get("/api/users/:userID/get_meetings", get_meetings);
    app.post("/api/notifcations/:userID1/:userID2/create_meeting", create_meeting);

    app.listen(port, () => {
      console.log(`[server]: Server is running at https://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
    await client.close();
  }
})();
