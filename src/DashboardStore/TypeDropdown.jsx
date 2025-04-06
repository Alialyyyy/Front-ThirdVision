
import React, { useState } from 'react';
import styles from './Dropdown.module.css'; 

function TypeDropdown({ onSelect }) {
    const detection_type = [
        'weapon_weapon', 
        'victim_pose', 
        'victim-pose_aggressor-pose',
        'combined_weapon-weapon_victim-none_aggressor-pose',
        'combined_weapon-weapon_victim-pose_aggressor-none', 
        'combined_weapon-weapon_victim-pose_aggressor-pose',
    ];

    const [selectedType, setSelectedType] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedType((prev) => {
            const newSelected = prev.includes(value) 
                ? prev.filter((detection_type) => detection_type !== value) 
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
                {selectedType.length > 0 ? selectedType.join(', ') : 'Detection Type'}
            </button>
            {isDropdownOpen && ( 
                <div className={styles.dropdownList}>
                    {detection_type.map((detection_type) => (
                        <label key={detection_type} className={styles.dropdownLabel}>
                            <input
                                type="checkbox"
                                value={detection_type}
                                checked={selectedType.includes(detection_type)}
                                onChange={handleChange}
                            />
                            {detection_type}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TypeDropdown;