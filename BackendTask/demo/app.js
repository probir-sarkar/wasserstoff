const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/about", (req, res) => {
  res.send("About Us ");
});

const ports = [4000, 4001, 4002, 4003, 4004];

ports.forEach((port) => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
