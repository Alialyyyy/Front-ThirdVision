import React, { useState, useEffect } from "react";
import redW from "../../assets/alarm.gif";
import styles from "./PopUp.module.css";

function PopUpNotif({ latestReports }) { 
    const [lastSeenReportId, setLastSeenReportId] = useState(() => {
        return localStorage.getItem("lastSeenReportId") || null;
    });

    useEffect(() => {
        if (latestReports.length > 0) {
            const filteredReports = latestReports.filter(report =>
                report.threat_level === "2nd Warning" || report.threat_level === "3rd Warning" || report.threat_level === "1st Warning"
            );

            if (filteredReports.length > 0) {
                const latestReport = filteredReports[0]; 
                const latestReportId = latestReport.detection_ID;
                console.log("🆕 New Warning Report ID:", latestReportId);

                const dismissedReportId = sessionStorage.getItem("dismissedReportId");
                console.log("🔄 Previously Dismissed Report ID:", dismissedReportId);

                if (!dismissedReportId || latestReportId !== parseInt(dismissedReportId, 10)) {
                    if (latestReportId !== parseInt(lastSeenReportId, 10)) {
                        openPopupWindow(latestReport, latestReportId);
                        setLastSeenReportId(latestReportId);
                        localStorage.setItem("lastSeenReportId", latestReportId);
                    } else {
                        console.log("🚫 Report already seen, not triggering popup.");
                    }
                } else {
                    console.log("🚫 PopUp is already dismissed, not showing again.");
                }
            } else {
                console.log("✅ No '2nd Warning' or '3rd Warning' threats found.");
            }
        }
    }, [latestReports, lastSeenReportId]);

    const closePopup = () => {
        if (lastSeenReportId) {
            sessionStorage.setItem("dismissedReportId", lastSeenReportId);
        }
    };

    const formatTime = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const second = parseInt(seconds, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second} ${ampm}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const openPopupWindow = (report, reportId) => {
        const popupWindow = window.open("", "Report Notification", "width=500,height=750");

        if (popupWindow) {
            popupWindow.document.write(`
                <html>
                    <head>
                        <title>THREAT DETECTED</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                padding: 30px;
                                text-align: center;
                                background-color: rgb(0, 0, 0);
                            }
                            .alert-container {
                                background: white;
                                padding: 3px;
                                border-radius: 12px;
                                box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
                                max-width: 500px;
                                margin: auto;
                            }
                            h1, h3, h2 {
                                font-size: 28px;
                                color: #222;
                            }
                            h3 { color: red; font-weight: bold; }
                            h2 { color: #444; }
                            img {
                                width: 120px;
                                margin: 5px 0;
                            }
                            .btn {
                                display: inline-block;
                                padding: 12px 20px;
                                font-size: 16px;
                                font-weight: bold;
                                text-transform: uppercase;
                                border: none;
                                border-radius: 8px;
                                cursor: pointer;
                                transition: all 0.3s ease-in-out;
                                margin: 10px;
                            }
                            .view-btn {
                                background-color: #007bff;
                                color: white;
                            }
                            .view-btn:hover {
                                background-color: #0056b3;
                            }
                            .close-btn {
                                background-color: #dc3545;
                                color: white;
                            }
                            .close-btn:hover {
                                background-color: #b02a37;
                            }
                            .date-time {
                                font-size: 20px;
                                font-weight: bold;
                                color: #333;
                            }
                        </style>
                        <script>
                            function closePopup() {
                                window.opener.postMessage({ reportId: ${reportId} }, "*");
                                window.close();
                            }
                        </script>
                    </head>
                    <body>
                        <div class="alert-container">
                            <h3>${report.threat_level}</h3>
                            <div>
                                <img src="${report.image}" alt="Threat Image"/>
                            </div>
                            <button class="btn view-btn" onclick="window.open('${report.image}', '_blank')">🔍 VIEW THREAT</button>
                            <h3>${report.detection_type}</h3>
                            <h2>${report.store_name}, ${report.store_location}</h2>
                            <div class="date-time">${formatDate(report.date)} | ${formatTime(report.time)}</div>
                            <button class="btn close-btn" onClick="closePopup()">✖ CLOSE</button>
                        </div>
                    </body>
                </html>
            `);
            popupWindow.document.close();
        }
    };

    useEffect(() => {
        const handlePopupClose = (event) => {
            if (event.data?.reportId) {
                sessionStorage.setItem("dismissedReportId", event.data.reportId);
            }
        };

        window.addEventListener("message", handlePopupClose);
        return () => window.removeEventListener("message", handlePopupClose);
    }, []);

    return null; 
}

export default PopUpNotif;
