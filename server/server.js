const express = require("express");
const client = require("./elasticsearch/client");

const app = express();
const port = 4000;

app.listen(port, () => {
  console.log(`severe listening at port ${port}`);
});
