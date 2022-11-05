const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
