import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [submissions, setSubmissions] = useState([]); // Holds database data
  const apiUrl = 'https://fictional-orbit-695pwwpvgqj7c5qrr-8080.app.github.dev/api/submissions';

  useEffect(() => {
    // Fetch data from the backend when component loads
    axios.get(apiUrl)
      .then((response) => {
        setSubmissions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching submissions:", error);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStartNewProcess = () => {
    navigate("/create-report");
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Project Processes</h2>
        <button className="new-process-button" onClick={handleStartNewProcess}>
          Start New Process
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          id="searchbox"
          type="text"
          placeholder="Search by subject..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button className="search-button">Search</button>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Priority</th>
              <th>Road Name</th>
              <th>At Km</th>
              <th>Due Date</th>
              <th>PIDs</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.id}</td>
                  <td>{submission.priority}</td>
                  <td>{submission.roadName}</td>
                  <td>{submission.atKm}</td>
                  <td>{submission.dueDate}</td>
                  <td>{submission.pids}</td>
                  <td>{new Date(submission.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
