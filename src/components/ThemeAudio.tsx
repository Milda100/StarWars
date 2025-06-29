import { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Volume2, VolumeX } from "lucide-react";

type Props = {
  externalRef?: React.RefObject<HTMLAudioElement | null>;
};

const ThemeAudio = ({ externalRef }: Props) => {
  const internalRef = useRef<HTMLAudioElement>(null);
  const audioRef = externalRef || internalRef;

  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && !audio.muted) {
      audio.muted = true;
      setIsMuted(true);
    }
  }, [audioRef]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const newMutedState = !audio.muted;
    audio.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  return (
    <div className="theme-audio-controller position-absolute top-0 end-0 m-3 z-3">
      {!externalRef && (
        <audio
          ref={audioRef}
          src="https://soundfxcenter.com/movies/star-wars/8d82b5_Star_Wars_Main_Theme_Song.mp3"
          loop
          autoPlay
        />
      )}

      <Button
        variant="dark"
        onClick={toggleMute}
        size="sm"
        aria-label={isMuted ? "Unmute theme audio" : "Mute theme audio"}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </Button>
    </div>
  );
};

export default ThemeAudio;
