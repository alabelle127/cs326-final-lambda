import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import express, { Express } from "express";
import session from "express-session";
import { MongoClient, ServerApiVersion } from "mongodb";
import { login, logout, me } from "./api/login";
import {
  create_meeting,
  get_notifications,
  send_meeting_request,
} from "./api/notifications";
import { register } from "./api/register";
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
import { get_student } from "./api/students";

declare module "express-session" {
  interface SessionData {
    userID: string | null;
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

    /**
     * API Routes
     */

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
    app.post("/api/create_meeting", create_meeting);

    /**
     * Students
     */
    app.get("/api/student/:studentID", get_student);

app.listen(port, () => {
      console.log(`[server]: Server is running at https://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
    await client.close();
  }
})();
