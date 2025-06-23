import User from "../model/authModel.js";
import ASFReport from "../model/reportModel.js";

export const submitASFReport = async (req, res) => {
  try {
    const { district, sector, cell, symptoms, numberOfPigsAffected,phoneNumber,pigsDied,pigsRecovered} = req.body;

    if (!district || !sector || !cell || !symptoms) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log(req.user.userId);
    const newReport = new ASFReport({
      district,
      sector,
      cell,
      phoneNumber,
      symptoms,
      numberOfPigsAffected,
      pigsDied,
      pigsRecovered,
      reportedBy: req.user.userId,
      senderRole: req.user.role,
    });

    await newReport.save();
    return res.status(201).json({ message: "Report submitted successfully" });
  } catch (err) {
    console.error("Submit Report Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
//all report
export const getAllReports = async (req, res) => {
  try {
    const reports = await ASFReport.find();
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getReport = async (req, res) => {
  try {
    const report = await ASFReport.find({ assignedTo: req.params.email });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//to filter report according to the owner actully

export const getReportsByOwner = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reports = await ASFReport.find({ reportedBy: userId });

    if (!reports.length) {
      return res
        .status(404)
        .json({ message: "No reports found for this owner" });
    }

    res.status(200).json(reports);
  } catch (err) {
    console.error("Get Reports by Owner Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
//edit report
export const editReport = async (req, res) => {
  try {
    const { district, sector, cell, symptoms, numberOfPigsAffected } = req.body;
    const reportFound = await ASFReport.findOne({ _id: req.params.id });

    if (!reportFound) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (district) {
      reportFound.district = district;
    }
    if (sector) {
      reportFound.sector = sector;
    }
    if (cell) {
      reportFound.cell = cell;
    }
    if (symptoms) {
      reportFound.symptoms = symptoms;
    }
    if (numberOfPigsAffected) {
      reportFound.numberOfPigsAffected = numberOfPigsAffected;
    }

    reportFound.updatedAt = new Date();

    await reportFound.save();

    return res.status(200).json({
      message: "Report updated successfully",
      data: reportFound,
    });
  } catch (error) {
    return res.status(500).json({
      status: "internal server error",
      error: error.message,
    });
  }
};
//delete report

export const deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const reportFound = await ASFReport.findByIdAndDelete(reportId);
    if (!reportFound) {
      return res.status(404).json({
        status: "error",
        message: "Report not found",
      });
    }
    return res.status(200).json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "internal server error",
      error: error.message,
    });
  }
};

//reply to a given report

export const replyToReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, senderRole } = req.body;

    if (!message || !senderRole) {
      return res.status(400).json({
        message: "Message and senderRole are required",
      });
    }

    const report = await ASFReport.findById(id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    report.replies.push({
      senderRole,
      message,
    });

    report.updatedAt = new Date();
    await report.save();

    return res.status(200).json({
      status: "success",
      message: "Reply added successfully",
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//assign report to vetrinarian

export const assignReportToVet = async (req, res) => {
  try {
    const reportId = req.params.id;
    const { vetEmail } = req.body;

    if (!vetEmail) {
      return res.status(400).json({
        status: "error",
        message: "Veterinarian email is required",
      });
    }

    const report = await ASFReport.findById(reportId);
    if (!report) {
      return res.status(404).json({
        status: "error",
        message: "Report not found",
      });
    }

    const vet = await User.findOne({ email: vetEmail });
    if (!vet) {
      return res.status(404).json({
        status: "error",
        message: "Veterinarian not found with that email",
      });
    }

    report.assignedTo = vet.email;
    await report.save();

    return res.status(200).json({
      status: "success",
      message: "Report assigned to veterinarian",
      assignedTo: {
        id: vet._id,
        email: vet.email,
        name: `${vet.firstName} ${vet.lastName}`,
      },
    });
  } catch (error) {
    console.error("Assign Error:", error);
    return res.status(500).json({
      status: "internal server error",
      error: error.message,
    });
  }
};


// Update report status
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "received", "resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const report = await ASFReport.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    await report.save();

    return res.status(200).json({ message: "Status updated", report });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
