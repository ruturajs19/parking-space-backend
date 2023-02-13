import { Request, Response } from "express";
import { WithId } from "mongodb";
import { parkingSpaceInitialData } from "../models/initialData";
import {
  ParkingSpace,
  ParkingSpaceModel,
  VehicleSize,
} from "../models/ParkingSpace";

export const createNewParkingSpace = (req: Request, res: Response) => {
  const payload = req.body;

  const updatedPayload = parkingSpaceInitialData;

  if (payload?.slots && payload?.slots.length > 0) {
    updatedPayload.floors = payload.floors;
    updatedPayload.slots = payload.map((floorData: any) => ({
      s: {
        size: floorData.s,
        status: [],
      },
      m: {
        size: floorData.m,
        status: [],
      },
      l: {
        size: floorData.l,
        status: [],
      },
      xl: {
        size: floorData.xl,
        status: [],
      },
    }));
  }

  try {
    const parkingSpace = new ParkingSpace();
    parkingSpace
      .createParkingSpace(updatedPayload)
      .then((results) => {
        res.status(200).send(results);
      })
      .catch((error) => {
        res.status(error.code || 500).json({ message: error.message });
      });
  } catch (e) {
    res.status(500).send("Something Went Wrong. Please Try Again:");
  }
};

export const assignParkingBay = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { size, number } = req.body;

  let parkingSpaceDetails: ParkingSpaceModel | undefined;
  try {
    const parkingSpace = new ParkingSpace();
    const results = await parkingSpace.getParkingSpace(id);
    parkingSpaceDetails = results as WithId<ParkingSpaceModel>;
  } catch (error: any) {
    res.status(error.code || 500).json({ message: error.message });
  }
  if (parkingSpaceDetails && parkingSpaceDetails.slots?.length > 0) {
    const slots = parkingSpaceDetails.slots;
    let vacantSlotDetails: { floor: number; bay: number } = {
      floor: -1,
      bay: -1,
    };
    const currentSize = size as VehicleSize;
    slots.find((slot, floor) => {
      const currentSlot = slot[currentSize];
      for (let i = 0; i < currentSlot.size; i++) {
        if (
          (currentSlot.status[i] == undefined ||
            currentSlot.status[i] == null) &&
          parkingSpaceDetails
        ) {
          vacantSlotDetails = { floor, bay: i };
          parkingSpaceDetails.slots[floor][currentSize].status[i] = number;
          return true;
        }
      }
    });
    if (vacantSlotDetails.floor >= 0 && vacantSlotDetails.bay >= 0) {
      try {
        const parkingSpace = new ParkingSpace();
        await parkingSpace.assignParkingBay(id, parkingSpaceDetails);
        const updatedResponse = {
          floor: vacantSlotDetails.floor,
          size: currentSize,
          bay: vacantSlotDetails.bay,
        };
        res.status(200).send(updatedResponse);
      } catch (error: any) {
        res.status(error.code || 500).json({ message: error.message });
      }
    }
  }
};

export const releaseParkingBay = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { size, floor, bay } = req.body;

  let parkingSpaceDetails: ParkingSpaceModel | undefined;
  try {
    const parkingSpace = new ParkingSpace();
    const results = await parkingSpace.getParkingSpace(id);
    parkingSpaceDetails = results as WithId<ParkingSpaceModel>;
  } catch (error: any) {
    res.status(error.code || 500).json({ message: error.message });
  }
  if (parkingSpaceDetails && parkingSpaceDetails.slots?.length > 0) {
    const currentSize = size as VehicleSize;
    parkingSpaceDetails.slots[floor][currentSize].status[Number(bay)] =
      undefined;

    try {
      const parkingSpace = new ParkingSpace();
      const assignmentResults = await parkingSpace.assignParkingBay(
        id,
        parkingSpaceDetails
      );
      res.status(200).send(assignmentResults);
    } catch (error: any) {
      res.status(error.code || 500).json({ message: error.message });
    }
  }
};
