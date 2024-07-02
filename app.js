const express = require("express");
const app = express();
// const { getDb, saveDb } = require("./db");
const {
  getDb,
  closeConnection,
  saveOne,
  delOne,
  delMany,
  updateOne,
} = require("./db.js");
const uuid = require("uuid");

// app.use(express.urlencoded());
app.use(express.json());
// 获取用户列表
app.get("/", async (req, res) => {
  try {
    const result = await getDb();
    res.send(result);
  } catch (collection) {
    console.log("errr");
    res.status(500).json({ error });
  }
});

// 添加用户
app.post("/", async (req, res) => {
  const body = req.body;
  body.id = uuid.v4();
  if (!body || !body.username.trim()) {
    res.status(403).json({
      success: false,
      error: "用户名不能为空",
    });
  }
  try {
    const w = await saveOne(body);
    if (w.acknowledged) {
      res.status(200).send({
        success: true,
        msg: "添加成功！",
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// 修改用户
app.put("/:id", async (req, res) => {
  const { body } = req;
  let { id } = req.params;
  try {
    const w = await updateOne(id, body);
    if (w.acknowledged) {
      res.status(200).send({
        success: true,
        msg: "删除成功！",
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// 删除用户
app.delete("/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const w = await delOne(id);
    if (w.acknowledged) {
      res.status(200).send({
        success: true,
        msg: "删除成功！",
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// 删除用户(批量删除)
app.post("/batch", async (req, res) => {
  const body = req.body;
  const { ids } = body;
  try {
    const w = await delMany(ids);
    if (w.acknowledged) {
      res.status(200).send({
        success: true,
        msg: "删除成功！",
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(3000, () => {
  console.log("express 3000 ok");
});

// 在应用程序关闭时关闭连接
process.on("SIGINT", async () => {
  await closeConnection();
  process.exit(0);
});
