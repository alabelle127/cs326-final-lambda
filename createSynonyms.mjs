import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const SYNONYMS = [
  {
    mappingType: "equivalent",
    synonyms: ["CS", "COMPSCI"],
  },
  {
    mappingType: "explicit",
    input: ["Lecture"],
    synonyms: ["LEC"],
  },
  {
    mappingType: "explicit",
    input: ["Discussion"],
    synonyms: ["DIS"],
  },
];

await client.db("classes").collection("synonyms").deleteMany({});
await client.db("classes").collection("synonyms").insertMany(SYNONYMS);
console.log("done");
await client.close();
