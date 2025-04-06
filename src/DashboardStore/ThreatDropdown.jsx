import React, { useState } from 'react';
import styles from './Dropdown.module.css'; 

function ThreatDropdown({ onSelect }) {
    const threat_level = [
        '1st warning', 
        '2nd warning', 
        '3rd warning', 
    ];

    const [selectedThreatLevel, setSelectedThreatLevel] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedThreatLevel((prev) => {
            const newSelected = prev.includes(value) 
                ? prev.filter((threat_level) => threat_level !== value) 
                : [...prev, value];
            onSelect(newSelected); 
            return newSelected;
        });
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev); 
    };

    return (
        <div className={styles.dropdownContainer}>
            <button className={styles.dropdownButton} onClick={toggleDropdown}>
                {selectedThreatLevel.length > 0 ? selectedThreatLevel.join(', ') : 'Threat Level'}
            </button>
            {isDropdownOpen && ( 
                <div className={styles.dropdownList}>
                    {threat_level.map((threat_level) => (
                        <label key={threat_level} className={styles.dropdownLabel}>
                            <input
                                type="checkbox"
                                value={threat_level}
                                checked={selectedThreatLevel.includes(threat_level)}
                                onChange={handleChange}
                            />
                            {threat_level}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ThreatDropdown;