const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "mytable";
const client = new MongoClient(url);

const connectToDatabase = async (name) => {
  await client.connect();
  const db = client.db(dbName);
  const collections = await db.listCollections({ name }).toArray();

  // 如果集合不存在，则创建集合
  if (collections.length === 0) {
    await db.createCollection(name);
  }

  return db.collection(name);
};

const closeConnection = async () => {
  if (client && client.topology.isConnected()) {
    await client.close();
    console.log("Connection closed");
  }
};

const getDb = async (name = "user") => {
  const user = await connectToDatabase(name);
  const result = await user.find().toArray();
  return result;
};
const getOne = async (options = { name: "user" }) => {
  const { name, _id } = options;
  const user = await connectToDatabase(name);
  const result = await user.find({ _id }).toArray();
  return result;
};
const saveOne = async (data, name = "user") => {
  const user = await connectToDatabase(name);
  const result = await user.insertOne(data);
  return result;
};
const updateOne = async (id, data, name = "user") => {
  const user = await connectToDatabase(name);
  const result = await user.updateOne({ id }, { $set: data });
  return result;
};
const delOne = async (id, name = "user") => {
  const user = await connectToDatabase(name);
  const result = await user.deleteOne({ id });
  return result;
};
const delMany = async (ids, name = "user") => {
  const user = await connectToDatabase(name);
  const result = await user.deleteMany({ id: { $in: ids } });
  return result;
};

module.exports = {
  connectToDatabase,
  closeConnection,
  getDb,
  getOne,
  saveOne,
  delOne,
  delMany,
  updateOne,
};
