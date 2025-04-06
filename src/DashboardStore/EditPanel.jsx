import { useState } from "react";
import styles from "./EditIncidentPanel.module.css";

function EditIncidentPanel({ incident, onClose, onSave }) {
    const [editedData, setEditedData] = useState({
        date: incident.date,
        time: incident.time,
        threat_level: incident.threat_level,
        detection_type: incident.detection_type,
    });

    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);  

    const handleChange = (e) => {
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log(`🚀 Sending edit request for detection_ID=${incident.detection_ID} with data:`, editedData);
    
        try {
            const response = await fetch(`http://localhost:5001/api/edit-incident/${incident.detection_ID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to edit incident");
            }
    
            const data = await response.json();
            console.log("✅ Edit Successful:", data);
    
            onSave({ ...incident, ...editedData });
    
            setSuccessMessage("Saved!");
            setTimeout(() => {
                setSuccessMessage(null);
                onClose();
            }, 1500);
        } catch (error) {
            console.error("❌ Error updating incident:", error);
        }
    };    

    return (
        <div className={styles.floatingPanel}>
            <button className={styles.closeButton} onClick={onClose}>✖</button>
            <h2 className={styles.title}>Edit Incident</h2>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <label>Date:</label>
                <input type="date" name="date" value={editedData.date} onChange={handleChange}/>

                <label>Time:</label>
                <input type="time" name="time" value={editedData.time} onChange={handleChange}/>

                <label>Threat Level:</label>
                <input type="text" name="threat_level" value={editedData.threat_level} onChange={handleChange}/>

                <label>Detection Type:</label>
                <input type="text" name="detection_type" value={editedData.detection_type} onChange={handleChange}/>

                <button type="submit" className={styles.saveButton}>Save</button>
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            </form>
        </div>
    );
}

export default EditIncidentPanel;