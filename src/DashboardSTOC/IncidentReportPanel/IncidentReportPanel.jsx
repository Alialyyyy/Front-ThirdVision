import { useState, useEffect, useRef } from 'react';
import { FaEye } from 'react-icons/fa';
import { io } from "socket.io-client";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import IR from './IncidentReport.module.css';
import LocationDropdown from './LocationDropdown.jsx';
import ThreatDropdown from './ThreatDropdown.jsx';
import TypeDropdown from './TypeDropdown.jsx';

function IncidentReportPanel({ closePanel }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedThreatLevel, setSelectedThreatLevel] = useState([]);
    const [selectedType, setSelectedType] = useState([]);
    const tableRef = useRef(null);


    useEffect(() => {
        fetchIncidentHistory();
    }, [search, selectedLocations, selectedThreatLevel, selectedType]);

    useEffect(() => {
        const socket = io("http://localhost:5001");
        socket.on("new-detection", (data) => {
            if (Notification.permission === "granted") {
                new Notification("\ud83d\udea8 New Detection Alert", {
                    body: `A new detection has been recorded at ${data.store_location} (Threat Level: ${data.threat_level})`,
                });
            }
            fetchIncidentHistory();
        });

        return () => socket.disconnect();
    }, []);

   useEffect(() => {
           const intervalId = setInterval(() => {
               setTime(new Date());
           }, 1000);
   
           return () => clearInterval(intervalId);
       }, []);
   
       const fetchIncidentHistory = async () => {
        setLoading(true);
    
        const queryParams = new URLSearchParams();
    
        if (search) {
            queryParams.append("search", search);
        }
        if (selectedLocations.length > 0) {
            queryParams.append("searchLocations", selectedLocations.join(","));
        }
        if (selectedThreatLevel.length > 0) {
            queryParams.append("searchThreatLevels", selectedThreatLevel.join(","));
        }
        if (selectedType.length > 0) {
            queryParams.append("searchType", selectedType.join(","));
        }
    
        const queryString = queryParams.toString();
        const url = `http://localhost:5001/api/detection-history${queryString ? `?${queryString}` : ""}`;
    
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
            const data = await response.json();
            setHistory(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (detection_ID) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
    
        try {
            const response = await fetch(`http://localhost:5001/api/delete-detection/${detection_ID}`, {
                method: "DELETE",
            });
    
            if (!response.ok) throw new Error("Failed to delete record");
    
            fetchIncidentHistory();
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };

    const handleButtonClick = (event, image) => {
        event.preventDefault();
        let newUrl = image;

        if (image.includes('drive.google.com')) {
            newUrl = image.replace('drive.google.com', 'yourdomain.com');
        }

        window.open(newUrl, '_blank', 'noopener,noreferrer');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM'; 
        const formattedHour = hour % 12 || 12; 
        return `${formattedHour}:${minute < 10 ? '0' + minute : minute} ${ampm}`;
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const filteredHistory = history.filter((entry) => {
        const sharedIdStr = String(entry.shared_detection_id);
        const storeIdStr = String(entry.store_ID);
        const storenameStr = String(entry.store_name).toLowerCase();
        const locationStr = String(entry.store_location).toLowerCase();
        const contactStr = String(entry.store_contact);
        const dateStr = entry.date; 
        const timeStr = entry.time; 
        const threatLevelStr = String(entry.threat_level).toLowerCase(); 
        const typeStr = String(entry.detection_type).toLowerCase();
        
        const matchesSearch = search.toLowerCase() === '' || (
            sharedIdStr.includes(search) ||
            storeIdStr.includes(search) ||
            storenameStr.includes(search) ||
            locationStr.includes(search) ||
            contactStr.includes(search) ||
            sharedIdStr.includes(search) ||
            formatDate(dateStr).includes(search) ||
            formatTime(timeStr).includes(search) ||
            threatLevelStr.includes(search) ||
            typeStr.includes(search)
        );

        const matchesThreatLevel = selectedThreatLevel.length === 0 || selectedThreatLevel.includes(entry.threat_level);
        const matchesType = selectedType.length === 0 || selectedType.includes(entry.detection_type);

        return matchesSearch && matchesThreatLevel && matchesType;
    });

    const exportToExcel = () => {
        if (!tableRef.current) {
            alert("No data to export.");
            return;
        }

        const ws = XLSX.utils.table_to_sheet(tableRef.current);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Incident History");

        Object.keys(ws).forEach((key) => {
            if (ws[key].v && ws[key].v.toString().match(/^\d+$/)) {
                ws[key].z = "0";
            }
        });

        ws['!cols'] = [
            { wch: 10 }, // ID
            { wch: 12 }, // Store ID
            { wch: 20 }, // Store Name
            { wch: 20 }, // Location
            { wch: 25 }, // Address
            { wch: 15 }, // Contact
            { wch: 12 }, // Date
            { wch: 12 }, // Time
            { wch: 25 }, // Threat Level
            { wch: 15 }  // Type
        ];

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const currentDate = new Date().toISOString().split("T")[0];
        saveAs(fileData, `Incident_Report_${currentDate}.xlsx`);
    };

    return (
        <div className={IR.floatingPanel}>
            <button className={IR.closeButton} onClick={closePanel}>✖</button>
            <h2 className={IR.title}>Incident History</h2>
            <div className={IR.searchContainer}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={IR.searchInput}
                />
                <button className={IR.exportButton} onClick={exportToExcel}>📤 Export to Excel</button>
            </div>
            <div className={IR.dropdownContainer}>
                <div className={IR.dropdownWrapper}><LocationDropdown onSelect={setSelectedLocations} /></div>
                <div className={IR.dropdownWrapper}><ThreatDropdown onSelect={setSelectedThreatLevel} /></div>
                <div className={IR.dropdownWrapper}><TypeDropdown onSelect={setSelectedType} /></div>
            </div>
            {loading ? (
                <p className={IR.loading}>Loading...</p>
            ) : (
                <div className={IR.tableContainer}>
                    <table className={IR.table} ref={tableRef}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Store ID</th>
                                <th>Store Name</th>
                                <th>Location</th>
                                <th>Address</th>
                                <th>Contact</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Threat Level</th>
                                <th>Type</th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? (
                                history.slice().reverse().map((entry) => (
                                    <tr key={entry.detection_ID}>
                                        <td>{entry.shared_detection_id}</td>
                                        <td>{entry.store_ID}</td>
                                        <td>{entry.store_name}</td>
                                        <td>{entry.store_location}</td>
                                        <td>{entry.store_address}</td>
                                        <td>{parseInt(entry.store_contact, 10)}</td> 
                                        <td>{formatDate(entry.date)}</td>
                                        <td>{formatTime(entry.time)}</td>
                                        <td>{entry.threat_level}</td>
                                        <td>{entry.detection_type}</td>
                                        <td>
                                            <button className={IR.eyeButton} onClick={(event) => handleButtonClick(event, entry.image)}>
                                                <FaEye size={18} />
                                            </button>
                                        </td>
                                        <td>
                                            <button className={IR.deleteButton} onClick={() => handleDelete(entry.detection_ID)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="12">No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default IncidentReportPanel;
