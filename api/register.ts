import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { MiniCrypt } from "./miniCrypt";

export async function register(req: Request, res: Response) {
  console.log(
    `Attempting to register new account with ${req.body.classes.length} classes and username: ${req.body.username}`
  );
  res.json({
    success: await attemptRegister(
      req.app.locals.client,
      req.body.username,
      req.body.password,
      req.body.real_name,
      req.body.classes
    ),
  });
}

const mc = new MiniCrypt();
async function attemptRegister(
  client: MongoClient,
  username: string,
  password: string,
  realName: string,
  classes: Array<Object>
) {
  if (password.length < 6) {
    return false;
  }
  const [salt, hash] = mc.hash(password);
  client
    .db("users")
    .collection("members")
    .insertOne({
      username: username,
      salt: salt,
      hash: hash,
      real_name: realName,
      classes: classes,
    })
    .then(() => {
      console.log("successfully registered");
      return true;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
}
