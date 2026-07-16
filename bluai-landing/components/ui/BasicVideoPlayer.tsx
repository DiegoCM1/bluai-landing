"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type BasicVideoPlayerProps = {
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export default function BasicVideoPlayer({
  src,
  autoPlay = false,
  muted = false,
  loop = false,
  className = "",
}: BasicVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Pause when the video scrolls out of view; resume autoplay videos when it
  // comes back. Saves CPU/battery and matches the client's request.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (autoPlay) void video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [autoPlay]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void container.requestFullscreen();
    }
  }, []);

  const handleSeek = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(value)) return;
    video.currentTime = value;
    setCurrentTime(value);
  }, []);

  return (
    <div ref={containerRef} className={`group relative bg-navy-950 ${className}`}>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={src}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        disablePictureInPicture
        controls={false}
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-3 pb-3 pt-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          aria-label="Progreso del video"
          className="pointer-events-auto mb-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-white/25 accent-white [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          onChange={(event) => handleSeek(Number(event.target.value))}
        />

        <div className="pointer-events-auto flex items-center gap-3 text-xs text-white">
          <button
            type="button"
            aria-label={playing ? "Pausar" : "Reproducir"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-black/35 transition-colors hover:bg-black/55"
            onClick={togglePlay}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden>
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <span className="tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label={isMuted ? "Activar sonido" : "Silenciar"}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-black/35 transition-colors hover:bg-black/55"
              onClick={toggleMute}
            >
              {isMuted ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-white" aria-hidden>
                  <path
                    d="M11 5L6 9H3v6h3l5 4V5zM19 9l-6 6M13 9l6 6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-white" aria-hidden>
                  <path
                    d="M11 5L6 9H3v6h3l5 4V5zM15 9a4 4 0 010 6M17 7a7 7 0 010 10"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            <button
              type="button"
              aria-label="Pantalla completa"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-black/35 transition-colors hover:bg-black/55"
              onClick={toggleFullscreen}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-white" aria-hidden>
                <path
                  d="M8 3H3v5M16 3h5v5M16 21h5v-5M8 21H3v-5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
