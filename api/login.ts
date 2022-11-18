import { Request, Response } from "express";

export function login(req: Request, res: Response) {
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
}

export function logout(req: Request, res: Response) {
  console.log(`Logging out user: ${req.session.userID}`);
  req.session.userID = null;
  res.sendStatus(200);
}

export function me(req: Request, res: Response) {
  const userID = req.session.userID ?? null;
  res.json({
    loggedIn: userID != null,
    userID: userID,
  });
}
