// 効果音まわり。外部の音声ファイルは使わず、Web Audio APIでその場で音を合成する
// （追加ファイル不要・読み込み待ちなし。iPad Safariの自動再生制限をさけるため、
//  最初のユーザー操作でunlock()を呼んでAudioContextを起こす）。
const Sound = (() => {
  let ctx = null;
  let muted = false;

  try {
    muted = localStorage.getItem("taichiStudyGame_muted") === "1";
  } catch (e) {
    // localStorageが使えない環境では常にミュート解除のまま
  }

  function ensureContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
    }
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    return ctx;
  }

  function tone({ freq, freqEnd, duration, type = "square", startTime = 0, gain = 0.15 }) {
    const audio = ensureContext();
    if (!audio || muted) return;
    const osc = audio.createOscillator();
    const gainNode = audio.createGain();
    const t0 = audio.currentTime + startTime;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (freqEnd) {
      osc.frequency.linearRampToValueAtTime(freqEnd, t0 + duration);
    }

    gainNode.gain.setValueAtTime(gain, t0);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

    osc.connect(gainNode).connect(audio.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  function noiseBurst({ duration = 0.15, startTime = 0, gain = 0.18 }) {
    const audio = ensureContext();
    if (!audio || muted) return;
    const bufferSize = Math.max(1, Math.floor(audio.sampleRate * duration));
    const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = audio.createBufferSource();
    const gainNode = audio.createGain();
    source.buffer = buffer;
    gainNode.gain.setValueAtTime(gain, audio.currentTime + startTime);
    source.connect(gainNode).connect(audio.destination);
    source.start(audio.currentTime + startTime);
  }

  return {
    // 最初のユーザー操作（タップ/クリック）で一度呼び、AudioContextを有効化する
    unlock() {
      ensureContext();
    },
    isMuted() {
      return muted;
    },
    setMuted(value) {
      muted = value;
      try {
        localStorage.setItem("taichiStudyGame_muted", value ? "1" : "0");
      } catch (e) {
        // 保存できなくても動作に支障はない
      }
    },
    correct() {
      tone({ freq: 520, freqEnd: 780, duration: 0.12, gain: 0.15 });
    },
    wrong() {
      tone({ freq: 260, freqEnd: 140, duration: 0.22, type: "sawtooth", gain: 0.18 });
    },
    special() {
      noiseBurst({ duration: 0.2, gain: 0.22 });
      tone({ freq: 120, duration: 0.35, gain: 0.25, startTime: 0.02 });
      tone({ freq: 700, freqEnd: 1300, duration: 0.25, gain: 0.15, startTime: 0.05 });
    },
    defeat() {
      tone({ freq: 660, duration: 0.12, gain: 0.16 });
      tone({ freq: 880, duration: 0.18, gain: 0.16, startTime: 0.13 });
    },
    clear() {
      [523, 659, 784, 1047].forEach((freq, i) => {
        tone({ freq, duration: 0.22, gain: 0.16, startTime: i * 0.14 });
      });
    },
    gameOver() {
      tone({ freq: 300, freqEnd: 110, duration: 0.6, type: "sawtooth", gain: 0.18 });
    },
  };
})();
