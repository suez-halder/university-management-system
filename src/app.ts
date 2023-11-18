// src/app.ts
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { StudentRoutes } from "./app/modules/student/student.route";
const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

// api/v1/students/create-student --> workflow
// eita kon route e hit hobe? student.route.ts er moddhe /create-student route e hit hobe
// tarpor se controller ke call dibe, controller then service ke call dibe, and finally service db te query chalabe

// application routes
app.use("/api/v1/students", StudentRoutes);

const getAController = (req: Request, res: Response) => {
    res.send("Hello World!");
};

app.get("/", getAController);

export default app;
