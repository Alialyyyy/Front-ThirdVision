import React, { useEffect } from "react";
import { io } from "socket.io-client";
import styles from "./Notification.module.css";

const socket = io("http://localhost:5001");

function Notification({ setLatestReports, latestReports, storeID }) { 

    useEffect(() => {
        const justLoggedIn = sessionStorage.getItem("justLoggedIn");
        
        if (justLoggedIn) {
            console.log("🚀 Just logged in, skipping immediate fetch.");
            sessionStorage.removeItem("justLoggedIn");
            return;
        }
    
        const fetchLatestReports = async () => {
            try {
                const response = await fetch("http://localhost:5001/latest-reports2");
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setLatestReports(data.slice(0, 1));  
            } catch (error) {
                console.error("Error fetching latest reports:", error);
            }
        };
    
        fetchLatestReports();
        const interval = setInterval(fetchLatestReports, 1000);
    
        return () => clearInterval(interval);
    }, [setLatestReports]);
    

    useEffect(() => {
        socket.on("new-detection", (newReport) => {
            console.log("🚨 New detection received:", newReport);
            setLatestReports([newReport]);  
        });

        return () => socket.off("new-detection");
    }, [setLatestReports]);

    if (!latestReports || latestReports.length === 0) return 
    
    <div className={styles.RepFound}>No reports found.</div>;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
    

    const openImage = () => {
        if (latestReports[0].image) {
            window.open(latestReports[0].image, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className={styles.notificationPanel}>
            <h1>FACE COVER DETECTION</h1>
            <div className={styles.repCardPanel}>
                <h3>❗<strong>{latestReports[0].detection_type}</strong>❗</h3>
                <h1><strong>{formatDate(latestReports[0].date)} {formatTime(latestReports[0].time)}</strong></h1>
            </div>
        </div>
    );
}

export default Notification;
