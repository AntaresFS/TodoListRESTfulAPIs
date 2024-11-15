import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./component/home"; // El componente de la lista de tareas
import LoginPage from "./component/login"; // El componente que acabamos de crear

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/todos/:username" element={<Home />} /> 
      </Routes>
    </Router>
  );
}

export default App;
