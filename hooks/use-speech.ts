"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeech(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (SR) {
      setSupported(true);
      const recognition = new SR();
      recognition.lang = "pt-BR";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };
      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, [onResult]);

  const toggle = useCallback(() => {
    const r = recognitionRef.current;
    if (!r) return;
    if (listening) {
      r.stop();
    } else {
      r.start();
      setListening(true);
    }
  }, [listening]);

  return { listening, supported, toggle };
}
