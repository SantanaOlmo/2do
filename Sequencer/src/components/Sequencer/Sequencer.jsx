import { useState, useEffect } from "react";
import SequencerGrid from "./SequencerGrid";
import Input from "../UI/Input";
import SelectSound from "../UI/SelectSound";
import { sounds } from "../../utils/loadSounds";
import useAudioEngine from "../../hooks/useAudioEngine";
import "../../styles/sequencer.css";
import "../../styles/controls.css";

export default function Sequencer() {
  const [bpm, setBpm] = useState(120);
  const [steps, setSteps] = useState(16);
  const [sequencer, setSequencer] = useState(new Array(8).fill(false));
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSound, setSelectedSound] = useState(sounds[0]?.name || "");

  const { loadSounds, playSound } = useAudioEngine();
  const [soundsLoaded, setSoundsLoaded] = useState(false);

  // Cargar sonidos tras la primera interacción del usuario
  const handleFirstInteraction = async () => {
    await loadSounds(sounds);
    setSoundsLoaded(true);
    document.removeEventListener("click", handleFirstInteraction);
  };

  useEffect(() => {
    document.addEventListener("click", handleFirstInteraction);
    return () => document.removeEventListener("click", handleFirstInteraction);
  }, []);

  // Avanzar step y reproducir sonido si está activo
  useEffect(() => {
    if (!soundsLoaded) return;

    const intervalTime = 60000 / bpm;
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (sequencer[prev]) playSound(selectedSound);
        return (prev + 1) % sequencer.length;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [bpm, sequencer, selectedSound, soundsLoaded]);

  // Ajustar secuenciador al cambiar número de steps
  useEffect(() => {
    setSequencer(new Array(steps).fill(false));
    setActiveStep(0);
  }, [steps]);

  const toggleStep = (index) => {
    const newSequencer = [...sequencer];
    newSequencer[index] = !newSequencer[index];
    setSequencer(newSequencer);
  };

  const handleChange = (typeData, data) => {
    if (typeData === "bpm") setBpm(Number(data));
    else setSteps(Number(data));
  };

  return (
    <div id="sequencerCase">
      <SequencerGrid
        stepsArray={sequencer}
        toggleStep={toggleStep}
        activeStep={activeStep}
      />
    </div>
  );
}
