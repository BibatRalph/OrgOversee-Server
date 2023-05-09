import express from "express";

import {
    createUser,
    getAllUsers,
    getUserInfoByID,
    updateUSER,
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/").post(createUser);
router.route("/:id").get(getUserInfoByID);
router.route("/:id").patch(updateUSER);
export default router;
