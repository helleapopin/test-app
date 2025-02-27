import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Section from "./components/Section";
import Section1 from "./components/Section1";
import Section2 from "./components/Section2";
import Section3 from "./components/Section3";
import Section4 from "./components/Section4";
import Section5 from "./components/Section5";
import Section6 from "./components/Section6";
import Section7 from "./components/Section7";
import Section8 from "./components/Section8";
import Section9 from "./components/Section9";
import Section10 from "./components/Section10";
import MySubmissions from "./components/MySubmissions";
import Review from "./components/Review";
import Report from "./components/Report";
import Login from "./components/Login"; // Import Login component
import Register from "./components/Register"; // Import Register component
import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(null);


  // Check if the user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // useEffect(() => {
  //   const userData = localStorage.getItem("user");
  //   console.log("Retrieved user from localStorage:", userData);


  //   if (userData) {
  //     try {
  //       const parsedUser = JSON.parse(userData);
  //       setCurrentUser(parsedUser);
  //     } catch (error) {
  //       console.error("Error parsing user JSON:", error);
  //       setCurrentUser(null);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user:", error);
        localStorage.removeItem("user"); // ✅ Remove corrupted data
      }
    }
  }, []);


  // Function to handle login
  const handleLogin = (token, user) => {
    console.log("Storing user:", user); // Debugging log

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user)); // Store user details
    setIsAuthenticated(true);
    setCurrentUser(user);
  };


  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Remove user data
    setIsAuthenticated(false);
    setCurrentUser(null);
  };


  // Protected Route Component
  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div>
        <Navbar
          isAuthenticated={isAuthenticated}
          username={currentUser?.username}
          email={currentUser?.email}
          onLogout={handleLogout}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route path="/review" element={<ProtectedRoute element={<Review />} />} />
          <Route path="/report/:id" element={<ProtectedRoute element={<Report />} />} />
          <Route path="/my-submissions" element={<MySubmissions />} />


          {/* section path */}
          <Route path="/create-report" element={<Layout currentStep={1} component={<Section currentStep={1} />} />} />
          <Route path="/section2" element={<Layout currentStep={2} component={<Section currentStep={2} />} />} />
          <Route path="/section3" element={<Layout currentStep={3} component={<Section currentStep={3} />} />} />
          <Route path="/section4" element={<Layout currentStep={4} component={<Section currentStep={4} />} />} />
          <Route path="/section5" element={<Layout currentStep={5} component={<Section currentStep={5} />} />} />
          <Route path="/section6" element={<Layout currentStep={6} component={<Section currentStep={6} />} />} />
          <Route path="/section7" element={<Layout currentStep={7} component={<Section currentStep={7} />} />} />
          <Route path="/section8" element={<Layout currentStep={8} component={<Section currentStep={8} />} />} />
          <Route path="/section9" element={<Layout currentStep={9} component={<Section currentStep={9} />} />} />
          <Route path="/section10" element={<Layout currentStep={10} component={<Section currentStep={10} />} />} />



          {/* Redirect all other routes to the home page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

// Layout Component (unchanged)
const Layout = ({ currentStep, component }) => {
  const steps = [
    { title: "Project Location", path: "/create-report" },
    { title: "Fish Passage Design", path: "/section2" },
    { title: "DFO Approval", path: "/section3" },
    { title: "AHPP", path: "/section4" },
    { title: "Endangered Species", path: "/section5" },
    { title: "Sediment Control", path: "/section6" },
    { title: "Cofferdams", path: "/section7" },
    { title: "Forest Permit", path: "/section8" },
    { title: "Impacted Sites", path: "/section9" },
    { title: "Additional Permits", path: "/section10" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar steps={steps} currentStep={currentStep} />
      <div style={{ flex: 1, padding: "20px" }}>{component}</div>
    </div>
  );
};

export default App;


