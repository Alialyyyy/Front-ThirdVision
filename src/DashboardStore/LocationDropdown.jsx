import React, { useState } from 'react';
import styles from './Dropdown.module.css'; 

function LocationDropdown({ onSelect }) {
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

    const [selectedLocations, setSelectedLocations] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedLocations((prev) => {
            const newSelected = prev.includes(value) 
                ? prev.filter((location) => location !== value) 
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
                {selectedLocations.length > 0 ? selectedLocations.join(', ') : 'Location'}
            </button>
            {isDropdownOpen && ( 
                <div className={styles.dropdownList}>
                    {locations.map((location) => (
                        <label key={location} className={styles.dropdownLabel}>
                            <input
                                type="checkbox"
                                value={location}
                                checked={selectedLocations.includes(location)}
                                onChange={handleChange}
                            />
                            {location}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LocationDropdown;