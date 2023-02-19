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
    floors: 1,
    slots: [
      {
        s: { size: 1, status: ["OD025552"] },
        m: { size: 1, status: ["OD232222"] },
        l: { size: 1, status: [] },
        xl: { size: 1, status: ["GJ726666"] },
      }
    ],
  };
  const payloadCreate = {
    floors: 1,
    slots: [
      {
        s: 1,
        m: 1,
        l: 1,
        xl: 1,
      },
    ],
  };

  test("responds to / without payload", async () => {
    mPS.createParkingSpace.mockResolvedValue({
      acknowledged: true,
      insertedId: Object("63ea1337aaec34034f0029fe"),
    });
    const res = await request(app).post("/").set("Accept", "application/json");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
  });

  test("responds to / with payload", async () => {
    mPS.createParkingSpace.mockResolvedValue({
      acknowledged: true,
      insertedId: Object("63ea1337aaec34034f0029fe"),
    });
    const res = await request(app)
      .post("/")
      .send(payloadCreate)
      .set("Accept", "application/json");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
  });
  test("responds to / failed", async () => {
    mPS.createParkingSpace.mockRejectedValue({});
    const res = await request(app).post("/").set("Accept", "application/json");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(500);
  });

  test("responds to /assignBay/:id success", async () => {
    mPS.getParkingSpace.mockResolvedValue(mockResponse);
    mPS.assignParkingBay.mockResolvedValue();
    const res = await request(app)
      .patch("/assignBay/123")
      .send({ size: "l", number: "TT65T7676" })
      .set("Accept", "application/json");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
  });
  test("responds to /assignBay/:id failed for no slot", async () => {
    mPS.getParkingSpace.mockResolvedValue(mockResponse);
    mPS.assignParkingBay.mockResolvedValue();
    const res = await request(app)
      .patch("/assignBay/123")
      .send({ size: "xl", number: "TT65T7676" })
      .set("Accept", "application/json");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(404);
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
      .send({ size: "m", floor: 0, bay: 0 })
      .set("Accept", "application/json");
    expect(res.statusCode).toBe(200);
  });

  test("responds to /releaseBay/:id failed", async () => {
    mPS.getParkingSpace.mockRejectedValue(mockResponse);
    mPS.assignParkingBay.mockRejectedValue({});
    const res = await request(app)
      .patch("/releaseBay/123")
      .send({ size: "m", floor: 1, bay: 3 });
    expect(res.statusCode).toBe(500);
  });
});
