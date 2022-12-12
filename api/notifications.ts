import { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import { me } from "./login";

// Chris (done)
export async function get_notifications(req: Request, res: Response) {
  console.log(
    `request for notifications/match requests for user, ${req.params.userID}, by user ${req.session.userID}`
  );

  const userID = req.params.userID;
  const client = req.app.locals.client;
  const entry = await helper(client, userID);    

  if (entry === null) {
      res.status(404).json({
          success: false,
          message: "Student does not exist",
      });
      return;
  }

  const privateProfile = entry['privateProfile'];
  if (!privateProfile || req.session.userID === userID) {
    res.json({
      success: true,
      data: {
        matchReqs: entry['notifs'],
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User's profile is private",
    });
  }
}

// Depreceted
async function send_meeting_helper(client: MongoClient, userFrom: string, userTo: string) {
  client.db("users").collection("meetings")
    .insertOne({
      userA: userFrom,
      userB: userTo,
      meeting_times: {
        mon: [
          {
            startTime: 0,
            end: 2400
          }
        ],
        tue: [
          {
            startTime: 0,
            end: 2400
          }
        ], 
        wed: [
          {
            startTime: 0,
            end: 2400
          }
        ],
        thu: [
          {
            startTime: 0,
            end: 2400
          }
        ],
        fri: [
          {
            startTime: 0,
            end: 2400
          }
        ],
        sat: [
          {
            startTime: 0,
            end: 2400
          }
        ],
        sun: [
          {
            startTime: 0,
            end: 2400
          }
        ]
      }
    });
  
}

// Andrew (done)
export async function send_meeting_request(req: Request, res: Response) {
  console.log(
    `Recieved API request to send an invitiation from user ${req.params.userID1} to ${req.params.userID2}`
  );
  const userID1 = req.params.userID1;
  const userID2 = req.params.userID2;

  const client = req.app.locals.client;

  let entry1;
  try {
    entry1 = await client
      .db("users")
      .collection("members")
      .findOne({ _id: new ObjectId(userID1) });
  } catch {
    return res.status(502).json({
      success: false,
      message: "Error fetching user from database",
    });
  }

  if (entry1 === null) {
    res.status(404).json({
      success: false,
      message: "Student does not exist",
    });
    return;
  }

  let entry2;
  try {
    entry2 = await client
      .db("users")
      .collection("members")
      .findOne({ _id: new ObjectId(userID2) });
  } catch {
    return res.status(502).json({
      success: false,
      message: "Error fetching user from database",
    });
  }

  if (entry2 === null) {
    res.status(404).json({
      success: false,
      message: "Student does not exist",
    });
    return;
  }

  const userA_name = entry1["username"];
  const userB_name = entry2["username"];

  try {
    await client
      .db("users")
      .collection("meetings")
      .insertOne(
        { userA: userA_name, userB: userB_name},
      );
    return res.json({
      success: true,
    });
  } catch {
    return res.status(502).json({
      success: false,
      message: "Error setting up meeting",
    });
  }
}

async function getAvailableTimes(client: MongoClient, username: string) {
  const classes: any[] = await client.db("users").collection("members")
    .findOne(
      {"username" : username},
    )
    .then(document => {
      if(document) {
        return document["classes"];
      }
      console.log("User does not exist");
      return null
    })
    .catch(err => {
      console.error(err);
      return null;
    });

  if(classes === null) { 
    console.error(`${username} does not exist within database or does not have classes`); 
    return [];
  };
  
  const meetings = Array.prototype;

  classes.forEach(clss => {
    const meeting_times = clss["meeting_times"];
    if(meeting_times) {
      meetings.push(meeting_times);
    } else {
      console.log("User has invalid/outdated class");
    }
  });

  const unavailable_times = {
    mon: Array.prototype,
    tue: Array.prototype,
    wed: Array.prototype,
    thu: Array.prototype,
    fri: Array.prototype,
    sat: Array.prototype,
    sun: Array.prototype
  };

  meetings.forEach(meeting => {
    const days = meeting["days"];

    for(const [key, value] of Object.entries(days)) {
      if(value) {
        unavailable_times[key as keyof typeof unavailable_times].push({
          startTime: meeting["startTime"],
          endTime: meeting["endTime"]
        });
      }
    }
  });

  const available_times = {
    mon: Array.prototype,
    tue: Array.prototype,
    wed: Array.prototype,
    thu: Array.prototype,
    fri: Array.prototype,
    sat: Array.prototype,
    sun: Array.prototype
  };

  let start_time = 0;
  let end_time = 0;
  for(const day in Object.keys(unavailable_times)) {
    const times = unavailable_times[day as keyof typeof unavailable_times];
    for(let i = 0; i < times.length; i++) {
      const time = times[i];
      
      end_time = time["startTime"];

      const available_day = available_times[day as keyof typeof available_times]
      available_day.push({
        startTime: start_time,
        endTime: end_time
      });

      start_time = time["endTime"];
    }
  }

  return available_times;
}

function find_available_times(times: any[]) {
  const result = Array.prototype;

  const intervals = times;
  intervals.sort((a, b) => {
    return b["startTime"] - a["startTime"];
  });

  const temp = Array.prototype;

  while(intervals.length > 0) {
    const pair = intervals.pop();

    if(temp && temp[-1][1] >= pair[0]) {
      temp[-1][1] = Math.max(pair[1], temp[-1][1])
    } else {
      temp.push(pair);
    }
  }

  for(let i = 0; i < temp.length - 1; i++) {
    result.push([temp[i][1], temp[i + 1][0]]);
  }

  return result;
}

// Andrew (done?)
export async function create_meeting(req: Request, res: Response) {
  const userID1 = req.params.userID1;
  const userID2 = req.params.userID2;
  const client = req.app.locals.client;

  let entry1;
  try {
    entry1 = await client
      .db("users")
      .collection("members")
      .findOne({ _id: new ObjectId(userID1) });
  } catch {
    return res.status(502).json({
      success: false,
      message: "Error fetching user from database",
    });
  }

  if (entry1 === null) {
    res.status(404).json({
      success: false,
      message: "Student does not exist",
    });
    return;
  }

  let entry2;
  try {
    entry2 = await client
      .db("users")
      .collection("members")
      .findOne({ _id: new ObjectId(userID2) });
  } catch {
    return res.status(502).json({
      success: false,
      message: "Error fetching user from database",
    });
  }

  if (entry2 === null) {
    res.status(404).json({
      success: false,
      message: "Student does not exist",
    });
    return;
  }

  const user1 = entry1["username"];
  const user2 = entry2["username"];

  console.log(
    `Recieved API request to create a meeting between ${user1} and ${user2}`
  );

  const available_times_user1 = await getAvailableTimes(
    client,
    user1
  );

  const available_times_user2 = await getAvailableTimes(
    client,
    user2
  );

  const available_times = find_available_times(
    [
      available_times_user1, 
      available_times_user2
    ]
  );

  // try {
  //   await client
  //     .db("users")
  //     .collection("meeetings")
  //     .updateOne(
  //       {}
  //     )
  // }

  // if(available_times.length > 0) {
  //   res.json({
  //     success: true,
  //     data: available_times,
  //   });
  // } else {
  //   res.status(401).json({
  //     success: false,
  //     message: "unable to find desired meeting time",
  //   });
  // }
}

export async function helper(client: MongoClient, studentID: any) {

  const res = await client
  .db("users")
  .collection("notifications")
  .findOne({studentID: studentID});

  return res;
}
