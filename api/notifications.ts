import { Request, Response } from "express";

export function get_notifications(req: Request, res: Response) {
  console.log(
    `request for notifications/match requests for user, ${req.params.userID}, by user ${req.session.userID}`
  );

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

export function send_meeting_request(req: Request, res: Response) {
  console.log(
    `Recieved API request to send an invitiation from user ${req.params.userID1} to ${req.params.userID2}`
  );
  const userID1 = parseInt(req.params.userID1);
  const userID2 = parseInt(req.params.userID2);
  if (isNaN(userID1) || userID1 <= 0 || isNaN(userID2) || userID2 <= 0) {
    // Invalid userID in request
    res.status(400).json({
      success: false,
      message: "Invalid User ID",
    });
  }

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
