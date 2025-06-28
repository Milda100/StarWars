import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { Volume2, VolumeX } from "lucide-react";

const ThemeAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      const audio = audioRef.current;
      if (audio && !hasInteracted) {
        audio.volume = 0.5;
        audio.muted = false;
        audio
          .play()
          .then(() => {
            setHasInteracted(true);
          })
          .catch((err) => console.warn("Play failed:", err));
      }
    };

    // Listen once for user interaction
    document.body.addEventListener("click", handleInteraction, { once: true });

    return () => {
      document.body.removeEventListener("click", handleInteraction);
    };
  }, [hasInteracted]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(audio.muted);
    }
  };

  return (
    <div className="theme-audio-controller position-absolute top-0 end-0 m-3 z-3">
      <audio
        ref={audioRef}
        src="https://soundfxcenter.com/movies/star-wars/8d82b5_Star_Wars_Main_Theme_Song.mp3"
        loop
      />
      <Button variant="dark" onClick={toggleMute} size="sm">
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </Button>
    </div>
  );
};

export default ThemeAudio;
