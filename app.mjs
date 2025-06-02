import express from "express";
 import cors from "cors";
import Posts from "./router/posts.mjs";
import AuthRouter from "./router/Auth.mjs";
import Profile from "./router/profile.mjs";
import Notifications from "./router/Notifications.mjs";
import Categories from "./router/category.mjs";
import Article from "./router/Article.mjs";
const app = express();
const port = process.env.PORT || 4001;

app.use(cors({}));
app.use(express.json());

app.use("/posts", Posts);
app.use("/auth", AuthRouter);
app.use("/profile",Profile)
app.use("/notifications",Notifications)
app.use("/category",Categories)
app.use("/Article",Article)

app.get("/", (req, res) => {
  res.send("Hello TechUp!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
