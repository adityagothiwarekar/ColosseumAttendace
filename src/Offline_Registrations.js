import React, { useState } from "react";
import Papa from "papaparse";
import emailjs from "emailjs-com";
import QRCode from "qrcode";

const Offlineregistrations = () => {
  const [entries, setEntries] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  
  const workshops = ["Utkarsh Talk", "Dr Mayank Talk", "Vineet Talk", "Ali Talk" , "Surya Talk" , "Stand up Comedy"];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (result) => {
        if (result.data.length < 2) return alert("CSV file has no valid data!");

        const headers = result.data[0]; // Use the first row as headers
        if (!headers) return alert("Invalid CSV format!");
        
        const getColumnIndex = (name) => headers.findIndex((h) => h.trim().toLowerCase().includes(name.toLowerCase()));

        const nameIndex = getColumnIndex("name");
        const emailIndex = getColumnIndex("email");
        const departmentIndex = getColumnIndex("department");
        const yearIndex = getColumnIndex("year");
        const rollNumberIndex = getColumnIndex("roll number");

        const missingColumns = [];
        if (nameIndex === -1) missingColumns.push("Name");
        if (emailIndex === -1) missingColumns.push("Email");
        if (departmentIndex === -1) missingColumns.push("Department");
        if (yearIndex === -1) missingColumns.push("Year");
        if (rollNumberIndex === -1) missingColumns.push("Roll Number");

        if (missingColumns.length > 0) {
          alert(`Missing columns: ${missingColumns.join(", ")}`);
          return;
        }

        const newEntries = result.data.slice(1).map((row, index) => ({
          name: row[nameIndex] || "N/A",
          email: row[emailIndex] || "N/A",
          department: row[departmentIndex] || "N/A",
          year: row[yearIndex] || "N/A",
          rollNumber: row[rollNumberIndex] || "N/A",
          rowNumber: index + 1,
        }));

        setEntries(newEntries);
      },
    });
  };

  const generateQRCode = async (entry) => {
    try {
      return await QRCode.toDataURL(`${entry.name} - ${entry.email} - ${entry.rollNumber} - ${entry.department} - ${entry.year}`);
    } catch (error) {
      console.error("Error generating QR code:", error);
      return "";
    }
  };

  const sendBulkEmails = async () => {
    if (!selectedWorkshop) {
      alert("Please select a workshop!");
      return;
    }

    if (entries.length === 0) {
      alert("No entries to send emails!");
      return;
    }

    for (const entry of entries) {
      try {
        const qrCodeUrl = await generateQRCode(entry);
        
        const emailParams = {
          to_email: entry.email,
          to_name: entry.name,
          from_name: "Colosseum Team",
          department: entry.department,
          year: entry.year,
          roll_number: entry.rollNumber,
          workshop_name: selectedWorkshop,
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

    setSuccessMessage("✅ Successfully registered all entries!");
  };

  return (
    <div className="email-sender-container">
      <h2 className="email-sender-title">Upload CSV and Select Workshop</h2>

      <div className="dropdown-section">
        <label>Select Workshop: </label>
        <select value={selectedWorkshop} onChange={(e) => setSelectedWorkshop(e.target.value)}>
          <option value="">-- Select Workshop --</option>
          {workshops.map((workshop, index) => (
            <option key={index} value={workshop}>{workshop}</option>
          ))}
        </select>
      </div>

      <div className="file-upload-section">
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload} 
          className="file-input"
        />
      </div>

      {entries.length > 0 && (
        <div className="button-section">
          <button 
            onClick={sendBulkEmails} 
            className="send-button"
            disabled={!selectedWorkshop}
          >
            Send Emails for {selectedWorkshop || "Workshop"}
          </button>
        </div>
      )}

      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default Offlineregistrations;