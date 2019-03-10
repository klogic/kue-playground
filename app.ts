import { Response, Request } from "express";
const kue = require("kue");
const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");

const queue = kue.createQueue();

app.get("/", (req: Request, res: Response) => {
  for (let i = 0; i < 20; i++) {
    queue
      .create("queue example " + i, {
        title: "This testing request",
        data: i
      })
      .priority("high")
      .save();
  }
  res.send("Hello World!");
});

app.use("/kue-api/", kue.app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
