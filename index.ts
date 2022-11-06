import dotenv from "dotenv";
import express, { Express } from "express";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    userID: number | null;
  }
}

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 8080;

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
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML/js/css files
app.use(express.static("public"));

// API Endpoints

// Search
app.get("/api/classes/search", (req, res) => {
  const query = req.query.q;
  console.log(`Received API request for search with q=${query}`);
  // Placeholder data
  const responseData = [
    {
      display_text: "CS 326 (Not current)",
      current: false,
      department: "CS",
      class_number: 326,
      class_perma_id: "NC-CS326",
    },
    {
      display_text: "CS 326 (Berger) TuTh 1:00-2:15 [44866]",
      current: true,
      department: "CS",
      class_number: 326,
      class_id: 44866,
      class_perma_id: "2022F-44866",
      professor: "Emery Berger",
      meeting_times: [
        {
          day: "Tu",
          start_time: 1300,
          end_time: 1415,
        },
        {
          day: "Th",
          start_time: 1300,
          end_time: 1415,
        },
      ],
    },
    {
      display_text: "CS 326 (Klemperer) TuTh 1:00-2:15 [57113]",
      current: true,
      department: "CS",
      class_number: 326,
      class_id: 57113,
      class_perma_id: "2022F-57113",
      professor: "Peter Klemperer",
      meeting_times: [
        {
          day: "Tu",
          start_time: 1300,
          end_time: 1415,
        },
        {
          day: "Th",
          start_time: 1300,
          end_time: 1415,
        },
      ],
    },
  ];
  res.json(responseData);
});

// Login/logout
app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(
    `Received API request for login with username=${username}, password=${password}`
  );

  if (Math.random() < 0.5) {
    // Authentication failure
    console.log("Authentication failed");
    res.status(401).json({
      success: false,
      userID: null,
    });
  } else {
    // Authentication success
    console.log("Authentication successful");
    req.session.userID = 1001;
    res.json({
      success: true,
      userID: 1001,
    });
  }
});

app.post("/api/logout", (req, res) => {
  console.log(`Logging out user: ${req.session.userID}`);
  req.session.userID = null;
  res.sendStatus(200);
});

app.get("/api/me", (req, res) => {
  console.log(`Session requesting userID: ${req.session.id}`);
  const userID = req.session.userID ?? null;
  res.json({
    loggedIn: userID != null,
    userID: userID,
  });
});

// Register

// User

// Group

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
