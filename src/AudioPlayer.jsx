import React, { useEffect, useRef, useState } from "react";

export default function AudioPlayer({
  src,
  title = "Audio",
  className = "",
  playIcon = null,   // optional <img/> or JSX for play
  pauseIcon = null,  // optional <img/> or JSX for pause
}) {
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  // format seconds -> mm:ss
  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
    } else {
      el.play();
    }
  };

  const onTimeUpdate = () => {
    const el = audioRef.current;
    setCurrent(el.currentTime || 0);
  };

  const onLoadedMetadata = () => {
    const el = audioRef.current;
    setDuration(el.duration || 0);
  };

  const onEnded = () => setIsPlaying(false);

  // keep UI in sync with element state
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  // click/drag to seek
  const handleSeek = (e) => {
    const bar = progressRef.current;
    const el = audioRef.current;
    if (!bar || !el || !duration) return;

    const rect = bar.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const pct = x / rect.width;
    el.currentTime = pct * duration;
    setCurrent(el.currentTime);
  };

  // support keyboard seek on the bar
  const handleKeySeek = (e) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const step = 5; // seconds
    if (e.key === "ArrowRight") {
      el.currentTime = Math.min(el.currentTime + step, duration);
      setCurrent(el.currentTime);
    } else if (e.key === "ArrowLeft") {
      el.currentTime = Math.max(el.currentTime - step, 0);
      setCurrent(el.currentTime);
    }
  };

  const progressPct = duration ? (current / duration) * 100 : 0;

  return (
    <div className={`audio-player ${className}`}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        preload="metadata"
      />

      {/* Play / Pause */}
      <button
        className="ap-btn"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying
          ? (pauseIcon ?? "❚❚")
          : (playIcon ?? "►")}
      </button>

      {/* Title */}
      <div className="ap-title" title={title}>{title}</div>

      {/* Progress bar (click to seek) */}
      <div
        className="ap-progress"
        ref={progressRef}
        onClick={handleSeek}
        onKeyDown={handleKeySeek}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={Math.floor(duration)}
        aria-valuenow={Math.floor(current)}
        aria-label="Seek"
      >
        <div className="ap-progress__track" />
        <div
          className="ap-progress__fill"
          style={{ width: `${progressPct}%` }}
        />
        <div
          className="ap-progress__thumb"
          style={{ left: `${progressPct}%` }}
        />
      </div>

      {/* Time */}
      <div className="ap-time">
        {fmt(current)} / {fmt(duration)}
      </div>
    </div>
  );
}
