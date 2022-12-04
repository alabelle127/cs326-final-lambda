import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { MiniCrypt } from "./miniCrypt";

export async function username_exists(req: Request, res: Response) {
  const username = req.params.username;
  const client: MongoClient = req.app.locals.client;
  const user = await client
    .db("users")
    .collection("members")
    .findOne({ username: username });
  res.json({ exists: user !== null });
}

export async function register(req: Request, res: Response) {
  console.log(
    `Attempting to register new account with ${req.body.classes.length} classes and username: ${req.body.username}`
  );
  await attemptRegister(
    res,
    req.app.locals.client,
    req.body.username,
    req.body.password,
    req.body.real_name,
    req.body.contact,
    req.body.description,
    req.body.classes
  );
}

const mc = new MiniCrypt();
async function attemptRegister(
  res: Response,
  client: MongoClient,
  username: string,
  password: string,
  realName: string,
  contact: string,
  description: string,
  classes: Array<Object>
) {
  if (password.length < 6) {
    return res.json({ success: false });
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
      contact: contact,
      description: description,
      profile_picture:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/512px-Circle-icons-profile.svg.png",
      private_profile: false,
      looking_for_partners: true,
      classes: classes,
    })
    .then(() => {
      console.log("successfully registered");
      return res.json({ success: true });
    })
    .catch((err) => {
      console.error(err);
      return res.json({ success: false });
    });
}
