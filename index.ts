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

/**
 * API Routes
 */

/**
 * Search
 */
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

/**
 * Login/Logout
 */
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
  const userID = req.session.userID ?? null;
  res.json({
    loggedIn: userID != null,
    userID: userID,
  });
});

/**
 * Register
 */
app.post("/api/register", (req, res) => {
  console.log(
    `Attempting to register new account with ${req.body.classes.length} classes and username: ${req.body.username}`
  );
  res.json({
    success: true,
  });
});

/**
 * User
 */
app.get("/api/users/:userID/registered_classes", (req, res) => {
  console.log(
    `Receive API request to get registered classes for user ${req.params.userID}, by user ${req.session.userID}`
  );
  const userID = parseInt(req.params.userID);
  if (isNaN(userID) || userID <= 0) {
    // Invalid userID in request
    res.status(400).json({
      success: false,
      message: "userID must be integer > 0",
    });
  }
  // Check if authorized to access this data
  // Placeholder data
  const privateProfile = true;
  if (!privateProfile || req.session.userID === userID) {
    res.json({
      success: true,
      data: [
        {
          display_text: "CS 453 (Not current)",
          current: false,
          department: "CS",
          class_number: 453,
          class_perma_id: "NC-CS453",
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
          display_text: "MATH 551 (Johnston) MoWeFr 10:10-11:00 [01001]",
          current: true,
          department: "MATH",
          class_number: 551,
          class_id: 1001,
          class_perma_id: "2022F-01001",
          professor: "Hans Johnston",
          meeting_times: [
            {
              day: "Mo",
              start_time: 1010,
              end_time: 1100,
            },
            {
              day: "We",
              start_time: 1010,
              end_time: 1100,
            },
            {
              day: "Fr",
              start_time: 1010,
              end_time: 1100,
            },
          ],
        },
      ],
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User's profile is private",
    });
  }
});

app.post("/api/users/:userID/registered_classes", (req, res) => {
  const newClasses = req.body.classes;
  console.log(
    `Received API request to set registered classes to: ${req.body.classes}`
  );
  const userID = parseInt(req.params.userID);
  if (isNaN(userID) || userID <= 0) {
    // Invalid userID in request
    res.status(400).json({
      success: false,
      message: "userID must be integer > 0",
    });
  }
  // Check if authorized to change this data
  if (req.session.userID === userID) {
    // Change data
    res.json({
      success: true,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
});

/**
 * Group
 */

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
