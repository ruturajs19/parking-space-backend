import MongoDB, { MongoClient } from "mongodb";
const mongoClient = new MongoClient(
  `mongodb+srv://Ruturaj:ruturaj@cluster0.6biak.mongodb.net/parking-service?retryWrites=true&w=majority`
);

let _db: MongoDB.Db;

export const mongoConnect = (callback: Function) => {
  mongoClient
    .connect()
    .then((client) => {
      console.log("Connected to DB");
      _db = client.db();
      callback();
    })
    .catch((error) => {
      throw error;
    });
};

export const getDB = () => {
  if (_db) {
    return _db;
  }
  throw "No Databases found!";
};
