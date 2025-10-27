// src/pages/InstrumentEditor.jsx
import { useNavigate, useLocation } from "react-router-dom";
import Sequencer from "../components/Sequencer/Sequencer";
import Input from "../components/UI/Input";
import SelectSound from "../components/UI/SelectSound";
import { sounds } from "../utils/loadSounds";

export default function InstrumentEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const instrument = location.state?.instrument || "Unknown";

  const handleBack = () => navigate(-1);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={handleBack}>Back</button>
        <h3>{instrument}</h3>
        <Input typeData="bpm" handleChange={() => {}} />
        <Input typeData="steps" handleChange={() => {}} />
        <SelectSound sounds={sounds} selected={sounds[0]?.name} onChange={() => {}} />
      </div>

      <Sequencer />
    </div>
  );
}
