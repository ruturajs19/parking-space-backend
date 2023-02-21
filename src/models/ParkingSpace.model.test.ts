import { ParkingSpace } from "./ParkingSpace";
import * as utils from "../config/database";

jest.mock("../config/database");

describe("Parking Space Db Calls", function () {
  let mockResponse = {
    floors: 1,
    slots: [
      {
        s: { size: 1, status: [1] },
        m: { size: 1, status: [2] },
        l: { size: 1, status: [3] },
        xl: { size: 1, status: [4] },
      },
    ],
  };

  test("createParkingSpace function success", async () => {
    //@ts-ignore
    jest.spyOn(utils, "getDB").mockImplementation(() => ({
      collection: () => ({
        insertOne: () => Promise.resolve("done"),
      }),
    }));
    const res = await ParkingSpace.createParkingSpace(mockResponse);
    expect(res).toBe("done");
  });
  test("createParkingSpace function failed", async () => {
    //@ts-ignore
    jest.spyOn(utils, "getDB").mockImplementation(() => ({
      collection: () => ({
        insertOne: () => Promise.reject("done"),
      }),
    }));
    const res = await ParkingSpace.createParkingSpace(mockResponse);
    expect(res).toBe(undefined);
  });

  test("getParkingSpace function success", async () => {
    //@ts-ignore
    jest.spyOn(utils, "getDB").mockImplementation(() => ({
      collection: () => ({
        findOne: () => Promise.resolve("done"),
      }),
    }));
    const res = await ParkingSpace.getParkingSpace("63f2424ad088b3010719dea2");
    expect(res).toBe("done");
  });
  test("getParkingSpace function failed", async () => {
    //@ts-ignore
    jest.spyOn(utils, "getDB").mockImplementation(() => ({
      collection: () => ({
        findOne: () => Promise.reject("done"),
      }),
    }));
    const res = await ParkingSpace.getParkingSpace("63f2424ad088b3010719dea2");
    expect(res).toBe(undefined);
  });

  test("assignParkingBay function success", async () => {
    //@ts-ignore
    jest.spyOn(utils, "getDB").mockImplementation(() => ({
      collection: () => ({
        updateOne: () => Promise.resolve("done"),
      }),
    }));
    const res = await ParkingSpace.assignParkingBay(
      "63f2424ad088b3010719dea2",
      mockResponse
    );
    expect(res).toBe("done");
  });
  test("assignParkingBay function failed", async () => {
    //@ts-ignore
    jest.spyOn(utils, "getDB").mockImplementation(() => ({
      collection: () => ({
        updateOne: () => Promise.reject("done"),
      }),
    }));
    const res = await ParkingSpace.assignParkingBay(
      "63f2424ad088b3010719dea2",
      mockResponse
    );
    expect(res).toBe(undefined);
  });
});
