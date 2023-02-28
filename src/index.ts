import Express from "express";
import BodyParser from "body-parser";
// import { mongoConnect } from "./config/database";
// import { router } from "./routes/ParkingSpace.routes";
import { assignBay, createParkingBuilding, releaseBay } from "./config/mySqlDB";

const app = Express();

app.use(BodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-control-Allow-Origin", "*");
  res.setHeader("Access-control-Allow-Methods", "*");
  res.setHeader("Access-control-Allow-Headers", "*");
  next();
});

//Below commented code is for Nosql approach
// app.use("/api/v1/parkingSpace/", router)

//Below API Handles create parking space
app.get("/sql/createSpace", async (req, res, next) => {
  try {
    const result = await createParkingBuilding();
    res.status(200).json({ result: result });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

//Below API handles Assign Parking Space
app.patch("/sql/assignBay", async (req, res, next) => {
  const { size, number } = req.body;
  try {
    const result = await assignBay(size, number);
    res.status(200).send(result);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

//Below API handles releasing Parking Space
app.patch("/sql/releaseBay/:id", async (req, res, next) => {
  const { id } = req.params;
  const { size } = req.body;

  try {
    const result = await releaseBay(id, size);
    res.status(200).send(result);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

// mongoConnect(() => {
//   app.listen(5000);
// });/

app.listen(5000);
