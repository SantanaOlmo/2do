// src/pages/SectionEditor.jsx
import { useNavigate } from "react-router-dom";

const instruments = [
  "Kick", "Snare", "HiHat", "Clap",
  "Piano", "Mallets", "Strings", "Bass",
  "Pad", "Lead", "FX1", "FX2",
  "Vox", "Perc1", "Perc2", "Misc"
];

export default function SectionEditor() {
  const navigate = useNavigate();

  const handleInstrumentClick = (instrument) => {
    navigate("/instrument-editor", { state: { instrument } });
  };

  return (
    <div>
      <h2>Select Instrument</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
        {instruments.map((inst) => (
          <button
            key={inst}
            onClick={() => handleInstrumentClick(inst)}
          >
            {inst}
          </button>
        ))}
      </div>
    </div>
  );
}

