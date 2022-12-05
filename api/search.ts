import { Request, Response } from "express";
import { MongoClient } from "mongodb";

export async function search(req: Request, res: Response) {
  const client: MongoClient = req.app.locals.client;
  const query = req.query.q;
  console.log(`Received API request for search with q=${query}`);
  const responseData = await client
    .db("classes")
    .collection("2022 Fall")
    .aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: query,
            path: {
              wildcard: "*",
            },
          },
        },
      },
      {
        $limit: 10,
      },
    ])
    .toArray();
  console.log(responseData);
  res.json(responseData);
}
