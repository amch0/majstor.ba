import React from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./Navbar";
import Home from "./homePage/homePage";
import AboutUs from "./aboutUs/aboutUs";

function App() {
  return (
    <div>
      <Navbar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutUs" element={<AboutUs />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
