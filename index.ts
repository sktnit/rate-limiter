import express from "express";
import route from "./routes/route";
const app = express();
const port = 3000;

app.use("/", route);

app.listen(port, () => {
  console.log(`Sandbox listening on port ${port}`);
});
