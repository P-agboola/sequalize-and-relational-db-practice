const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");

const port = 3005;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const sequelize = new Sequelize("sample", "femi", "Password@998", {
  dialect: "mysql",
});

const blogTable = sequelize.define(
  "blog-Table",
  {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
  },
  { tableName: "blog-Table" }
);

blogTable.sync();

sequelize
  .authenticate()
  .then(() => {
    console.log("connected succesfully");
  })
  .catch((err) => {
    console.log(err, "Something went Wrong");
  });

app.get("/home", (req, res) => {
  res.send("This is working fine");
});

app.post("/", async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const saveBlog = blogTable.build({
    title,
    description,
  });
  await saveBlog.save();
  res.status(200).send("blog posted");
});

app.get("/allBlog", async (req, res) => {
  const allData = await blogTable.findAll();
  res.status(200).json({
    result: allData.length,
    data: { allData },
  });
});

app.put("/:id", (req, res) => {
  const data = req.body.data;
  console.log(data);
  console.log(req.params.id);
  blogTable.update(
    { description: data },
    {
      where: { id: parseInt(req.params.id) },
    }
  );
  res.redirect("/allBlog");
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
