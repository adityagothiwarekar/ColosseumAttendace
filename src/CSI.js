import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import emailjs from "emailjs-com";
import QRCode from "qrcode";
import "./EmailSender.css"; // Ensure styling applies to this page as well

const CSI = () => {
  const [entries, setEntries] = useState([]);
  const [verifiedEntries, setVerifiedEntries] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // Define successMessage state
  const workshopName = "CSI Workshop";

  const getLastProcessedRow = () => {
    return parseInt(localStorage.getItem("csi_last_processed_row")) || 0;
  };

  const setLastProcessedRow = (rowIndex) => {
    localStorage.setItem("csi_last_processed_row", rowIndex);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (result) => {
        if (result.data.length < 2) return alert("CSV file has no valid data!");

        const headers = result.data[1];
        const getColumnIndex = (name) =>
          headers.findIndex((h) => h.toLowerCase().includes(name.toLowerCase()));

        const requiredColumns = ["name", "email", "department", "year", "Roll Number", "verified"];
        const missingColumns = requiredColumns.filter((col) => getColumnIndex(col) === -1);

        if (missingColumns.length > 0) {
          alert(`Required columns missing: ${missingColumns.join(", ")}`);
          console.log("Missing columns:", missingColumns);
          return;
        }

        const nameIndex = getColumnIndex("name");
        const emailIndex = getColumnIndex("email");
        const departmentIndex = getColumnIndex("department");
        const yearIndex = getColumnIndex("year");
        const rollNumberIndex = getColumnIndex("Roll number");
        const verifiedIndex = getColumnIndex("verified");

        let lastProcessedRow = getLastProcessedRow();

        const formattedData = result.data.slice(2).map((row, index) => ({
          name: row[nameIndex] || "N/A",
          email: row[emailIndex] || "N/A",
          department: row[departmentIndex] || "N/A",
          year: row[yearIndex] || "N/A",
          rollNumber: row[rollNumberIndex] || "N/A",
          verified: row[verifiedIndex] || "N",
          rowIndex: index + 2,
        }));

        const newEntries = formattedData.filter(
          (entry) => entry.verified.toUpperCase() === "Y" && entry.rowIndex > lastProcessedRow
        );

        setEntries(formattedData);
        setVerifiedEntries(newEntries);
      },
    });
  };

  const generateQRCode = async (entry) => {
    const qrData = `Name: ${entry.name}\nEmail: ${entry.email}\nDepartment: ${entry.department}\nYear: ${entry.year}\nRoll Number: ${entry.rollNumber}\nEvent: ${workshopName}`;
    return await QRCode.toDataURL(qrData);
  };

  const sendBulkEmails = async () => {
    for (const entry of verifiedEntries) {
      try {
        const qrCodeUrl = await generateQRCode(entry);

        const emailParams = {
          to_email: entry.email,
          to_name: entry.name,
          from_name: "Colosseum Team",
          department: entry.department,
          year: entry.year,
          roll_number: entry.rollNumber,
          workshop_name: workshopName,
          reply_to: "dbitcolosseum2025@gmail.com",
          qr_code: qrCodeUrl,
        };

        console.log("Sending Email with Params:", emailParams);

        await emailjs.send("service_rkj1v7l", "template_kpnpxfs", emailParams, "226oDfzd41tjisdP9");

        console.log(`✅ Email sent to ${entry.email}`);
      } catch (error) {
        console.error(`❌ Failed to send email to ${entry.email}`, error);
      }
    }

    if (verifiedEntries.length > 0) {
      const maxRowNumber = Math.max(...verifiedEntries.map((entry) => entry.rowIndex));
      setLastProcessedRow(maxRowNumber);
      console.log(`Updated last processed row to ${maxRowNumber}`);

      // Display success message after sending all emails
      setSuccessMessage("✅ Successfully registered all new entries!");
    }
  };

  return (
    <div className="email-sender-container">
      <h2 className="email-sender-title">Upload CSV for {workshopName}</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} className="file-input" />

      {verifiedEntries.length > 0 && (
        <button onClick={sendBulkEmails} className="send-button">
          Send Emails for {workshopName}
        </button>
      )}

      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default CSI;
