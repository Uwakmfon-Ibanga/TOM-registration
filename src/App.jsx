import Home from "./pages/Home";
import './App.css'
import CamperRegestration from "./pages/CamperRegestration";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<CamperRegestration />} />  
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  )
}

export default App
