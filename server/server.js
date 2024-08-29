const express = require("express");
const client = require("./elasticsearch/client");

const app = express();
const port = 4000;

const data = require("./data_management/retrive_and_ingest_data");

app.use("/ingest_data", data);

app.listen(port, () => {
  console.log(`severe listening at port ${port}`);
});
