import User from "../model/authModel.js";
import ASFReport from "../model/reportModel.js";

import nodemailer from "nodemailer";

// Import User model

export const submitASFReport = async (req, res) => {
  try {
    const {
      district,
      sector,
      cell,
      symptoms,
      numberOfPigsAffected,
      phoneNumber,
      pigsDied,
      pigsRecovered,
    } = req.body;

    if (!district || !sector || !cell || !symptoms) {
      return res.status(400).json({ message: "All fields are required" });
    }

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

    // Step 1: Find all admin and authority users
    const adminsAndAuthorities = await User.find({
      role: { $in: ["authority", "admin"] },
    });

    // Step 2: Find the current user who submitted the report
    const owner = await User.findById(req.user.userId);

    // Collect email addresses
    const recipientEmails = [
      ...adminsAndAuthorities.map((user) => user.email),
      owner?.email, // Add owner email
    ].filter(Boolean); // Remove any undefined/null emails

    // Step 3: Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

   const mailOptions = {
  from: process.env.EMAIL_USERNAME,
  to: recipientEmails,
  subject: "New ASF Report Submitted",
  html: `
     <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #4F75FF 0%, #7B68EE 100%); padding: 30px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
          🐷 African Swine Fever System
        </h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">
          ASF Report Notification
        </p>
      </div>
      
      <!-- Content -->
      <div style="padding: 30px 20px;">
        <div style="background: #f8faff; border-left: 4px solid #4F75FF; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #223a66; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">
            📋 New ASF Report Submitted
          </h2>
          <p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.6;">
            A new ASF report has been submitted and requires your attention.
          </p>
        </div>
        
        <!-- Reporter Info -->
        <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #223a66; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
            👤 Reporter Information
          </h3>
          <div style="display: flex; flex-wrap: wrap; gap: 15px;">
            <div style="flex: 1; min-width: 200px;">
              <p style="margin: 0; color: #666;">
                <strong style="color: #223a66;">Name:</strong><br>
                <span style="color: #4F75FF; font-size: 14px; font-weight: 600;">
                  ${owner.firstName} ${owner.lastName}
                </span>
              </p>
            </div>
            <div style="flex: 1; min-width: 200px;">
              <p style="margin: 0; color: #666;">
                <strong style="color: #223a66;">Phone:</strong><br>
                <span style="color: #7B68EE; font-size: 14px; font-weight: 600;">
                  ${phoneNumber}
                </span>
              </p>
            </div>
          </div>
        </div>
        
        <!-- Location Information -->
        <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #223a66; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
            📍 Location Details
          </h3>
          <div style="display: flex; flex-wrap: wrap; gap: 15px;">
            <div style="flex: 1; min-width: 150px;">
              <p style="margin: 0; color: #666;">
                <strong style="color: #223a66;">District:</strong><br>
                <span style="color: #4F75FF; font-size: 14px; font-weight: 600;">
                  ${district}
                </span>
              </p>
            </div>
            <div style="flex: 1; min-width: 150px;">
              <p style="margin: 0; color: #666;">
                <strong style="color: #223a66;">Sector:</strong><br>
                <span style="color: #7B68EE; font-size: 14px; font-weight: 600;">
                  ${sector}
                </span>
              </p>
            </div>
            <div style="flex: 1; min-width: 150px;">
              <p style="margin: 0; color: #666;">
                <strong style="color: #223a66;">Cell:</strong><br>
                <span style="color: #4F75FF; font-size: 14px; font-weight: 600;">
                  ${cell}
                </span>
              </p>
            </div>
          </div>
        </div>
        
        <!-- Report Details -->
        <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #223a66; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
            🐷 Pig Health Report
          </h3>
          
          <!-- Symptoms -->
          <div style="margin-bottom: 20px; background: #fff5f5; border-left: 4px solid #f56565; padding: 15px; border-radius: 8px;">
            <p style="margin: 0 0 8px 0; color: #666;">
              <strong style="color: #c53030;">Symptoms Observed:</strong>
            </p>
            <p style="margin: 0; color: #c53030; font-size: 14px; font-weight: 600;">
              ${symptoms}
            </p>
          </div>
          
          <!-- Statistics -->
          <div style="display: flex; flex-wrap: wrap; gap: 15px;">
            <div style="flex: 1; min-width: 120px; background: #f7fafc; padding: 15px; border-radius: 8px; text-align: center;">
              <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: 600;">
                Affected
              </p>
              <p style="margin: 0; color: #2d3748; font-size: 20px; font-weight: 700;">
                ${numberOfPigsAffected || 0}
              </p>
            </div>
            <div style="flex: 1; min-width: 120px; background: #fed7d7; padding: 15px; border-radius: 8px; text-align: center;">
              <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: 600;">
                Deaths
              </p>
              <p style="margin: 0; color: #c53030; font-size: 20px; font-weight: 700;">
                ${pigsDied || 0}
              </p>
            </div>
            <div style="flex: 1; min-width: 120px; background: #c6f6d5; padding: 15px; border-radius: 8px; text-align: center;">
              <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: 600;">
                Recovered
              </p>
              <p style="margin: 0; color: #38a169; font-size: 20px; font-weight: 700;">
                ${pigsRecovered || 0}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Severity Alert -->
        ${(pigsDied > 0 || numberOfPigsAffected >= 5) ? `
        <div style="background: linear-gradient(135deg, rgba(245,101,101,0.1) 0%, rgba(229,62,62,0.1) 100%); border: 2px solid #fed7d7; border-radius: 10px; padding: 20px; margin-bottom: 25px; text-align: center;">
          <h3 style="color: #c53030; margin: 0 0 10px 0; font-size: 16px; font-weight: 700;">
            ⚠️ HIGH PRIORITY ALERT
          </h3>
          <p style="color: #742a2a; margin: 0; font-size: 14px; font-weight: 600;">
            This report requires immediate attention due to ${pigsDied > 0 ? 'pig deaths' : 'high number of affected pigs'}.
          </p>
        </div>
        ` : ''}
        
        <!-- Action Required -->
        <div style="background: linear-gradient(135deg, rgba(79,117,255,0.1) 0%, rgba(123,104,238,0.1) 100%); border-radius: 10px; padding: 20px; text-align: center;">
          <h3 style="color: #223a66; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
            ⚡ Action Required
          </h3>
          <p style="color: #4a5568; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
            Please log in to the ASF System to view the full report details and take appropriate action.
          </p>
      
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: #f7fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #718096; margin: 0; font-size: 14px;">
          This is an automated notification from African Swine Fever System<br>
          <strong style="color: #223a66;">Pig Health Monitoring Dashboard</strong>
        </p>
        <div style="margin-top: 15px;">
          <span style="display: inline-block; width: 8px; height: 8px; background: #4F75FF; border-radius: 50%; margin: 0 4px;"></span>
          <span style="display: inline-block; width: 8px; height: 8px; background: #7B68EE; border-radius: 50%; margin: 0 4px;"></span>
          <span style="display: inline-block; width: 8px; height: 8px; background: #4F75FF; border-radius: 50%; margin: 0 4px;"></span>
        </div>
      </div>
    </div>
  `,
};

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email sending failed:", err);
      } else {
        console.log("Notification email sent:", info.response);
      }
    });

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

    // Step 1: Find the report
    const report = await ASFReport.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Step 2: Push reply to the report
    report.replies.push({ senderRole, message });
    report.updatedAt = new Date();
    await report.save();

    // Step 3: Get the user who submitted the report
    const user = await User.findById(report.reportedBy);
    if (!user || !user.email) {
      return res.status(404).json({ message: "User who submitted the report not found or has no email." });
    }

    // Step 4: Configure and send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: "Response to Your ASF Report",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 10px; background: #f4f4f4;">
          <h2 style="color: #223a66;">ASF Report Response</h2>
          <p>Dear ${user.firstName} ${user.lastName},</p>
          <p>Your ASF report has received a new reply from <strong>${senderRole}</strong>:</p>
          <blockquote style="border-left: 4px solid #223a66; padding-left: 10px; color: #555;">
            ${message}
          </blockquote>
          <p>Please log in to the system to view full details and respond if needed.</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email sending failed:", err);
      } else {
        console.log("Reply notification email sent:", info.response);
      }
    });

    return res.status(200).json({
      status: "success",
      message: "Reply added and email sent to the reporter.",
      data: report,
    });
  } catch (error) {
    console.error("Reply to Report Error:", error);
    return res.status(500).json({ error: error.message });
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

export const getMonthlyTrends = async (req, res) => {
  try {
    const reports = await ASFReport.find();

    const monthMap = {
      0: "Jan",
      1: "Feb",
      2: "Mar",
      3: "Apr",
      4: "May",
      5: "Jun",
      6: "Jul",
      7: "Aug",
      8: "Sep",
      9: "Oct",
      10: "Nov",
      11: "Dec",
    };

    // Step 1: Initialize trends for all 12 months
    const trends = {};
    for (let i = 0; i < 12; i++) {
      const month = monthMap[i];
      trends[month] = { month, affected: 0, died: 0, recovered: 0 };
    }

    // Step 2: Aggregate report data into corresponding month
    for (const report of reports) {
      const date = new Date(report.createdAt);
      const month = monthMap[date.getMonth()];
      trends[month].affected += report.numberOfPigsAffected || 0;
      trends[month].died += report.pigsDied || 0;
      trends[month].recovered += report.pigsRecovered || 0;
    }

    // Step 3: Return all months in correct order
    const sortedTrends = Object.values(trends);

    return res.status(200).json(sortedTrends);
  } catch (error) {
    console.error("Trend Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getWeeklyTrends = async (req, res) => {
  try {
    const reports = await ASFReport.find();

    // Get current date and calculate 8 weeks back
    const now = new Date();
    const eightWeeksAgo = new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000);

    // Initialize trends for last 8 weeks
    const trends = {};
    for (let i = 0; i < 8; i++) {
      const weekStart = new Date(
        eightWeeksAgo.getTime() + i * 7 * 24 * 60 * 60 * 1000
      );
      const weekKey = `Week ${i + 1}`;
      trends[weekKey] = {
        week: weekKey,
        weekStart: weekStart.toISOString().split("T")[0],
        affected: 0,
        died: 0,
        recovered: 0,
      };
    }

    // Aggregate report data into corresponding weeks
    for (const report of reports) {
      const reportDate = new Date(report.createdAt);

      // Skip reports older than 8 weeks
      if (reportDate < eightWeeksAgo) continue;

      // Calculate which week this report belongs to
      const daysDiff = Math.floor(
        (reportDate - eightWeeksAgo) / (24 * 60 * 60 * 1000)
      );
      const weekIndex = Math.floor(daysDiff / 7);

      if (weekIndex >= 0 && weekIndex < 8) {
        const weekKey = `Week ${weekIndex + 1}`;
        trends[weekKey].affected += report.numberOfPigsAffected || 0;
        trends[weekKey].died += report.pigsDied || 0;
        trends[weekKey].recovered += report.pigsRecovered || 0;
      }
    }

    // Return weeks in correct order
    const sortedTrends = Object.values(trends);

    return res.status(200).json(sortedTrends);
  } catch (error) {
    console.error("Weekly Trend Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getYearlyTrends = async (req, res) => {
  try {
    const reports = await ASFReport.find();

    // Get all unique years from reports
    const years = new Set();
    const currentYear = new Date().getFullYear();

    // Add last 5 years to ensure we have data
    for (let i = 4; i >= 0; i--) {
      years.add((currentYear - i).toString());
    }

    // Add years from actual reports
    reports.forEach((report) => {
      const year = new Date(report.createdAt).getFullYear().toString();
      years.add(year);
    });

    // Initialize trends for all years
    const trends = {};
    Array.from(years).forEach((year) => {
      trends[year] = { year, affected: 0, died: 0, recovered: 0 };
    });

    // Aggregate report data into corresponding years
    for (const report of reports) {
      const year = new Date(report.createdAt).getFullYear().toString();
      if (trends[year]) {
        trends[year].affected += report.numberOfPigsAffected || 0;
        trends[year].died += report.pigsDied || 0;
        trends[year].recovered += report.pigsRecovered || 0;
      }
    }

    // Return years in ascending order
    const sortedTrends = Object.values(trends).sort(
      (a, b) => parseInt(a.year) - parseInt(b.year)
    );

    return res.status(200).json(sortedTrends);
  } catch (error) {
    console.error("Yearly Trend Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Alternative Weekly Trends - Current year weeks (if you prefer this approach)
export const getCurrentYearWeeklyTrends = async (req, res) => {
  try {
    const reports = await ASFReport.find();
    const currentYear = new Date().getFullYear();

    // Filter reports for current year only
    const currentYearReports = reports.filter((report) => {
      const reportYear = new Date(report.createdAt).getFullYear();
      return reportYear === currentYear;
    });

    // Get current week number
    const now = new Date();
    const startOfYear = new Date(currentYear, 0, 1);
    const currentWeek = Math.ceil(
      ((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7
    );

    // Initialize trends for weeks (showing last 12 weeks or current year weeks)
    const trends = {};
    const weeksToShow = Math.min(currentWeek, 12);

    for (let i = 1; i <= weeksToShow; i++) {
      trends[`Week ${i}`] = {
        week: `Week ${i}`,
        affected: 0,
        died: 0,
        recovered: 0,
      };
    }

    // Aggregate current year report data into weeks
    for (const report of currentYearReports) {
      const reportDate = new Date(report.createdAt);
      const weekNumber = Math.ceil(
        ((reportDate - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7
      );
      const weekKey = `Week ${weekNumber}`;

      if (trends[weekKey]) {
        trends[weekKey].affected += report.numberOfPigsAffected || 0;
        trends[weekKey].died += report.pigsDied || 0;
        trends[weekKey].recovered += report.pigsRecovered || 0;
      }
    }

    const sortedTrends = Object.values(trends);

    return res.status(200).json(sortedTrends);
  } catch (error) {
    console.error("Current Year Weekly Trend Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Enhanced Monthly Trends with year filter option
export const getMonthlyTrendsWithYear = async (req, res) => {
  try {
    const { year } = req.query; // Optional year parameter
    const reports = await ASFReport.find();

    const monthMap = {
      0: "Jan",
      1: "Feb",
      2: "Mar",
      3: "Apr",
      4: "May",
      5: "Jun",
      6: "Jul",
      7: "Aug",
      8: "Sep",
      9: "Oct",
      10: "Nov",
      11: "Dec",
    };

    // Filter reports by year if specified
    const filteredReports = year
      ? reports.filter(
          (report) =>
            new Date(report.createdAt).getFullYear() === parseInt(year)
        )
      : reports;

    // Initialize trends for all 12 months
    const trends = {};
    for (let i = 0; i < 12; i++) {
      const month = monthMap[i];
      trends[month] = { month, affected: 0, died: 0, recovered: 0 };
    }

    // Aggregate report data into corresponding month
    for (const report of filteredReports) {
      const date = new Date(report.createdAt);
      const month = monthMap[date.getMonth()];
      trends[month].affected += report.numberOfPigsAffected || 0;
      trends[month].died += report.pigsDied || 0;
      trends[month].recovered += report.pigsRecovered || 0;
    }

    const sortedTrends = Object.values(trends);

    return res.status(200).json(sortedTrends);
  } catch (error) {
    console.error("Monthly Trend Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
