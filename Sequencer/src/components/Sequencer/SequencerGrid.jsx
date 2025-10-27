import Step from "./Step";
const MAX_STEPS_PER_ROW = 4;

function getStepRows(stepsArray) {
  const rows = [];
  let i = 0;
  while (i < stepsArray.length) {
    rows.push(stepsArray.slice(i, i + MAX_STEPS_PER_ROW));
    i += MAX_STEPS_PER_ROW;
  }
  return rows.slice(0, 4); // máximo 4 filas
}

export default function SequencerGrid({ stepsArray, toggleStep, activeStep }) {
const stepRows = stepsArray ? getStepRows(stepsArray) : [];

  return (
    <div className="sequencerGrid" id="sequencerGrid">
      {stepRows.map((row, rowIndex) => (
        <div className="bar" key={rowIndex}>
          {row.map((step, stepIndex) => {
            const globalIndex = rowIndex * MAX_STEPS_PER_ROW + stepIndex;
            return (
              <Step
                key={globalIndex}
                stepId={globalIndex + 1}
                isActive={step}
                isCurrent={globalIndex === activeStep}
                toggleStep={() => toggleStep(globalIndex)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
