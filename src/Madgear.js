import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import emailjs from "emailjs-com";
import QRCode from "qrcode";

const Madgear = () => {
  const workshopName = "Madgear Workshop";

  const [entries, setEntries] = useState([]);
  const [verifiedEntries, setVerifiedEntries] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let lastRowIndex = localStorage.getItem("lastProcessedRowMadgear");
    if (!lastRowIndex) {
      lastRowIndex = "1"; // Default to first row if null or undefined
      localStorage.setItem("lastProcessedRowMadgear", lastRowIndex);
    }
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

        let lastProcessedRow = parseInt(localStorage.getItem("lastProcessedRowMadgear"), 10);
        lastProcessedRow = isNaN(lastProcessedRow) ? 1 : lastProcessedRow; // Ensure a valid number

        const newEntries = result.data.slice(lastProcessedRow + 1).map((row, index) => ({
          name: row[nameIndex] || "N/A",
          email: row[emailIndex] || "N/A",
          department: row[departmentIndex] || "N/A",
          year: row[yearIndex] || "N/A",
          rollNumber: row[rollNumberIndex] || "N/A",
          verified: row[verifiedIndex] || "N",
          rowNumber: lastProcessedRow + index + 1,
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
    try {
      const qrData = `Name: ${entry.name}\nEmail: ${entry.email}\nDepartment: ${entry.department}\nYear: ${entry.year}\nRoll No: ${entry.rollNumber}`;
      return await QRCode.toDataURL(qrData);
    } catch (error) {
      console.error("Error generating QR code:", error);
      return null;
    }
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
          workshop_name: "Madgear Workshop",
          reply_to: "dbitcolosseum2025@gmail.com",
          qr_code: qrCodeUrl,
        };

        console.log("Sending Email with Params:", emailParams);

        await emailjs.send("service_rkj1v7l", "template_kpnpxfs", emailParams, "226oDfzd41tjisdP9");

        console.log(`✅ Email sent to ${entry.email}`);
        maxRowNumber = Math.max(maxRowNumber, entry.rowNumber);
      } catch (error) {
        console.error(`❌ Failed to send email to ${entry.email}`, error);
      }
    }

    if (maxRowNumber > 0) {
      localStorage.setItem("lastProcessedRowMadgear", maxRowNumber); // Save correctly
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

export default Madgear;
