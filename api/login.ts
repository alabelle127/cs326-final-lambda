import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { MiniCrypt } from "./miniCrypt";

export async function login(req: Request, res: Response) {
  const username = req.body.username;
  const password = req.body.password;
  console.log(
    `Received API request for login with username=${username}, password=${password}`
  );
  const userID = await validatePassword(
    req.app.locals.client,
    username,
    password
  );
  await new Promise((r) => setTimeout(r, 2000));
  if (userID === null) {
    res.status(401).json({
      success: false,
      userID: null,
    });
  } else {
    req.session.userID = userID.toString();
    res.json({
      success: true,
      userID: userID.toString(),
    });
  }
}

export function logout(req: Request, res: Response) {
  console.log(`Logging out user: ${req.session.userID}`);
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.sendStatus(200);
  });
}

export function me(req: Request, res: Response) {
  const userID = req.session.userID ?? null;
  res.json({
    loggedIn: userID != null,
    userID: userID,
  });
}

const mc = new MiniCrypt();
export async function validatePassword(
  client: MongoClient,
  username: string,
  password: string
) {
  const user = await client
    .db("users")
    .collection("members")
    .findOne({ username: username });
  if (user === null) {
    return null;
  }
  return mc.check(password, user.salt, user.hash) ? user._id : null;
}
