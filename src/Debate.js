import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import emailjs from "emailjs-com";
import QRCode from "qrcode";
import "./EmailSender.css"; // Ensure styling applies to this page as well

const Debate = () => {
  const [entries, setEntries] = useState([]);
  const [verifiedEntries, setVerifiedEntries] = useState([]);
  const workshopName = "Debate Workshop";

  useEffect(() => {
    const storedEntries = localStorage.getItem("debateEntries");
    const storedVerifiedEntries = localStorage.getItem("debateVerifiedEntries");
    if (storedEntries) setEntries(JSON.parse(storedEntries));
    if (storedVerifiedEntries) setVerifiedEntries(JSON.parse(storedVerifiedEntries));
  }, []);

  useEffect(() => {
    localStorage.setItem("debateEntries", JSON.stringify(entries));
    localStorage.setItem("debateVerifiedEntries", JSON.stringify(verifiedEntries));
  }, [entries, verifiedEntries]);

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
        const rollNumberIndex = getColumnIndex("Roll Number");
        const verifiedIndex = getColumnIndex("verified");

        const formattedData = result.data.slice(2).map((row) => ({
          name: row[nameIndex] || "N/A",
          email: row[emailIndex] || "N/A",
          department: row[departmentIndex] || "N/A",
          year: row[yearIndex] || "N/A",
          rollNumber: row[rollNumberIndex] || "N/A",
          verified: row[verifiedIndex] || "N",
        }));

        const verifiedData = formattedData.filter(
          (entry) => entry.verified.toUpperCase() === "Y"
        );

        setEntries(formattedData);
        setVerifiedEntries(verifiedData);
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
          reply_to: "your_fest_email@example.com",
          qr_code: qrCodeUrl,
        };

        console.log("Sending Email with Params:", emailParams);

        await emailjs.send("service_rkj1v7l", "template_kpnpxfs", emailParams, "226oDfzd41tjisdP9");

        console.log(`✅ Email sent to ${entry.email}`);
      } catch (error) {
        console.error(`❌ Failed to send email to ${entry.email}`, error);
      }
    }
  };

  return (
    <div className="email-sender-container"> 
      <h2 className="email-sender-title">Upload CSV for {workshopName}</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} className="file-input" />

      {verifiedEntries.length > 0 && (
        <button
          onClick={sendBulkEmails}
          className="send-button"
        >
          Send Emails for {workshopName}
        </button>
      )}
    </div>
  );
};

export default Debate;
