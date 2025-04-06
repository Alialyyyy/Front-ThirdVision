import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StoreregPanel.module.css';

function AccountRegistrationPanel({ closePanel }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        store_name: '',
        store_location: '',
        store_address: '',
        store_contact: '',
    });

    const [isVisible, setIsVisible] = useState(true);
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();

    const isFormComplete = Object.values(formData).every(value => value.trim() !== "");

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

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormComplete) {
            setStatus('error');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setStatus('success');
                setTimeout(() => {
                    setIsVisible(false);  // Close panel after success
                    navigate('/Dashboard');
                }, 2000);
            } else if (data.message === 'Store with the same username, store name, and store address already exists!') {
                setStatus('duplicate');
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return isVisible ? (
        <div className={styles.floatingpanel}>
            <button className={styles.closeButton} onClick={handleClose}>
                &times;
            </button>
            <>
                <h2 className={styles.h2}>Account Registration</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="store_name"
                        placeholder="Store Name"
                        value={formData.store_name}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="store_location"
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
                    <input
                        type="text"
                        name="store_address"
                        placeholder="Store Address"
                        value={formData.store_address}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="store_contact"
                        placeholder="Store Contact"
                        value={`+63${formData.store_contact}`}
                        onChange={(e) => {
                            let input = e.target.value.replace(/\D/g, ''); 
                            if (input.startsWith('63')) {
                                input = input.slice(2); 
                            }
                            if (input.length > 10) {
                                input = input.slice(0, 10); 
                            }
                            setFormData({ ...formData, store_contact: input });
                        }}
                        maxLength={13} 
                        required
                    />

                    <div>
                        <button className={styles.buttons} type="submit" disabled={!isFormComplete}>
                            Submit
                        </button>
                    </div>
                </form>
            </>

            {status === 'success' && (
                <p className={styles.successMessage}>✅ Store Registered! Redirecting...</p>
            )}
            {status === 'duplicate' && (
                <p className={styles.errorMessage}>❌ Store Account already exists! Try again.</p>
            )}
            {status === 'error' && (
                <p className={styles.errorMessage}>❌ Registration failed. Try again.</p>
            )}
        </div>
    ) : null;
}

export default AccountRegistrationPanel;
