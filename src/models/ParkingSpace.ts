import { ObjectId, WithId } from "mongodb";
import { getDB } from "../config/database";

export enum VehicleSize {
  s= "s",
  m= "m",
  l= "l",
  xl= "xl",
}

export interface SlotModel { size: number; status: number[] | undefined[] }
export interface ParkingSpaceModel {
  floors: number;
  slots: {
    [key in VehicleSize]: SlotModel
  }[];
}

export class ParkingSpace {
  static async createParkingSpace(payload: ParkingSpaceModel) {
    const db = getDB();
    return db
      .collection("parking-space")
      .insertOne(payload)
      .then((result) => result)
      .catch((error) => {
        console.log("error:", error);
      });
  }

  static async getParkingSpace(id: string) {
    const db = getDB();
    const psId = new ObjectId(id);
    return db
      .collection("parking-space")
      .findOne({ _id: psId })
      .then((result) => result)
      .catch((error) => {
        console.log("error:", error);
      });
  }

  static async assignParkingBay(id: string, parkingDetails: ParkingSpaceModel) {
    const db = getDB();
    const psId = new ObjectId(id);
    return db
      .collection("parking-space")
      .updateOne({ _id: psId }, { $set: parkingDetails })
      .then((result) => result)
      .catch((error) => {
        console.log("errordb:", error);
      });
  }
}
