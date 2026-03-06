import { Music } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

export function BGMPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);

  const stopAudio = useCallback(() => {
    const now = audioCtxRef.current?.currentTime ?? 0;
    for (const gain of gainNodesRef.current) {
      gain.gain.setTargetAtTime(0, now, 0.3);
    }
    setTimeout(() => {
      for (const osc of oscillatorsRef.current) {
        try {
          osc.stop();
        } catch {
          // already stopped
        }
      }
      oscillatorsRef.current = [];
      gainNodesRef.current = [];
    }, 1200);
    setPlaying(false);
  }, []);

  const startAudio = useCallback(() => {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 1.5);
    masterGain.connect(ctx.destination);

    // Chord: A2 (110Hz), E3 (165Hz), A3 (220Hz), C#4 (277Hz), E4 (329Hz)
    const frequencies = [110, 165, 220, 277, 329];

    for (const freq of frequencies) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Slow LFO vibrato for ambient feel
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.5, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0, ctx.currentTime);
      oscGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 2);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();

      oscillatorsRef.current.push(osc);
      gainNodesRef.current.push(oscGain);
    }

    setPlaying(true);
  }, []);

  const handleToggle = () => {
    if (playing) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  return (
    <div className="fixed bottom-24 left-4 flex flex-col items-center gap-1 z-20">
      <motion.button
        type="button"
        onClick={handleToggle}
        animate={
          playing
            ? {
                scale: [1, 1.08, 1],
                boxShadow: [
                  "0 0 0px rgba(0,200,200,0)",
                  "0 0 16px rgba(0,200,200,0.5)",
                  "0 0 0px rgba(0,200,200,0)",
                ],
              }
            : { scale: 1 }
        }
        transition={
          playing
            ? {
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.8,
                ease: "easeInOut",
              }
            : {}
        }
        className="bg-gradient-to-br from-teal-500 to-blue-600 text-white rounded-full w-11 h-11 shadow-xl flex items-center justify-center hover:from-teal-400 hover:to-blue-500 transition-all"
        title={playing ? "Stop BGM" : "Play Ambient BGM"}
      >
        {playing ? (
          <span className="text-base font-bold">♪</span>
        ) : (
          <Music className="w-5 h-5" />
        )}
      </motion.button>
      <span className="text-[9px] font-body font-semibold text-teal-700 bg-white/80 px-1.5 py-0.5 rounded-full shadow-sm">
        {playing ? "BGM ▶" : "BGM"}
      </span>
    </div>
  );
}
