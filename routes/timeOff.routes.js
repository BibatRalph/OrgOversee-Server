import express from "express";

import {
    getallOff,
    createOff,
    updateOff,
    deleteOff,
} from "../controllers/timeOff.controller.js";

const router = express.Router();

router.route("/").get(getallOff);
router.route("/").post(createOff);
router.route("/:id").patch(updateOff);
router.route("/:id").delete(deleteOff);

export default router;