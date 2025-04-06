import { useEffect, useState } from "react";
import styles from "./LowThreat.module.css";

function LowThreat() {
    const [lowThreats, setLowThreats] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5001/cover-reports")  
            .then((response) => response.json())
            .then((data) => {
                setLowThreats(data); 
            })
            .catch((error) => console.error("Error fetching low-threat data:", error));
    }, []);

    return (
        <div className={styles.lowThreatContainer}>
            <h1>Face Cover Detection</h1>
            {lowThreats.length > 0 ? (
                lowThreats.map((threat, index) => (
                    <div key={index} className={styles.threatBox}>
                        <h2>⚠️ FACE COVER DETECTED!</h2>
                        <p>{threat.store_name}</p>
                        <p>{threat.store_location}</p>
                        <p>{threat.store_address}</p>
                        <p>{threat.date}</p>
                        <p>{threat.time}</p>
                        <p>{threat.store_contact}</p>
                    </div>
                ))
            ) : (
                <p className={styles.noThreat}>✅ No Face Cover Detected</p>
            )}
        </div>
    );
}

export default LowThreat;
