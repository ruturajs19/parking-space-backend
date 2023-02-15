import request from "supertest";
import express from "express";
import BodyParser from "body-parser";
import { router } from "../routes/ParkingSpace.routes";
import { ParkingSpace } from "../models/ParkingSpace";
const app = express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
jest.mock("../models/ParkingSpace");
const mPS = ParkingSpace as jest.Mocked<typeof ParkingSpace>;

app.use("/", router);

describe("Parking Space Routes", function () {
  let mockRequest;
  let mockResponse = {
    _id: Object("63ea1337aaec34034f0029fe"),
    floors: 3,
    slots: [
      {
        s: { size: 100, status: ["OD025552", "TS09W1234", "OD0255521"] },
        m: { size: 100, status: ["OD232222", "KA011111"] },
        l: { size: 100, status: [] },
        xl: { size: 100, status: ["GJ726666"] },
      },
      {
        s: { size: 100, status: [] },
        m: { size: 100, status: [] },
        l: { size: 100, status: [] },
        xl: { size: 100, status: [] },
      },
      {
        s: { size: 100, status: [] },
        m: { size: 100, status: [] },
        l: { size: 100, status: [] },
        xl: { size: 100, status: [] },
      },
    ],
  };

  test("responds to /", async () => {
    mPS.createParkingSpace.mockResolvedValue({
      acknowledged: true,
      insertedId: Object("63ea1337aaec34034f0029fe"),
    });
    const res = await request(app).post("/").set("Accept", "application/json");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
  });

  test("responds to /assignBay/:id success", async () => {
    mPS.getParkingSpace.mockResolvedValue(mockResponse);
    mPS.assignParkingBay.mockResolvedValue();
    const res = await request(app)
      .patch("/assignBay/123")
      .send({ size: "m", number: "TT65T7676" })
      .set("Accept", "application/json");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
  });

  test("responds to /assignBay/:id failed", async () => {
    mPS.getParkingSpace.mockRejectedValue(mockResponse);
    mPS.assignParkingBay.mockRejectedValue({});
    const res = await request(app)
      .patch("/assignBay/123")
      .send({ size: "m", number: "TT65T7676" })
      .set("Accept", "application/json");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(500);
  });

  test("responds to /releaseBay/:id success", async () => {
    mPS.getParkingSpace.mockResolvedValue(mockResponse);
    mPS.assignParkingBay.mockResolvedValue();
    const res = await request(app)
      .patch("/releaseBay/123")
      .send({ size: "m", floor: 1, bay: 3 })
      .set("Accept", "application/json");
    expect(res.statusCode).toBe(200);
  });

  test("responds to /releaseBay/:id failed", async () => {
    mPS.getParkingSpace.mockRejectedValue(mockResponse);
    mPS.assignParkingBay.mockRejectedValue({});
    const res = await request(app)
      .patch("/releaseBay/123")
      .send({ size: "m", floor: 1, bay: 3 })
      .set("Accept", "application/json");
    expect(res.statusCode).toBe(500);
  });
});
