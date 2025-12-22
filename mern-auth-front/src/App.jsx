import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import VerifyEmail from "./VerifyEmail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
