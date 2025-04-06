import { useState } from 'react';
import styles from './StoreLogin.module.css';
import { useNavigate } from 'react-router-dom';

function StoreAccountLogin({onClose}) {
    const [showPasscode, setShowPasscode] = useState(false);
    const [storeID, setStoreID] = useState(''); 
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const togglePasscodeVisibility = () => {
        setShowPasscode(!showPasscode);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:5001/api/login2', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: storeID, password }) 
            });
    
            const data = await response.json();
    
            if (response.ok) {
                localStorage.setItem('store_ID', data.store_ID); 
                navigate('/DashboardStore', { state: { store_ID: data.store_ID } });
            } else {
                setErrorMessage(data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Error connecting to the server:', error); 
            setErrorMessage('Error connecting to the server');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.container}>
                <button className={styles.closeButton} onClick={onClose}>✖</button>
                <h1 className={styles.title}>Store Account Login</h1>
                <form className={styles.form} onSubmit={handleLogin}>
                    <label className={styles.label}>
                        Enter ThirdVision ID:
                        <input 
                            type="text" 
                            className={styles.input} 
                            placeholder="ThirdVision ID" 
                            value={storeID}
                            onChange={(e) => setStoreID(e.target.value)}
                            required
                        />
                    </label>
                    <label className={styles.label}>
                        Enter password:
                        <div className={styles.passcodeWrapper}>
                            <input
                                type={showPasscode ? 'text' : 'password'}
                                className={styles.input}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className={styles.toggleButton}
                                onClick={togglePasscodeVisibility}
                            >
                                {showPasscode ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </label>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    <button type="submit" className={styles.submitButton}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default StoreAccountLogin;