import { createConnection } from "mysql";
import { VehicleSize } from "../models/ParkingSpace";

const db = createConnection({
  host: "localhost",
  user: "root",
  password: "mysql",
  database: "ParkingSpace",
});
db.connect((err) => {
  if (err) throw err;
  console.log("Connected!!");
});

const setupCapacityTable = () => {
  const vTypeSize = Object.keys(VehicleSize).map(() => [100]);
  const sql = "INSERT INTO Capacity (size) values ?";
  db.query(sql, [vTypeSize]);
};

const createBayTable = () => {
  const sql =
    "CREATE TABLE if not exists bayDetails (bayId INTEGER PRIMARY KEY AUTO_INCREMENT,vehicleType INTEGER,vehicleNumber varchar(10))";
  db.query(sql, (err, result) => {
    if (err) {
      return err;
    }
    return result;
  });
};

export async function createParkingBuilding() {
  return new Promise((resolve, reject) => {
    const createTableQuery =
      "CREATE TABLE if not exists Capacity (vehicleType INTEGER PRIMARY KEY AUTO_INCREMENT,size INTEGER)";
    db.query(createTableQuery, (err, result) => {
      if (err) {
        reject(new Error(err.message ?? "Something wrong happened"));
      }
      setupCapacityTable();
      createBayTable();
      resolve("Table Created");
      return result;
    });
  });
}

const checkAvailability = async (
  vType: string,
  number: string
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const vTypeIndex = Object.keys(VehicleSize).findIndex(
      (item) => item === vType
    );
    if (vTypeIndex < 0) {
      reject(new Error("Invalid vehicle type"));
    }
    const query = `SELECT * FROM Capacity WHERE size > 0 AND vehicleType >= ${
      vTypeIndex + 1
    }`;
    let result;
    result = db.query(query, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

export const assignBay = async (vType: string, number: string) => {
  return new Promise(async (resolve, reject) => {
    const vacancyResult: any[] = await checkAvailability(vType, number);
    if (vacancyResult.length > 0) {
      const availableVType = vacancyResult[0].vehicleType;
      db.query(
        `update Capacity set size = size - 1 where vehicleType = ${availableVType}`,
        (sizeUpdateErr, sizeUpdateResult) => {
          if (sizeUpdateErr) {
            reject(
              new Error(sizeUpdateErr.message ?? "Something wrong happened")
            );
          }
          const insertQuery = `INSERT INTO bayDetails (vehicleType, vehicleNumber) values(${availableVType},'${number}')`;
          db.query(insertQuery, (assignErr, assignResult) => {
            if (assignErr) {
              reject(
                new Error(assignErr.message ?? "Something wrong happened")
              );
            }
            resolve({
              bayId: assignResult?.insertId,
            });
          });
        }
      );
    } else {
      reject(new Error("no slots available"));
    }
  });
};

export const releaseBay = async (bayId: string, size: string) => {
  return new Promise((resolve, reject) => {
    const vTypeIndex = Object.keys(VehicleSize).findIndex(
      (item) => item === size
    );
    if (vTypeIndex < -1) {
      reject(new Error("Invalid vehicle type"));
    }
    if (bayId === undefined) {
      reject(new Error("Please provide valid bayId"));
    }
    const id = Number(bayId);
    const delQuery = `DELETE FROM bayDetails WHERE bayId = ${id}`;
    db.query(delQuery, (err, result) => {
      if (err) {
        reject(new Error(err.message ?? "Something wrong happened"));
      }

      const updateQuery = `update Capacity set size = size + 1 where vehicleType = ${
        vTypeIndex + 1
      }`;
      db.query(updateQuery, (err, result) => {
        if (err) {
          reject(new Error(err.message ?? "Something wrong happened"));
        }
        resolve("Bay released");
      });
    });
  });
};
