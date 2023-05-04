import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import jobCreate from "./routes/jobCreate.routes.js";
import EmpRouter from "./routes/emp.routes.js";
import timeOff from "./routes/timeOff.routes.js";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();


app.use(cors());

app.use(express.json({ limit: "50mb" }));



app.use("/api/v1/users", userRouter);
app.use("/api/v1/Applicants", propertyRouter);
app.use("/api/v1/Jobs", jobCreate);
app.use("/api/v1/Employee", EmpRouter);
app.use("/api/v1/Timeoff", timeOff);

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));

const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(8080, () => {
            console.log('Server is up on 8080')
        })
    } catch (error) {
        console.log(error);
    }
};

startServer();
