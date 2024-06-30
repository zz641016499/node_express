const express = require("express");

const { getDb, saveDb } = require("./db");
const app = express();
// app.use(express.urlencoded());
app.use(express.json());
// 获取用户列表
app.get("/", async (req, res) => {
  try {
    const objs = await getDb();
    res.send(objs.users);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// 添加用户
app.post("/", async (req, res) => {
  const body = req.body;
  if (!body || !body.name.trim()) {
    res.status(403).json({
      success: false,
      error: "用户名不能为空",
    });
  }
  const obj = await getDb();
  body.id = obj.users.length ? obj.users[obj.users.length - 1].id + 1 : 1001;
  obj.users.push(body);
  try {
    const w = await saveDb(obj);
    if (!w) {
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
  const body = req.body;
  let { id } = req.params;
  id = Number(id);
  const data = await getDb();
  let index = data.users.findIndex((user) => user.id === id);
  if (index == -1) {
    res.status(403).json({
      success: false,
      error: "当前用户不存在",
    });
  }
  data.users[index] = { ...body, id };

  try {
    const w = await saveDb(data);
    if (!w) {
      res.status(200).send({
        success: true,
        msg: "修改成功！",
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// 删除用户
app.delete("/:id", async (req, res) => {
  let { id } = req.params;
  id = Number(id);
  const data = await getDb();
  let users = data.users;
  const index = users.findIndex((user) => user.id === id);
  if (index == -1) {
    res.status(502).json({
      success: false,
      error: "用户id" + id + "不存在",
    });
  }
  users.splice(index, 1);
  try {
    const w = await saveDb(data);
    if (!w) {
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
  if (!ids || !Array.isArray(ids) || !ids.length) {
    res.status(403).json({
      success: false,
      error: "用户id不能为空",
    });
  }
  const data = await getDb();
  let users = data.users;
  // 这里需要做一步数据回滚
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      res.status(403).json({
        success: false,
        error: "用户id" + id + "不存在",
      });
      return; // 立即终止函数执行
    }
    users.splice(index, 1);
  }
  try {
    const w = await saveDb(data);
    if (!w) {
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
