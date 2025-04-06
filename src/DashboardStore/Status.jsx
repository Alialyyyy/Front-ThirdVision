import styles from './Status.module.css';
import React, { useState, useEffect } from 'react';
import ReportLineGraph from "./ReportLineGraph.jsx";
import Notification from "./NotifAlert/Notification.jsx";
import PopUpNotif from "./NotifAlert/PopupNotif.jsx";
import LowThreat from './NotifAlert/LowThreat.jsx';

function Status({ storeID, isLoggedIn }) {
    const [isOpen, setIsOpen] = useState(false);
    const [time, setTime] = useState(new Date());
    const [count, setCount] = useState(0);
    const [latestReports, setLatestReports] = useState([]); 

    useEffect(() => {
        if (storeID) {
            console.log("Fetching count for storeID:", storeID);
            fetch(`http://localhost:5001/api/history-count2/${storeID}`)
                .then(response => response.json())
                .then(data => {
                    setCount(data.count);
                })
                .catch(error => console.error('Error fetching incident count:', error));
        }
    }, [storeID]);

    useEffect(() => {
        if (!storeID) return;

        const fetchReportData = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/report-count-per-month/${storeID}`);
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                setReportData(data);
            } catch (error) {
                console.error("Error fetching report count data:", error);
            }
        };

        fetchReportData();
    }, [storeID]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <>
            <div className={styles.MainPanel}>
                {/* ✅ Row 1 - Event Section */}
                <div className={styles.event}>
                    <Notification storeID={storeID} setLatestReports={setLatestReports} latestReports={latestReports} />
                    <PopUpNotif latestReports={latestReports} />
                </div>
            </div>
        </>
    );
}

export default Status;
