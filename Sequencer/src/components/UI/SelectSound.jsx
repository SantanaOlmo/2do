// src/components/UI/SelectSound.jsx

export default function SelectSound({ sounds, selected, onChange }) {
  return (
    <select value={selected} onChange={(e) => onChange(e.target.value)}>
      {sounds.map((sound) => (
        <option key={sound.path} value={sound.name}>
          {sound.name}
        </option>
      ))}
    </select>
  );
}
