import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import emailjs from "emailjs-com";
import QRCode from "qrcode";
import "./EmailSender.css";

const EmailSender = () => {
  const [entries, setEntries] = useState([]);
  const [verifiedEntries, setVerifiedEntries] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const workshopName = "GDSC Workshop";

  useEffect(() => {
    // Retrieve the last processed row index from localStorage
    const lastRowIndex = localStorage.getItem("lastProcessedRow");
    console.log("Last processed row index:", lastRowIndex);
  }, []);

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

        const nameIndex = getColumnIndex("name");
        const emailIndex = getColumnIndex("email");
        const departmentIndex = getColumnIndex("department");
        const yearIndex = getColumnIndex("year");
        const rollNumberIndex = getColumnIndex("Roll Number");
        const verifiedIndex = getColumnIndex("verified");

        if (
          emailIndex === -1 ||
          verifiedIndex === -1 ||
          nameIndex === -1 ||
          departmentIndex === -1 ||
          yearIndex === -1 ||
          rollNumberIndex === -1
        ) {
          alert("Required columns missing!");
          return;
        }

        let lastProcessedRow = localStorage.getItem("lastProcessedRow");
        lastProcessedRow = lastProcessedRow ? parseInt(lastProcessedRow, 10) : 1; // Default to 1st row

        // Filter new entries based on last processed row
        const newEntries = result.data.slice(lastProcessedRow + 1).map((row, index) => ({
          name: row[nameIndex] || "N/A",
          email: row[emailIndex] || "N/A",
          department: row[departmentIndex] || "N/A",
          year: row[yearIndex] || "N/A",
          rollNumber: row[rollNumberIndex] || "N/A",
          verified: row[verifiedIndex] || "N",
          rowNumber: lastProcessedRow + index + 1, // Track row numbers
        }));

        const verifiedData = newEntries.filter(
          (entry) => entry.verified.toUpperCase() === "Y"
        );

        setEntries(newEntries);
        setVerifiedEntries(verifiedData);
      },
    });
  };

  const generateQRCode = async (entry) => {
    const qrData = `Name: ${entry.name}\nEmail: ${entry.email}\nDepartment: ${entry.department}\nYear: ${entry.year}\nRoll Number: ${entry.rollNumber}\nEvent: ${workshopName}`;
    return await QRCode.toDataURL(qrData);
  };

  const sendBulkEmails = async () => {
    if (verifiedEntries.length === 0) {
      alert("No new verified entries to send emails!");
      return;
    }

    let maxRowNumber = 0;

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
          workshop_name: "MERN Stack Workshop",
          reply_to: "dbitcolosseum2025@gmail.com",
          qr_code: qrCodeUrl,
        };

        console.log("Sending Email with Params:", emailParams);

        await emailjs.send("service_rkj1v7l", "template_kpnpxfs", emailParams, "226oDfzd41tjisdP9");

        console.log(`✅ Email sent to ${entry.email}`);
        maxRowNumber = Math.max(maxRowNumber, entry.rowNumber); // Track last processed row
      } catch (error) {
        console.error(`❌ Failed to send email to ${entry.email}`, error);
      }
    }

    if (maxRowNumber > 0) {
      localStorage.setItem("lastProcessedRow", maxRowNumber);
    }

    setSuccessMessage("✅ Successfully registered all new entries!");
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

export default EmailSender;