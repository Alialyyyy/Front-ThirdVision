import { useState } from 'react';
import styles from './STOCLogin.module.css';
import { useNavigate } from 'react-router-dom';

function STOCLogin({onClose}) {
    const [showPassword, setShowPassword] = useState(false);
    
    const [adminID, setAdminID] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: adminID, password })
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/Dashboard'); 
            } else {
                setErrorMessage(data.message || 'Invalid credentials');
            }
        } catch (error) {
            setErrorMessage('Error connecting to the server');
        }
    };

    return (
        <div className={styles.container}>
            <button className={styles.closeButton} onClick={onClose}>✖</button>
            <h1 className={styles.title}>Police Login</h1>
            <form className={styles.form} onSubmit={handleLogin}>
                <label className={styles.label}>
                    Enter username:
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Username"
                        value={adminID}
                        onChange={(e) => setAdminID(e.target.value)}
                        required
                    />
                </label>
                <label className={styles.label}>
                    Enter password:
                    <div className={styles.passwordWrapper}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className={styles.input}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={styles.toggleButton}
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </label>
                {errorMessage && <p className={styles.error}>{errorMessage}</p>}    
                <button type="submit" className={styles.submitButton}>
                    Login
                </button>
            </form>
        </div>
    );
}

export default STOCLogin;
