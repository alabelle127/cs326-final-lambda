import { Request, Response } from "express";
import { FindCursor, MongoClient, ObjectId } from "mongodb";
import { resourceUsage } from "process";

export async function get_registered_classes(req: Request, res: Response) {
  console.log(
    `Received API request to get registered classes for user ${req.params.userID}, by user ${req.session.userID}`
  );
  const client: MongoClient = req.app.locals.client;
  const userID = req.params.userID;

  let entry;
  try {
    entry = await client
      .db("users")
      .collection("members")
      .findOne({ _id: new ObjectId(userID) });
  } catch {
    return res.status(502).json({
      success: false,
      message: "Error fetching user from database",
    });
  }

  if (entry === null) {
    res.status(404).json({
      success: false,
      message: "Student does not exist",
    });
    return;
  }

  const privateProfile = entry.private_profile;
  if (!privateProfile || req.session.userID === req.params.userID) {
    const classIDs = entry.classes;
    const classes = await client
      .db("classes")
      .collection("2022 Fall")
      .find({
        _id: {
          $in: classIDs.map((classID: string) => new ObjectId(classID)),
        },
      })
      .toArray();
    res.json({
      success: true,
      data: classes,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
}

export async function set_registered_classes(req: Request, res: Response) {
  const newClasses = req.body.classes;
  console.log(
    `Received API request to set registered classes to: ${newClasses}`
  );

  const client: MongoClient = req.app.locals.client;
  const userID = req.params.userID;

  if (req.session.userID === userID) {
    try {
      await client
        .db("users")
        .collection("members")
        .updateOne(
          { _id: new ObjectId(userID) },
          {
            $set: {
              classes: newClasses,
            },
          }
        );
      return res.json({
        success: true,
      });
    } catch {
      return res.status(502).json({
        success: false,
        message: "Error setting classes",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
}

export async function get_user(req: Request, res: Response) {
  console.log(
    `Received API request to get user data ${req.params.userID}, by user ${req.session.userID}`
  );
  const client: MongoClient = req.app.locals.client;
  const userID = req.params.userID;

  let entry;
  try {
    entry = await client
      .db("users")
      .collection("members")
      .findOne({ _id: new ObjectId(userID) });
  } catch {
    return res.status(502).json({
      success: false,
      message: "Error fetching user from database",
    });
  }

  if (entry === null) {
    res.status(404).json({
      success: false,
      message: "Student does not exist",
    });
    return;
  }

  const privateProfile = entry.private_profile;

  if (!privateProfile || req.session.userID === req.params.userID) {
    // return all data if public profile or current user's data
    res.json({
      success: true,
      data: {
        username: entry.username,
        profile_picture: entry.profile_picture,
        real_name: entry.real_name,
        description: entry.description,
        contact_info: entry.contact,
        looking_for_partners: entry.looking_for_partners,
        currentCourses: entry.classes,
        previousCourses: [],
        partners: [],
      },
    });
  } else {
    // return only public data
    res.json({
      success: true,
      data: {
        username: entry.username,
        profile_picture: entry.profile_picture,
      },
    });
  }
}

export async function set_user(req: Request, res: Response) {
  console.log(
    `Received API request to set user data ${req.params.userID}, by user ${req.session.userID}`
  );
  const userID = req.params.userID;
  const client: MongoClient = req.app.locals.client;
  // Check if authorized to modify this data
  if (req.session.userID === userID) {
    await client
      .db("users")
      .collection("members")
      .updateOne(
        { _id: new ObjectId(userID) },
        {
          $set: {
            description: req.body.description,
            contact: req.body.contact,
            profile_picture: req.body.profile_picture,
            private_profile: req.body.private_profile,
            looking_for_partners: req.body.looking_for_partners,
          },
        }
      );
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

  const client: MongoClient = req.app.locals.client;
  const userID = req.params.userID;

  let entry;
  try {
    entry = await client
      .db("users")
      .collection("members")
      .findOne({ _id: new ObjectId(userID) });
  } catch {
    return res.status(502).json({
      success: false,
      message: "Error fetching user from database",
    });
  }

  if (entry === null) {
    res.status(404).json({
      success: false,
      message: "Student does not exist",
    });
    return;
  }

  const classes = entry["classes"];

  const partners = await findPartnersAndClass(client, classes);
  // console.log(`partners: ${partners}`);

  if(classes.length > 0) {
    res.json({
      success: true,
      // data: await findPartnersAndClass(client, classes),
      data: partners
    });
  } else {
    res.json({
      success: false,
      message: "User has not registered any classes"
    });
  }
}

async function get_matches_helper(client: MongoClient, username: string) {
  const matches_cursor = client
    .db("matches")
    .collection("matches")
    .find({
      $or: [{ user1: username }, { user2: username }],
    });

  const matches: Array<Object> = [];

  matches_cursor.forEach((match) => {
    client
      .db("users")
      .collection("members")
      .findOne(
        {
          username:
            match["user1"] === username ? match["user2"] : match["user1"],
        },
        {
          projection: {
            username: 1,
            real_name: 1,
            classes: 1,
          },
        }
      )
      .then((user) => {
        if (user) {
          matches.push({
            username: user["username"],
            real_name: user["real_name"],
            classes: user["classes"],
          });
        }
      })
      .catch((err) => {
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

  const client: MongoClient = req.app.locals.client;
  const userID = req.params.userID;

  let entry;
  try {
    entry = await client
      .db("users")
      .collection("members")
      .findOne({ _id: new ObjectId(userID) });
  } catch {
    return res.status(502).json({
      success: false,
      message: "Error fetching user from database",
    });
  }

  if (entry === null) {
    res.status(404).json({
      success: false,
      message: "Student does not exist",
    });
    return;
  }

  const username = entry["username"];

  // Placeholder Data
  if (req.session.userID === userID) {
    res.json({
      success: true,
      data: await get_matches_helper(client, username),
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }
}

async function get_meetings_helper(client: MongoClient, user: string) {
  const meetings_cursor = client
    .db("users")
    .collection("meetings")
    .find({
      $or: [{ userA: user }, { userB: user }],
    });

  const meetings = Array.prototype;

  meetings_cursor.forEach((meeting_object) => {
    const meeting = {
      partner: "",
      meeting_times: {},
    };

    const partner =
      meeting_object["userA" as keyof typeof meeting_object] === user
        ? meeting_object["userB" as keyof typeof meeting_object]
        : meeting_object["userA" as keyof typeof meeting_object];

    const meeting_times =
      meeting_object["meeting_times" as keyof typeof meeting_object];

    meeting["partner"] = partner;
    meeting["meeting_times"] = meeting_times;

    meetings.push(meeting);
  });

  return meetings;
}

// Andrew (done)
export async function get_meetings(req: Request, res: Response) {
  console.log(
    `request for weekly meetings for user: ${req.params.userID}, by user ${req.session.userID}`
  );

  const client: MongoClient = req.app.locals.client;
  const userID = req.params.userID;

  let entry;
  try {
    entry = await client
      .db("users")
      .collection("members")
      .findOne({ _id: new ObjectId(userID) });
  } catch {
    return res.status(502).json({
      success: false,
      message: "Error fetching user from database",
    });
  }

  if (entry === null) {
    res.status(404).json({
      success: false,
      message: "Student does not exist",
    });
    return;
  }

  const privateProfile = true;
  const username = entry["username"];

  if (!privateProfile || req.session.userID === userID) {
    res.json({
      success: true,
      data: await get_meetings_helper(client, username),
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

export async function findPartnersAndClass(
  client: MongoClient,
  classes: String //c is Class string
) {

  return client
    .db("users")
    .collection("members")
    .find({
      classes : { $in: classes },
      looking_for_partners: true
    })
    .toArray();
}
