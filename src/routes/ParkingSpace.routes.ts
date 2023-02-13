import Express from "express";
import {
  assignParkingBay,
  createNewParkingSpace,
  releaseParkingBay,
} from "../controllers/ParkingSpace.controller";

export const router = Express.Router();

router.post("/", createNewParkingSpace);
router.patch("/assignBay/:id", assignParkingBay);
router.patch("/releaseBay/:id", releaseParkingBay);
