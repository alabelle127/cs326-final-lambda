import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { me } from "./login";

// Chris
export function get_notifications(req: Request, res: Response) {
  console.log(
    `request for notifications/match requests for user, ${req.params.userID}, by user ${req.session.userID}`
  );

  const userID = req.params.userID;

  const privateProfile = true;
  if (!privateProfile || req.session.userID === userID) {
    res.json({
      success: true,
      data: {
        matchReqs: ["CSMajor123", "MathMajor456"],
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User's profile is private",
    });
  }
}

// Andrew
export function send_meeting_request(req: Request, res: Response) {
  console.log(
    `Recieved API request to send an invitiation from user ${req.params.userID1} to ${req.params.userID2}`
  );
  const userID1 = req.params.userID1;
  const userID2 = req.params.userID2;

  if (req.session.userID === userID1) {
    // Send match request from user 1 to user 2
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

// Andrew
export async function create_meeting(req: Request, res: Response) {
  const user1 = req.body.user1;
  const user2 = req.body.user2;
  console.log(
    `Recieved API request to create a meeting between ${user1} and ${user2}`
  );

  const available_times_user1 = await getAvailableTimes(
    req.app.locals.client,
    user1
  );

  const available_times_user2 = await getAvailableTimes(
    req.app.locals.client,
    user2
  );

  const available_times = find_available_times(
    [
      available_times_user1, 
      available_times_user2
    ]
  );

  if (available_times.length > 0) {
    res.json({
      success: true,
      data: available_times,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "unable to find desired meeting time",
    });
  }
}
