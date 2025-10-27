export default function Input({ typeData, handleChange }) {
  return (
    <input
      type="number"
      placeholder={typeData}
      id={typeData + "Input"}
      onChange={(e) => handleChange(typeData, e.target.value)}
      max={typeData === "steps" ? 16 : 200}
      defaultValue={typeData === "steps" ? 16 : 120}
    />
  );
}
