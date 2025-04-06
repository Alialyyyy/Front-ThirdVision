import { useState, useEffect } from "react";
import IR from "./RegisterStoreButton.module.css";

function PoliceAccs({ closePanel }) {
    const [policeAccounts, setPoliceAccounts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPoliceAccounts();
    }, []);

    const fetchPoliceAccounts = () => {
        setLoading(true);
        fetch("http://localhost:5001/api/police-accounts")
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then((data) => setPoliceAccounts(data))
            .catch((error) => console.error("Error fetching police accounts:", error))
            .finally(() => setLoading(false));
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/api/delete-police/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error(`Failed to delete account. Status: ${response.status}`);
            setPoliceAccounts((prev) => prev.filter(entry => entry.stoc_ID !== id));
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    return (
        <div className={IR.floatingPanel}>
            {/* ✅ Close Button */}
            <button className={IR.closeButton} onClick={closePanel}>✖</button>
            <h2 className={IR.title}>Authorized Admin</h2>

            {loading ? (
                <p className={IR.loading}>Loading...</p>
            ) : (
                <div className={IR.tableContainer}>
                    <table className={IR.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Contact</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {policeAccounts.length > 0 ? (
                                policeAccounts.map((entry) => (
                                    <tr key={entry.stoc_ID}>
                                        <td>{entry.stoc_ID}</td>
                                        <td>{entry.username}</td>
                                        <td>{entry.stoc_contact}</td>
                                        <td>{entry.stoc_email}</td>
                                        <td>
                                            <button className={IR.deleteButton} onClick={() => handleDelete(entry.stoc_ID)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No registered accounts found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PoliceAccs;
