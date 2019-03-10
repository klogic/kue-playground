import { Response, Request } from "express";
import { Job, DoneCallback } from "kue";
import axios from "axios";

const kue = require("kue");
const express = require("express");
const app = express();
const port = 3000;
const queue = kue.createQueue();

app.get("/", (req: Request, res: Response) => {
  for (let i = 1; i <= 20; i++) {
    queue
      .create("queue example", {
        title: "This testing request",
        data: i
      })
      .priority("high")
      .save();
  }
  res.send("Hello World!");
});
queue.process("queue example", (job: Job, done: DoneCallback) => {
  axios
    .get("https://jsonplaceholder.typicode.com/todos/" + job.data.data)
    .then(result => {
      console.log(result.data);
      done();
      return result.data;
    })
    .catch(error => done(error));
});
app.use("/kue-api/", kue.app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
