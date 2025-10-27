// src/hooks/useAudioEngine.js
import { useRef } from "react";

export default function useAudioEngine() {
  const audioCtxRef = useRef(null);
  const buffersRef = useRef({});

  // Inicializa AudioContext y carga todos los sonidos
  const loadSounds = async (sounds) => {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();

    const audioCtx = audioCtxRef.current;

    for (const s of sounds) {
      if (buffersRef.current[s.name]) continue; // ya cargado
      const response = await fetch(s.path);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      buffersRef.current[s.name] = audioBuffer;
    }
  };

  // Reproduce un sonido por nombre
  const playSound = (name) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    const buffer = buffersRef.current[name];
    if (!buffer) return;

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
  };

  return { loadSounds, playSound };
}

