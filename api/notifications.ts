import { Request, Response } from "express";

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

// Andrew
export function create_meeting(req: Request, res: Response) {
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
          end_time: 2100,
        },
        {
          day: "Fri",
          start_time: 1300,
          end_time: 1500,
        },
      ],
    },
  ];

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
