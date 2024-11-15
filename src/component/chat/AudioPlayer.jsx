import React, { useRef, useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { FaPlay, FaPause } from "react-icons/fa";

const AudioPlayer = ({ audioUrl }) => {
  const waveformRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false); // State to track loading errors

  useEffect(() => {
    // Initialize Wavesurfer
    waveSurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#f04e23",
      progressColor: "#f04e23",
      height: 40,
      cursorWidth: 0,
      barWidth: 2,
    });

    // Load the audio file
    waveSurferRef.current.load(audioUrl);

    // Error handling: if the audio fails to load, display an error
    waveSurferRef.current.on("error", (e) => {
      console.error("Audio loading error:", e);
      setError(true); // Set error state to true if there's a loading issue
    });

    // Cleanup on component unmount
    return () => {
      waveSurferRef.current.destroy();
      waveSurferRef.current = null;
    };
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (waveSurferRef.current.isPlaying()) {
      waveSurferRef.current.pause();
      setIsPlaying(false);
    } else {
      waveSurferRef.current.play();
      setIsPlaying(true);
    }
  };

  if (error) {
    return <div>Failed to load audio. Please try again.</div>;
  }

  return (
    <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "#f8f8f8", display: "inline-block" }}>
      <div ref={waveformRef} style={{ marginBottom: "5px" }}></div>
      <button onClick={handlePlayPause} style={{ background: "none", border: "none" }}>
        {isPlaying ? <FaPause color="#f04e23" /> : <FaPlay color="#f04e23" />}
      </button>
    </div>
  );
};

export default AudioPlayer;
