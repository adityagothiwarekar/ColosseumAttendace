import React, { useState } from "react";
import Papa from "papaparse";
import emailjs from "emailjs-com";
import QRCode from "qrcode";

const SuryaTalk = () => {
  const [entries, setEntries] = useState([]);
  const [verifiedEntries, setVerifiedEntries] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const aliTalkWorkshopName = "Surya Talk";

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (result) => {
        if (result.data.length < 2) return alert("CSV file has no valid data!");

        const headers = result.data[1];
        const getColumnIndex = (name) => headers.findIndex((h) => h.toLowerCase().includes(name.toLowerCase()));

        const nameIndex = getColumnIndex("name");
        const emailIndex = getColumnIndex("email");
        const departmentIndex = getColumnIndex("department");
        const yearIndex = getColumnIndex("year");
        const rollNumberIndex = getColumnIndex("Roll Number");
        const verifiedIndex = getColumnIndex("verified");

        if ([nameIndex, emailIndex, departmentIndex, yearIndex, rollNumberIndex, verifiedIndex].includes(-1)) {
          alert("Required columns missing!");
          return;
        }

        let lastProcessedRow = localStorage.getItem("lastProcessedRowSurya");
        lastProcessedRow = lastProcessedRow ? parseInt(lastProcessedRow, 10) : 1;
        console.log("Previously processed row:", lastProcessedRow);

        const newEntries = result.data.slice(lastProcessedRow + 1).map((row, index) => ({
          name: row[nameIndex] || "N/A",
          email: row[emailIndex] || "N/A",
          department: row[departmentIndex] || "N/A",
          year: row[yearIndex] || "N/A",
          rollNumber: row[rollNumberIndex] || "N/A",
          verified: row[verifiedIndex] || "N",
          rowNumber: lastProcessedRow + index + 1,
        }));

        console.log("New Entries:", newEntries);

        const verifiedData = newEntries.filter(entry => entry.verified.toUpperCase() === "Y");
        console.log("Verified Entries:", verifiedData);

        setEntries(newEntries);
        setVerifiedEntries(verifiedData);
      },
    });
  };

  const generateQRCode = async (entry) => {
    try {
      return await QRCode.toDataURL(`${entry.name} - ${entry.email} - ${entry.rollNumber}`);
    } catch (error) {
      console.error("Error generating QR code:", error);
      return "";
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
          workshop_name: aliTalkWorkshopName,
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
      console.log("Updating last processed row:", maxRowNumber);
      localStorage.setItem("lastProcessedRowSurya", maxRowNumber);
    }

    setSuccessMessage("✅ Successfully registered all new entries!");
  };

   return (
    <div className="email-sender-container">
      <h2 className="email-sender-title">Upload CSV for {aliTalkWorkshopName}</h2>

      <div className="file-upload-section">
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload} 
          className="file-input"
        />
      </div>

      {verifiedEntries.length > 0 && (
        <div className="button-section">
          <button 
            onClick={sendBulkEmails} 
            className="send-button"
          >
            Send Emails for {aliTalkWorkshopName}
          </button>
        </div>
      )}

      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};



export default SuryaTalk;
