import { useState, useEffect } from 'react';
import styles from './DeleteHistory.module.css';  

function DeleteHistory({ closePanel }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDeleteHistory();
    }, []);

    const fetchDeleteHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5001/api/delete-history");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            setHistory(data);
        } catch (error) {
            console.error("Error fetching delete history:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM'; 
        const formattedHour = hour % 12 || 12; 
        return `${formattedHour}:${minute < 10 ? '0' + minute : minute} ${ampm}`;
    };

    return (
        <div className={styles.floatingPanel}>
            <button className={styles.closeButton} onClick={closePanel}>✖</button>
            <h2 className={styles.title}>Deleted Incident History</h2>

            {loading ? (
                <p className={styles.loading}>Loading...</p>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date Deleted</th>
                                <th>Time Deleted</th>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Store ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? (
                                history.slice().reverse().map((entry) => (
                                    <tr key={entry.detection_ID}>
                                        <td>{formatDate(entry.date_deleted)}</td>
                                        <td>{formatTime(entry.time_deleted)}</td>
                                        <td>{entry.detection_ID}</td>
                                        <td>{formatDate(entry.date)}</td>
                                        <td>{formatTime(entry.time)}</td>
                                        <td>{entry.store_ID}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", fontStyle: "italic" }}>
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <button>Clear Table</button>
                </div>
            )}
        </div>
    );
}

export default DeleteHistory;
