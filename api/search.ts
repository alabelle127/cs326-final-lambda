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
          index: "static",
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: [
                    "class.number",
                    "class.subject.id",
                    "class.subject.name",
                    "instructors.name",
                    "name.id",
                    "name.type",
                  ],
                  // synonyms: "mySynonyms",
                  // Unfortunately this doesn't work (see https://www.mongodb.com/community/forums/t/synonym-search-not-working-when-searching-for-phrase/144068)
                },
              },
              {
                text: {
                  query: query,
                  path: "class.name",
                  score: { boost: { value: 0.5 } }, // make class name less important
                },
              },
            ],
          },
        },
      },
      {
        $limit: 15,
      },
    ])
    .toArray();
  res.json(responseData);
}
