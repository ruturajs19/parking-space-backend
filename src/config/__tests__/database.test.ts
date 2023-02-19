import { MongoClient } from "mongodb";
import { getDB, mongoConnect } from "../database";

describe("Parking Space DB", () => {
  test("mongoConnect function", async () => {
    const mC = new MongoClient(
      `mongodb+srv://Ruturaj:ruturaj@cluster0.6biak.mongodb.net/parking-service?retryWrites=true&w=majority`
    );
    jest
      .spyOn(mC, "connect")
      .mockImplementation(() => Promise.resolve({} as MongoClient));
    expect.assertions(0);

    const logSpy = jest.spyOn(console, "log");

    await mongoConnect(() =>
      expect(logSpy).toHaveBeenCalledWith("Connected to DB")
    );
  });
  test("getDB check", async () => {
    try {
      await getDB();
    } catch (e) {
      expect(e).toBe("No Databases found!");
    }
  });
});
