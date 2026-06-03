import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, X, Plus, Minus } from 'lucide-react';

export default function RestTimer({ duration, onClose }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [total, setTotal] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const triggerAlarm = useCallback(() => {
    if (audioPlayed) return;
    setAudioPlayed(true);
    
    // Play a dual tone beep using Web Audio API
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Play 3 beeps
      const playTone = (time, freq, toneDuration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + toneDuration - 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + toneDuration);
      };
      
      playTone(ctx.currentTime, 880, 0.25);
      playTone(ctx.currentTime + 0.3, 880, 0.25);
      playTone(ctx.currentTime + 0.6, 1200, 0.4);
    } catch (e) {
      console.warn("Failed to play rest audio", e);
    }
    
    // Simple visual flash of the timer
    const el = document.querySelector('.rest-timer-card');
    if (el) {
      el.style.border = '2px solid var(--success)';
      el.style.boxShadow = '0 0 25px var(--success)';
      setTimeout(() => {
        el.style.border = '1px solid var(--accent-primary)';
        el.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(59, 130, 246, 0.2)';
      }, 3000);
    }
  }, [audioPlayed]);

  // Main countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0 || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerAlarm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused, triggerAlarm]);

  // Auto-close when timer finishes and alarm has played
  useEffect(() => {
    if (timeLeft === 0 && audioPlayed) {
      const closeTimer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(closeTimer);
    }
  }, [timeLeft, audioPlayed, onClose]);

  if (duration === 0 || (timeLeft === 0 && !audioPlayed)) {
    return null;
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const strokeDashoffset = total > 0 ? (2 * Math.PI * 26) * (1 - timeLeft / total) : 0;
  const strokeDasharray = 2 * Math.PI * 26;

  const handleAdjust = (amount) => {
    setTimeLeft((prev) => {
      const next = prev + amount;
      if (next <= 0) return 0;
      setTotal((t) => t + amount > 0 ? t + amount : 1);
      return next;
    });
  };

  return (
    <div className="rest-timer-card">
      <div className="timer-circle">
        <svg>
          <circle className="bg-ring" cx="30" cy="30" r="26" />
          <circle 
            className="progress-ring" 
            cx="30" 
            cy="30" 
            r="26" 
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <span className="timer-time-display">
          {timeLeft > 0 ? formatTime(timeLeft) : "¡Listo!"}
        </span>
      </div>

      <div className="flex-col gap-1" style={{ minWidth: '100px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: timeLeft > 0 ? 'var(--text-muted)' : 'var(--success)' }}>
          {timeLeft > 0 ? "Tiempo de Descanso" : "¡A entrenar!"}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={() => handleAdjust(-15)} 
            className="btn-icon" 
            style={{ width: '1.75rem', height: '1.75rem', padding: 0 }}
            title="-15s"
            disabled={timeLeft <= 0}
          >
            <Minus size={12} />
          </button>
          <button 
            onClick={() => handleAdjust(15)} 
            className="btn-icon" 
            style={{ width: '1.75rem', height: '1.75rem', padding: 0 }}
            title="+15s"
            disabled={timeLeft <= 0}
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {timeLeft > 0 && (
          <button 
            onClick={() => setIsPaused(!isPaused)} 
            className="btn-icon" 
            style={{ width: '2.25rem', height: '2.25rem', padding: 0, background: 'rgba(255,255,255,0.05)' }}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
          </button>
        )}
        <button 
          onClick={onClose} 
          className="btn-icon" 
          style={{ width: '2.25rem', height: '2.25rem', padding: 0, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          <X size={14} color="var(--danger)" />
        </button>
      </div>
    </div>
  );
}
