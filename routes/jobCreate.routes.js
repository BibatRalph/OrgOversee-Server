import express from "express";

import {
    getAllJobs,
    getJobDetail,
    createJob,
    updateJob,
    deleteJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.route("/").get(getAllJobs);
router.route("/:id").get(getJobDetail);
router.route("/").post(createJob);
router.route("/:id").patch(updateJob);
router.route("/:id").delete(deleteJob);

export default router;