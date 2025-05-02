import express from "express";
import {
  checkin,
  checkout,
  getEmployeeAttendance,
  getTodayAttendance,
  getAllAttendance,
  isWithinRange,
} from "../controller/attendController.js";

const router = express.Router();

router.post("/checkin", checkin);
router.post("/checkout", checkout);
router.get("/employee/:id", getEmployeeAttendance);
router.get("/today/:id", getTodayAttendance);
router.get("/", getAllAttendance);
router.get("/within-range", isWithinRange);

export default router;
