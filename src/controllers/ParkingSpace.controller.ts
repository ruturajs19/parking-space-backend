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
    updatedPayload.slots = payload.slots.map((floorData: any) => ({
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
    ParkingSpace.createParkingSpace(updatedPayload)
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
  try{
  let parkingSpaceDetails: ParkingSpaceModel | undefined;
  try {
    const results = await ParkingSpace.getParkingSpace(id);
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
    let currentSize: VehicleSize | undefined;
    let currentSizeIndex = Object.keys(VehicleSize).findIndex(
      (item) => item === size
    );
    while (
      vacantSlotDetails.floor === -1 &&
      currentSizeIndex < Object.keys(VehicleSize).length
    ) {
      currentSize =
        VehicleSize[
          Object.keys(VehicleSize)[currentSizeIndex++] as VehicleSize
        ];
      slots.find((slot, floor) => {
        const currentSlot = slot[currentSize as VehicleSize];
        for (let i = 0; i < currentSlot.size; i++) {
          if (
            (currentSlot.status[i] == undefined ||
              currentSlot.status[i] == null) &&
            parkingSpaceDetails
          ) {
            vacantSlotDetails = { floor, bay: i };
            parkingSpaceDetails.slots[floor][currentSize as VehicleSize].status[
              i
            ] = number;
            return true;
          }
        }
      });
    }

    if (
      currentSize &&
      vacantSlotDetails.floor >= 0 &&
      vacantSlotDetails.bay >= 0
    ) {
      try {
        await ParkingSpace.assignParkingBay(id, parkingSpaceDetails);
        const updatedResponse = {
          floor: vacantSlotDetails.floor,
          size: currentSize,
          bay: vacantSlotDetails.bay,
        };
        res.status(200).send(updatedResponse);
      } catch (error: any) {
        res.status(error.code || 500).json({ message: error.message });
      }
    } else {
      res.status(404).json({ message: "No Slot Available" });
    }
  } else {
    res.status(404).json({ message: "No Slot Available" });
  }}catch(e){
    res.status(500);
  }
};

export const releaseParkingBay = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { size, floor, bay } = req.body;

  let parkingSpaceDetails: ParkingSpaceModel | undefined;
  try {
    const results = await ParkingSpace.getParkingSpace(id);
    parkingSpaceDetails = results as WithId<ParkingSpaceModel>;
  } catch (error: any) {
    res.status(error.code || 500).json({ message: error.message });
  }
  if (parkingSpaceDetails && parkingSpaceDetails.slots?.length > 0) {
    const currentSize = size as VehicleSize;
    parkingSpaceDetails.slots[floor][currentSize].status[Number(bay)] =
      undefined;

    try {
      const assignmentResults = await ParkingSpace.assignParkingBay(
        id,
        parkingSpaceDetails
      );
      res.status(200).send(assignmentResults);
    } catch (error: any) {
      res.status(error.code || 500).json({ message: error.message });
    }
  }
};
