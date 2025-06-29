import { useEffect, useRef, useState } from "react";
import ThemeAudio from "./ThemeAudio";

type Props = {
  children: React.ReactNode;
};

const IntroWrapper = ({ children }: Props) => {
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null); // <- NEW

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.muted = false;
      audioRef.current
        .play()
        .catch((err) => console.warn("Audio play failed:", err));
    }
    setHasStarted(true);
  };

  useEffect(() => {
    if (!hasStarted && overlayRef.current) {
      overlayRef.current.focus(); // <- FOCUS overlay when it mounts
    }
  }, [hasStarted]);

  return (
    <div className="app-wrapper">
      {!hasStarted && (
        <div
          ref={overlayRef} // <- Attach ref
          className="intro-overlay"
          onClick={handleStart}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleStart();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Click or press Enter to begin the Star Wars experience"
        >
          <h1 className="intro-title">Star Wars</h1>
          <h2 className="intro-subtitle">A long time ago in a galaxy far, far away...</h2>
          <p className="click-to-start">Click or press Enter to Begin</p>
        </div>
      )}

      <audio
        ref={audioRef}
        src="https://soundfxcenter.com/movies/star-wars/8d82b5_Star_Wars_Main_Theme_Song.mp3"
        loop
        muted
      />

      <div className={`app-content ${hasStarted ? "show" : "hidden"}`}>
        <ThemeAudio externalRef={audioRef} />
        {children}
      </div>
    </div>
  );
};

export default IntroWrapper;
