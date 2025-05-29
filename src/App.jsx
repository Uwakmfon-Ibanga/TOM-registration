import Home from "./pages/Home";
import './App.css'
import { Routes, Route } from "react-router-dom";
import CamperRegestration from "./pages/CamperRegestration";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<CamperRegestration />} />
        {/* <Route path="/registration" element={<CamperRegestration />} />   */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  )
}

export default App
