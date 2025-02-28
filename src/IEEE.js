import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import emailjs from "emailjs-com";
import QRCode from "qrcode";

const IEEE = () => {
  const [entries, setEntries] = useState([]);
  const [verifiedEntries, setVerifiedEntries] = useState([]);
  const [lastSentIndex, setLastSentIndex] = useState(
    parseInt(localStorage.getItem("lastSentIndex")) || 0
  );
  const [successMessage, setSuccessMessage] = useState("");

  const workshopName = "IEEE Workshop";

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

        const formattedData = result.data.slice(2).map((row) => {
          return {
            name: row[getColumnIndex("Member1 Name")] || "N/A",
            email: row[getColumnIndex("Member1 Email")] || "N/A",
            department: row[getColumnIndex("Member1 Department")] || "N/A",
            year: row[getColumnIndex("Member1 Year")] || "N/A",
            rollNumber: row[getColumnIndex("Member1 Gender")] || "N/A",
            verified: row[getColumnIndex("verified")] || "N",
            otherMembers: [2, 3, 4].map((i) => ({
              name: row[getColumnIndex(`Member${i} Name`)] || "N/A",
              department: row[getColumnIndex(`Member${i} Department`)] || "N/A",
              year: row[getColumnIndex(`Member${i} Year`)] || "N/A",
              rollNumber: row[getColumnIndex(`Member${i} Gender`)] || "N/A",
            })),
          };
        });

        console.log("Last row index:", result.data.length - 1);

        const verifiedData = formattedData.filter(
          (entry) => entry.verified.toUpperCase() === "Y" && entry.email !== "N/A"
        );

        setEntries(formattedData);
        setVerifiedEntries(verifiedData);
      },
    });
  };

  const generateQRCode = async (entry) => {
    const qrData = `Name: ${entry.name}\nEmail: ${entry.email}\nDepartment: ${entry.department}\nYear: ${entry.year}\nRoll Number: ${entry.rollNumber}\nEvent: ${workshopName}\n\nOther Members:\n` +
      entry.otherMembers
        .map((m, index) => `Member ${index + 2}: ${m.name}, ${m.email}, ${m.department}, ${m.year}, ${m.rollNumber}`)
        .join("\n");
    return await QRCode.toDataURL(qrData);
  };

  const sendBulkEmails = async () => {
    let emailsSent = 0;
    for (let i = lastSentIndex; i < verifiedEntries.length; i++) {
      const entry = verifiedEntries[i];
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

        await emailjs.send("service_rkj1v7l", "template_kpnpxfs", emailParams, "226oDfzd41tjisdP9");
        emailsSent++;
        setLastSentIndex(i + 1);
        localStorage.setItem("lastSentIndex", i + 1);
      } catch (error) {
        console.error(`❌ Failed to send email to ${entry.email}`, error);
      }
    }

    setSuccessMessage(`${emailsSent} emails sent successfully!`);
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

export default IEEE;