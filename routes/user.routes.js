import express from "express";

import {
    createUser,
    getAllUsers,
    getUserInfoByID,
    updateUSER,
    deleteUSER
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/").post(createUser);
router.route("/:id").get(getUserInfoByID);
router.route("/:id").patch(updateUSER);
router.route("/:id").delete(deleteUSER);
export default router;
