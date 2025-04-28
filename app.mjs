import express from "express";
 import cors from "cors";
import postsRouter from "./router/posts.mjs";
 
const app = express();
const port = process.env.PORT || 4001;

app.use("/posts", postsRouter);
app.use(cors());
app.use(express.json());

 app.get("/", (req, res) => {
    res.send("Hello TechUp!");
  });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});