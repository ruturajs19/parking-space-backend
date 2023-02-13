import Express from "express";
import BodyParser from "body-parser";
import { mongoConnect } from "./config/database";
import { router } from "./routes/ParkingSpace.routes";

const app = Express();

app.use(BodyParser.json());

app.use(BodyParser.json());

app.use((req, res, next) =>{
    res.setHeader("Access-control-Allow-Origin","*");
    res.setHeader("Access-control-Allow-Methods","*");
    res.setHeader("Access-control-Allow-Headers","*");
    next();
});

app.use("/api/v1/parkingSpace/", router)

mongoConnect(()=>{
    app.listen(5000)
})