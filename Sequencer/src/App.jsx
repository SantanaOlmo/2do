// src/App.jsx
import { Routes, Route } from "react-router-dom";
import SectionEditor from "./pages/SectionEditor";
import InstrumentEditor from "./pages/InstrumentEditor";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SectionEditor />} />
      <Route path="/instrument-editor" element={<InstrumentEditor />} />
    </Routes>
  );
}


