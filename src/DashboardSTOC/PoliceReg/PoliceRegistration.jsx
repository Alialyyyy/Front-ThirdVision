import { useState } from "react";
import styles from "./PoliceRegistration.module.css";

function PoliceRegPanel({ closePanel }) {  
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        stoc_contact: "",
        stoc_email: "",
        stoc_location: "",
    });

    const locations = [
        'Putatan',
        'Tunasan',
        'Ayala-Alabang',
        'Alabang',
        'Poblacion',
        'Cupang',
        'Sucat',
        'Bayanan',
        'Buli',
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5001/register-police", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                alert("✅ Police account registered successfully!");
                closePanel();
                setFormData({ username: "", password: "", stoc_contact: "", stoc_email: "", stoc_location: "" });
            } else {
                alert(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error:", error);
            alert("❌ Failed to connect to server.");
        }
    };

    return (
        <div className={styles.floatingpanel}>
            {/* ✅ Close Button */}
            <button className={styles.closeButton} onClick={closePanel}>
                &times;
            </button>

            <h2 className={styles.h2}>Police Account Registration</h2>

            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input
                        type="text"
                        name="stoc_contact"
                        placeholder="Contact Number"
                        value={`+63${formData.stoc_contact}`}
                        onChange={(e) => {
                            let input = e.target.value.replace(/\D/g, ''); 
                            if (input.startsWith('63')) {
                                input = input.slice(2); 
                            }
                            if (input.length > 10) {
                                input = input.slice(0, 10); 
                            }
                            setFormData({ ...formData, stoc_contact: input });
                        }}
                        maxLength={13} 
                        required
                    />
                <input type="email" name="stoc_email" placeholder="Email Address" value={formData.stoc_email} onChange={handleChange} required />
                <select
                        name="stoc_location"
                        value={formData.store_location}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Select Barangay
                        </option>
                        {locations.map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                <button className={styles.submitbtn} type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default PoliceRegPanel;
