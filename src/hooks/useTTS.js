import { useState, useEffect, useRef } from "react";

export default function useTTS() {
    const [supported, setSupported] = useState(false);
    const [voices, setVoices] = useState([]);
    const [voiceIndex, setVoiceIndex] = useState(null);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [status, setStatus] = useState("idle");

    const utteranceRef = useRef(null);

    useEffect(() => {
        if (typeof window === "undefined" || !window.speechSynthesis) {
            setSupported(false);
            return;
        }

        const synth = window.speechSynthesis;
        setSupported(true);

        const loadVoices = () => {
            const list = synth.getVoices();
            setVoices(list);

            if (voiceIndex === null && list.length > 0) {
                const englishIndex = list.findIndex(v => /en/i.test(v.lang));
                setVoiceIndex(englishIndex !== -1 ? englishIndex : 0);
            }
        };

        loadVoices();
        synth.addEventListener("voiceschanged", loadVoices);

        return () => {
            synth.removeEventListener("voiceschanged", loadVoices);
        };
    }, [voiceIndex]);

    const speak = (text) => {
        if (!supported || !text) return;

        const synth = window.speechSynthesis;
        synth.cancel();

        const u = new SpeechSynthesisUtterance(text);
        if (voices[voiceIndex]) u.voice = voices[voiceIndex];

        u.rate = rate;
        u.pitch = pitch;

        u.onstart = () => setStatus("playing");
        u.onend = () => setStatus("idle");
        u.onerror = () => setStatus("idle");

        utteranceRef.current = u;
        synth.speak(u);
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setStatus("idle");
    };

    const pause = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            setStatus("paused");
        }
    };

    const resume = () => {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setStatus("playing");
        }
    };

    return {
        supported,
        voices,
        voiceIndex,
        setVoiceIndex,
        rate,
        setRate,
        pitch,
        setPitch,
        status,
        speak,
        stop,
        pause,
        resume,
    };
}
