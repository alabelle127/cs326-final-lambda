import exp from "constants";
import { FindCursor, MongoClient } from "mongodb";
import { Request, Response } from "express";
import { MiniCrypt } from "./miniCrypt";

export function get_registered_classes(req: Request, res: Response) {
  console.log(
    `Received API request to get registered classes for user ${req.params.userID}, by user ${req.session.userID}`
  );
  const userID = req.params.userID;
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
}

export function set_registered_classes(req: Request, res: Response) {
  const newClasses = req.body.classes;
  console.log(
    `Received API request to set registered classes to: ${newClasses}`
  );
  const userID = req.params.userID;
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
}

export function get_user(req: Request, res: Response) {
  console.log(
    `Received API request to get user data ${req.params.userID}, by user ${req.session.userID}`
  );
  const userID = req.params.userID;

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
}

export function set_user(req: Request, res: Response) {
  console.log(
    `Received API request to set user data ${req.params.userID}, by user ${req.session.userID}`
  );
  const userID = req.params.userID;
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
}

// Andrew (done)
export async function get_compatible_partners(req: Request, res: Response) {
  console.log(
    `Received API request to get list of compatible partners for user ${req.session.userID}`
  );
  const userID = parseInt(req.params.userID);
  if (isNaN(userID) || userID <= 0) {
    // Invalid userID in request
    res.status(400).json({
      success: false,
      message: "Invalid User ID",
    });
  }

  res.json({
    success: true,
    data: await findPartnerAndClass(
      req.app.locals.client,
      req.body.classes
    )
  });
}

async function get_matches_helper(client: MongoClient, username: string) {
  const matches_cursor = client.db("matches").collection("matches")
    .find({
      "$or": [
        {"user1":username},
        {"user2":username}
      ]
    });

  const matches: Array<Object> = []

  matches_cursor.forEach(match => {

    client.db("users").collection("members")
      .findOne({ "username": match["user1"] === username? match["user2"] : match["user1"]}, {
        projection: {
          "username": 1,
          "real_name": 1,
          "classes": 1
        }
      })
      .then(user => {
        if (user) {
          matches.push({
            "username": user["username"],
            "real_name": user["real_name"],
            "classes": user["classes"]
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  });

  return matches;
}

// Andrew (done)
export async function get_matches(req: Request, res: Response) {
  console.log(
    `Recieved API request to get list of matches for user ${req.session.userID}`
  );
  const userID = req.params.userID;

  // Placeholder Data
  if (req.session.userID === userID) {
    res.json({
      success: true,
      data: await get_matches_helper(
        req.app.locals.client,
        req.body.username
      ),
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }
}

async function get_meetings_helper(client: MongoClient, parters: Array<Object>) {

}

// Andrew
export function get_meetings(req: Request, res: Response) {
  console.log(
    `request for weekly meetings for user: ${req.params.userID}, by user ${req.session.userID}`
  );

  const userID = req.params.userID;
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
          },
        ],
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User's profile is private",
    });
  }
}

// Chris
// deprecated, functionally has been moved to the get_student api call in students.ts
export function get_partners(req: Request, res: Response) {
  console.log(
    `request for study partners for user, ${req.params.userID}, by user ${req.session.userID}`
  );

  const userID = req.params.userID;

  const privateProfile = true;
  if (!privateProfile || req.session.userID === userID) {
    res.json({
      success: true,
      data: {
        partners: ["Chris Manning", "John Doe", "Monty Python"],
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User's profile is private",
    });
  }
}

// Chris
// deprecated, functionally has been moved to the get_student api call in students.ts
export function get_previous_courses(req: Request, res: Response) {
  console.log(
    `request for previous courses for user, ${req.params.userID}, by user ${req.session.userID}`
  );

  const userID = req.params.userID;

  const privateProfile = true;
  if (!privateProfile || req.session.userID === userID) {
    res.json({
      success: true,
      data: {
        data: ["CS187", "CS220", "CS230", "CS240", "CS240", "CS311"],
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User's profile is private",
    });
  }
}

// Andrew (done)
export async function findPartnerAndClass(
  client: MongoClient,
  classes: Array<Object>
) {

  const compatible_partners: Array<Object> = [];

  for(const clss in classes) {
    const partnerCursor: FindCursor = client
      .db("users")
      .collection("members")
      .find({
        "classes" : clss
      })

    partnerCursor.forEach(partner => {
      compatible_partners.push({
        "username": partner["username"],
        "real_name": partner["real_name"],
        "classes": partner["classes"]
      })
    });
  }

  return compatible_partners;
}