import { Request, Response } from "express";

export function register(req: Request, res: Response) {
  console.log(
    `Attempting to register new account with ${req.body.classes.length} classes and username: ${req.body.username}`
  );
  res.json({
    success: true,
  });
}
