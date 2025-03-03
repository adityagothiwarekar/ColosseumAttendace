// import React, { useState, useEffect } from "react";
// import Papa from "papaparse";
// import QRCode from "qrcode";
// import emailjs from "emailjs-com";

// const ColoNite = () => {
//   const [entries, setEntries] = useState([]);
//   const [verifiedEntries, setVerifiedEntries] = useState([]);
//   const workshopName = "Colo Nite";

//   useEffect(() => {
//     const storedEntries = localStorage.getItem("ColoNiteEntries");
//     const storedVerifiedEntries = localStorage.getItem("ColoNiteVerifiedEntries");
//     if (storedEntries) setEntries(JSON.parse(storedEntries));
//     if (storedVerifiedEntries) setVerifiedEntries(JSON.parse(storedVerifiedEntries));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("ColoNiteEntries", JSON.stringify(entries));
//     localStorage.setItem("ColoNiteVerifiedEntries", JSON.stringify(verifiedEntries));
//   }, [entries, verifiedEntries]);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     Papa.parse(file, {
//       skipEmptyLines: true,
//       complete: (result) => {
//         if (result.data.length < 2) return alert("CSV file has no valid data!");

//         const headers = result.data[1];
//         const getColumnIndex = (name) =>
//           headers.findIndex((h) => h.toLowerCase().includes(name.toLowerCase()));

//         const requiredColumns = ["name", "email", "department", "year", "Roll Number", "verified"];
//         const missingColumns = requiredColumns.filter((col) => getColumnIndex(col) === -1);

//         if (missingColumns.length > 0) {
//           alert(`Required columns missing: ${missingColumns.join(", ")}`);
//           return;
//         }

//         const nameIndex = getColumnIndex("name");
//         const emailIndex = getColumnIndex("email");
//         const departmentIndex = getColumnIndex("department");
//         const yearIndex = getColumnIndex("year");
//         const rollNumberIndex = getColumnIndex("Roll Number");
//         const verifiedIndex = getColumnIndex("verified");

//         const formattedData = result.data.slice(2).map((row) => ({
//           name: row[nameIndex] || "N/A",
//           email: row[emailIndex] || "N/A",
//           department: row[departmentIndex] || "N/A",
//           year: row[yearIndex] || "N/A",
//           rollNumber: row[rollNumberIndex] || "N/A",
//           verified: row[verifiedIndex] || "N",
//         }));

//         const verifiedData = formattedData.filter(
//           (entry) => entry.verified.toUpperCase() === "Y"
//         );

//         setEntries(formattedData);
//         setVerifiedEntries(verifiedData);
//       },
//     });
//   };

//   const generateQRCode = async (entry) => {
//     const qrData = `Name: ${entry.name}\nEmail: ${entry.email}\nDepartment: ${entry.department}\nYear: ${entry.year}\nRoll Number: ${entry.rollNumber}\nEvent: ${workshopName}`;
    
//     try {
//       return await QRCode.toDataURL(qrData, {
//         errorCorrectionLevel: "L",
//         scale: 4,
//         margin: 0,
//       });
//     } catch (error) {
//       console.error(`❌ Error generating QR code for ${entry.email}:`, error);
//       return null;
//     }
//   };

//   const overlayQRCodeOnTicket = async (qrCodeUrl) => {
//     return new Promise((resolve, reject) => {
//       const ticketImg = new Image();
//       ticketImg.src = "Tickets.jpg";
//       ticketImg.crossOrigin = "anonymous";
  
//       ticketImg.onload = () => {
//         const qrImg = new Image();
//         qrImg.src = qrCodeUrl;
//         qrImg.crossOrigin = "anonymous";
  
//         qrImg.onload = () => {
//           const canvas = document.createElement("canvas");
//           const ctx = canvas.getContext("2d");
  
//           const scaleFactor = 0.35;
//           canvas.width = ticketImg.width * scaleFactor;
//           canvas.height = ticketImg.height * scaleFactor;
  
//           ctx.drawImage(ticketImg, 0, 0, canvas.width, canvas.height);
  
//           const qrSize = 160;
//           const qrX = canvas.width - qrSize - 50;
//           const qrY = canvas.height - qrSize - 80;
//           ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
  
//           canvas.toBlob((blob) => {
//             resolve(blob);
//           }, "image/jpeg", 0.8);
//         };
  
//         qrImg.onerror = reject;
//       };
  
//       ticketImg.onerror = reject;
//     });
//   };
  
//   const sendBulkEmails = async () => {
//     for (const entry of verifiedEntries) {
//       try {
//         const qrCodeUrl = await generateQRCode(entry);
//         if (!qrCodeUrl) continue;

//         const ticketImageBlob = await overlayQRCodeOnTicket(qrCodeUrl);
//         if (!ticketImageBlob) continue;

//         const emailParams = {
//           to_email: entry.email,
//           to_name: entry.name,
//           from_name: "Colosseum Team",
//           department: entry.department,
//           year: entry.year,
//           roll_number: entry.rollNumber,
//           workshop_name: workshopName,
//           qr_code_url: uploadedQrCodeUrl,  // Make sure this is a public URL
//           reply_to: "your_fest_email@example.com",
//         };
        
//         const formData = new FormData();
//         formData.append("file", ticketImageBlob, "ticket.jpg");
//         formData.append("emailParams", JSON.stringify(emailParams));

//         await emailjs.send("service_rkj1v7l", "template_kpnpxfs", emailParams, "226oDfzd41tjisdP9");

//         console.log(`✅ Email sent to ${entry.email}`);
//       } catch (error) {
//         console.error(`❌ Failed to send email to ${entry.email}`, error);
//       }
//     }
//   };

//   return (
//     <div className="email-sender-container">
//       <h2 className="email-sender-title">Upload CSV for {workshopName}</h2>
//       <input type="file" accept=".csv" onChange={handleFileUpload} className="file-input" />
//       {verifiedEntries.length > 0 && (
//         <button onClick={sendBulkEmails} className="send-button">
//           Send Tickets for {workshopName}
//         </button>
//       )}
//     </div>
//   );
// };

// export default ColoNite;
