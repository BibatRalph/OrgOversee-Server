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

<<<<<<< HEAD

app.use(cors());

app.use(express.json({ limit: "50mb" }));



=======
>>>>>>> 4621ac639c68d6af388de28f7edc29d79c6c2af8
app.use("/api/v1/users", userRouter);
app.use("/api/v1/Applicants", propertyRouter);
app.use("/api/v1/Jobs", jobCreate);
app.use("/api/v1/Employee", EmpRouter);
app.use("/api/v1/Timeoff", timeOff);

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));

<<<<<<< HEAD

=======
>>>>>>> 4621ac639c68d6af388de28f7edc29d79c6c2af8

const startServer = async () => {
    try {
        connectDB("mongodb+srv://OrgOversee:OrgOversee20@cluster0.f51d8ua.mongodb.net/?retryWrites=true&w=majority");

        app.listen(8080, () => {
            console.log('Server is up on 8080')
        })
    } catch (error) {
        console.log(error);
    }
};

startServer();
