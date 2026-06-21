// Retro Cyberpunk Audio Synthesizer (Web Audio API)
// No static audio assets needed - sounds are synthesized programmatically on the fly.

let audioCtx = null;

const initContext = () => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

export const isAudioMuted = () => {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("audio-muted") === "true";
};

export const setAudioMuted = (muted) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("audio-muted", muted ? "true" : "false");
};

const playSynthTone = ({
  frequencyStart,
  frequencyEnd,
  duration,
  type = "sine",
  gainStart = 0.1,
  gainEnd = 0.0001,
  delay = 0,
}) => {
  if (isAudioMuted()) return;
  const ctx = initContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequencyStart, ctx.currentTime + delay);
  if (frequencyEnd && frequencyEnd !== frequencyStart) {
    osc.frequency.exponentialRampToValueAtTime(frequencyEnd, ctx.currentTime + delay + duration);
  }

  gainNode.gain.setValueAtTime(gainStart, ctx.currentTime + delay);
  gainNode.gain.exponentialRampToValueAtTime(gainEnd, ctx.currentTime + delay + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
};

export const playClick = () => {
  playSynthTone({
    frequencyStart: 1800,
    frequencyEnd: 900,
    duration: 0.03,
    type: "triangle",
    gainStart: 0.04,
  });
};

export const playSelect = () => {
  playSynthTone({
    frequencyStart: 1200,
    frequencyEnd: 1200,
    duration: 0.08,
    type: "sine",
    gainStart: 0.08,
  });
};

export const playSuccess = () => {
  // Ascending C5-E5-G5 rapid arpeggio
  playSynthTone({ frequencyStart: 523.25, frequencyEnd: 523.25, duration: 0.1, type: "sine", gainStart: 0.1, delay: 0 });
  playSynthTone({ frequencyStart: 659.25, frequencyEnd: 659.25, duration: 0.1, type: "sine", gainStart: 0.1, delay: 0.08 });
  playSynthTone({ frequencyStart: 783.99, frequencyEnd: 1100.0, duration: 0.2, type: "sine", gainStart: 0.1, delay: 0.16 });
};

export const playWarning = () => {
  // Low pitched double buzzer
  playSynthTone({ frequencyStart: 130, frequencyEnd: 100, duration: 0.12, type: "sawtooth", gainStart: 0.08, delay: 0 });
  playSynthTone({ frequencyStart: 130, frequencyEnd: 100, duration: 0.12, type: "sawtooth", gainStart: 0.08, delay: 0.18 });
};

export const playDelete = () => {
  // Glitchy laser sweep downwards
  playSynthTone({
    frequencyStart: 850,
    frequencyEnd: 60,
    duration: 0.28,
    type: "sawtooth",
    gainStart: 0.12,
  });
};

export const playStartup = () => {
  // BIOS Boot sequence sound
  const baseDelay = 0.05;
  playSynthTone({ frequencyStart: 440, frequencyEnd: 440, duration: 0.08, type: "sine", gainStart: 0.08, delay: baseDelay });
  playSynthTone({ frequencyStart: 554.37, frequencyEnd: 554.37, duration: 0.08, type: "sine", gainStart: 0.08, delay: baseDelay + 0.08 });
  playSynthTone({ frequencyStart: 659.25, frequencyEnd: 659.25, duration: 0.08, type: "sine", gainStart: 0.08, delay: baseDelay + 0.16 });
  playSynthTone({ frequencyStart: 880, frequencyEnd: 1200, duration: 0.25, type: "sine", gainStart: 0.1, delay: baseDelay + 0.24 });
};
