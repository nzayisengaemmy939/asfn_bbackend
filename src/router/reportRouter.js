import express from "express";
import {
  assignReportToVet,
  deleteReport,
  editReport,
  getAllReports,
  getMonthlyTrends,
  getReport,
  getReportsByOwner,
  replyToReport,
  submitASFReport,
  updateReportStatus,
} from "../contoller/reportController.js";
import checkMiddleware from "../middleware/middleware.js";

const reportRoute = express.Router();
export default reportRoute;

reportRoute.post(
  "/report/register",
  checkMiddleware.authenticateToken,
  submitASFReport
);
reportRoute.get("/report/all", getAllReports);
reportRoute.get("/report/:userId", getReportsByOwner);
reportRoute.put("/report/edit/:id", editReport);
reportRoute.delete("/report/delete/:id", deleteReport);
reportRoute.post(
  "/report/reply/:id",
  checkMiddleware.authenticateToken,
  replyToReport
);
reportRoute.put("/report/assign/:id", assignReportToVet);
reportRoute.get("/report/get/assign/:email", getReport);
reportRoute.put("/report/status/:id", updateReportStatus);
reportRoute.get("/monthly-trends", getMonthlyTrends);