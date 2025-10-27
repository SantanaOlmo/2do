export default function Step({ stepId, isActive, isCurrent, toggleStep }) {
  return (
    <button
      className={`step ${isActive ? "active" : ""} ${isCurrent ? "current" : ""}`}
      onClick={toggleStep}
    ></button>
  );
}
