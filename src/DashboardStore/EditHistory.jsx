import { useState, useEffect } from 'react';
import IR from './EditHistory.module.css';

function EditHistory({ onClose, isOpen }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEditHistory();
    }, []);

    useEffect(() => {
        console.log("Active Panel:", activePanel);
    }, [activePanel]);    

    const closePanel = () => {
        console.log("Closing panel...");
        setActivePanel(null);
    };    

    const fetchEditHistory = async () => {
    setLoading(true);
    try {
        const response = await fetch("http://localhost:5001/api/edit-history");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
        const data = await response.json();
        console.log(data);  // Check if data is received correctly
        setHistory(data);
    } catch (error) {
        console.error("❌ Error fetching edit history:", error);
    } finally {
        setLoading(false);
    }
};
    if (!isOpen) return null;

    return (
        <div className={IR.floatingPanel}>
            <button className={IR.closeButton} onClick={onClose}>✖</button>
            <h2 className={IR.title}>Edit History</h2>

            {loading ? (
                <p className={IR.loading}>Loading...</p>
            ) : (
                <div className={IR.tableContainer}>
                    <table className={IR.table}>
                        <thead>
                            <tr>
                                <th>Detection ID</th>
                                <th>Old Date</th>
                                <th>Old Time</th>
                                <th>Old Threat Level</th>
                                <th>Old Detection Type</th>
                                <th>Date Edited</th>
                                <th>Time Edited</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? (
                                history.map((entry) => (
                                    <tr key={entry.detection_ID}>
                                        <td>{entry.detection_ID}</td>
                                        <td>{entry.date}</td>
                                        <td>{entry.time}</td>
                                        <td>{entry.threat_level}</td>
                                        <td>{entry.detection_type}</td>
                                        <td>{entry.date_edited}</td>
                                        <td>{entry.time_edited}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", fontStyle: "italic" }}>
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default EditHistory;
