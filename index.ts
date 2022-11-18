import dotenv from "dotenv";
import express, { application, Express } from "express";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    userID: number | null;
  }
}

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 8080;

// MongoDB database
const uri = process.env.MONGODB_URI;

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
    `Received API request to get registered classes for user ${req.params.userID}, by user ${req.session.userID}`
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
    `Received API request to set registered classes to: ${newClasses}`
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

app.get("/api/users/:userID", (req, res) => {
  console.log(
    `Received API request to get user data ${req.params.userID}, by user ${req.session.userID}`
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
      data: {
        username: "gkcho",
        real_name: "Gavin Cho",
        userID: 1001,
        profile_picture:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/512px-Circle-icons-profile.svg.png",
        description: "Senior CS & Math major",
        contact_info: "Call or text me 413-555-5555",
        looking_for_partners: true,
        private_profile: true,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User's profile is private",
    });
  }
});

app.post("/api/users/:userID", (req, res) => {
  console.log(
    `Received API request to set user data ${req.params.userID}, by user ${req.session.userID}`
  );
  const userID = parseInt(req.params.userID);
  if (isNaN(userID) || userID <= 0) {
    // Invalid userID in request
    res.status(400).json({
      success: false,
      message: "userID must be integer > 0",
    });
  }
  // Check if authorized to modify this data
  // Placeholder data
  const privateProfile = true;
  if (req.session.userID === userID) {
    res.json({
      success: true,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
});



// Some suggested API endpoints for you guys

// GET /api/users/:userID/compatible_partners - return compatible study partners for user
app.get("/api/users/:userID/compatible_partners", (req, res) => {
  console.log(
    `Received API request to get list of compatible partners for user ${req.session.userID}`
  );
  const userID = parseInt(req.params.userID);
  if (isNaN(userID) || userID <= 0) {
    // Invalid userID in request
    res.status(400).json({
      success: false,
      message: "Invalid User ID"
    });
  }

  res.json({
    success: true,
    // First two are examples, rest is filler
    data: [
      {
        name: "David Barrington",
        username: "dBKewper",
        compatible_classes: [
          "CS 326",
          "Math 471"
        ],
        major: "Computer Science",
        minor: "Mathematics",
        user_notes: "this stuff hard pls help :("
      },
      {
        name: "Michael Stevens",
        username: "Vsauce",
        compatible_classes: [
          "CS 576"
        ],
        major: "Physics",
        minor: "Computer Science",
        user_notes: "Unity is not my strongsuit"
      },
      {
        name: "NoName",
        username: "Nothing",
        compatible_classes: [
          "CS 453"
        ],
        major: "Computer Science",
        minor: "Mathematics",
        user_notes: "Nothing to see here"
      },
      {
        name: "NoName",
        username: "Nothing",
        compatible_classes: [
          "CS 453"
        ],
        major: "Computer Science",
        minor: "Mathematics",
        user_notes: "Nothing to see here"
      },
      {
        name: "NoName",
        username: "Nothing",
        compatible_classes: [
          "CS 453"
        ],
        major: "Computer Science",
        minor: "Mathematics",
        user_notes: "Nothing to see here"
      },
      {
        name: "NoName",
        username: "Nothing",
        compatible_classes: [
          "CS 453"
        ],
        major: "Computer Science",
        minor: "Mathematics",
        user_notes: "Nothing to see here"
      },
      {
        name: "NoName",
        username: "Nothing",
        compatible_classes: [
          "CS 453"
        ],
        major: "Computer Science",
        minor: "Mathematics",
        user_notes: "Nothing to see here"
      }
    ]
  });

  // // Placeholder Data
  // if (req.session.userID === userID) {
    
  // } else {
  //   res.status(401).json({
  //     success: false,
  //     message: "Unauthorized user"
  //   });
  // }
});
// GET /api/users/:userID/matches - return incoming matches for user
app.get("/api/users/:userID/matches", (req, res) => {
  console.log(
    `Recieved API request to get list of matches for user ${req.session.userID}`
  );
  const userID = parseInt(req.params.userID);
  if (isNaN(userID) || userID <= 0) {
    // Invalid userID in request
    res.status(400).json({
      success: false,
      message: "Invalid User ID"
    });
  }

  // Placeholder Data
  if(req.session.userID === userID) {
    res.json({
      success: true,

      data: [
        {
          name: "NoName",
          username: "Nothing",
          compatible_classes: [
            "CS 453"
          ],
          major: "Computer Science",
          minor: "Mathematics",
          user_notes: "Nothing to see here"
        },
        {
          name: "NoName",
          username: "Nothing",
          compatible_classes: [
            "CS 453"
          ],
          major: "Computer Science",
          minor: "Mathematics",
          user_notes: "Nothing to see here"
        },
        {
          name: "NoName",
          username: "Nothing",
          compatible_classes: [
            "CS 453"
          ],
          major: "Computer Science",
          minor: "Mathematics",
          user_notes: "Nothing to see here"
        },
        {
          name: "NoName",
          username: "Nothing",
          compatible_classes: [
            "CS 453"
          ],
          major: "Computer Science",
          minor: "Mathematics",
          user_notes: "Nothing to see here"
        },
        {
          name: "NoName",
          username: "Nothing",
          compatible_classes: [
            "CS 453"
          ],
          major: "Computer Science",
          minor: "Mathematics",
          user_notes: "Nothing to see here"
        }
      ]
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized user"
    });
  }
});
// GET /api/users/:userID/meetings - return weekly meetings for user
app.get("/api/users/:userID/meetings", (req, res) => {
  console.log(`request for weekly meetings for user: ${req.params.userID}, by user ${req.session.userID}`);

  const userID = parseInt(req.params.userID);
  if (isNaN(userID) || userID <= 0) {
    // Invalid userID in request
    res.status(400).json({
      success: false,
      message: "userID must be integer > 0",
    });
  }

  const privateProfile = true;
  if (!privateProfile || req.session.userID === userID) {
    res.json({
      success: true,
      data: {
        meetings: [
          {
            day: "Mo",
            start_time: 1430,
            end_time: 1530,
          },
          {
            day: "We",
            start_time: 1500,
            end_time: 1600,
          },
          {
            day: "Fr",
            start_time: 1430,
            end_time: 1530,
          }
        ]
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User's profile is private",
    });
  }
});
// GET /api/users/:userID/partners - return study partners for user
app.get("/api/users/:userID/partners", (req, res) => {
  console.log(`request for study partners for user, ${req.params.userID}, by user ${req.session.userID}`);

  const userID = parseInt(req.params.userID);
  if (isNaN(userID) || userID <= 0) {
    // Invalid userID in request
    res.status(400).json({
      success: false,
      message: "userID must be integer > 0",
    });
  }

  const privateProfile = true;
  if (!privateProfile || req.session.userID === userID) {
    res.json({
      success: true,
      data: {
        partners: ["Chris Manning", "John Doe", "Monty Python"]
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User's profile is private",
    });
  }
});

// GET /api/notifications/:userID - user's incoming notifications/match requests
app.get("/api/notifications/:userID", (req, res) => {
  console.log(`request for notifications/match requests for user, ${req.params.userID}, by user ${req.session.userID}`);

  const userID = parseInt(req.params.userID);
  if (isNaN(userID) || userID <= 0) {
    // Invalid userID in request
    res.status(400).json({
      success: false,
      message: "userID must be integer > 0",
    });
  }

  const privateProfile = true;
  if (!privateProfile || req.session.userID === userID) {
    res.json({
      success: true,
      data: {
        matchReqs: ["CSMajor123", "MathMajor456"]
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User's profile is private",
    });
  }
});

// GET /api/users/:userID/previousCourses - user's previous courses
app.get("/api/users/:userID/previousCourses", (req, res) => {
  console.log(`request for previous courses for user, ${req.params.userID}, by user ${req.session.userID}`);

  const userID = parseInt(req.params.userID);
  if (isNaN(userID) || userID <= 0) {
    // Invalid userID in request
    res.status(400).json({
      success: false,
      message: "userID must be integer > 0",
    });
  }

  const privateProfile = true;
  if (!privateProfile || req.session.userID === userID) {
    res.json({
      success: true,
      data: {
        data: [
          "CS187",
          "CS220",
          "CS230",
          "CS240",
          "CS240",
          "CS311",
        ]
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User's profile is private",
    });
  }
});

// POST /api/notifications/:userID1/:userID2 - send match request from user1 to user2
app.post("/api/notifications/:userID1/:userID2", (req, res) => {
  console.log(
    `Recieved API request to send an invitiation from user ${req.params.userID1} to ${req.params.userID2}`
  );
  const userID1 = parseInt(req.params.userID1);
  const userID2 = parseInt(req.params.userID2);
  if (isNaN(userID1) || userID1 <= 0 || isNaN(userID2) || userID2 <= 0) {
    // Invalid userID in request
    res.status(400).json({
      success: false,
      message: "Invalid User ID"
    });
  }

  if(req.session.userID === userID1) {
    // Send match request from user 1 to user 2
    res.json({
      success: true,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
});

// POST /api/create_meeting - create a weekly meeting between 2 users
app.post("/api/create_meeting", (req, res) =>  {
  const user1 = req.body.user1;
  const user2 = req.body.user2;
  console.log(
    `Recieved API request to create a meeting between ${user1} and ${user2}`
  );
  const available_times = [
    {
      class: "CS 326",
      meeting_times: [
        {
          day: "Mon",
          start_time: 1900,
          end_time: 2100
        },
        {
          day: "Fri",
          start_time: 1300,
          end_time: 1500
        }
      ]
    }
  ];

  if(available_times.length > 0) {
    res.json({
      success: true,
      data: available_times
    });
  } else {
    res.status(401).json({
      success: false,
      message: "unable to find desired meeting time"
    });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
