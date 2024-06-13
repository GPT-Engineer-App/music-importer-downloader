import React, { useState, useRef } from "react";
import { Container, VStack, Text, Button, Input, HStack, IconButton, Select } from "@chakra-ui/react";
import { FaPlay, FaPause, FaStop, FaDownload, FaRandom } from "react-icons/fa";
import axios from "axios";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrls, setAudioUrls] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playMode, setPlayMode] = useState("sequential");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setAudioUrls(urls);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
  };

  const handleDownload = () => {
    if (audioUrls.length > 0) {
      const link = document.createElement("a");
      link.href = audioUrls[currentTrackIndex];
      link.download = "downloaded_audio.mp3";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleYoutubeDownload = async () => {
    try {
      const response = await axios.post("https://your-youtube-to-mp3-api.com/download", { url: youtubeUrl });
      setAudioUrls([response.data.audioUrl]);
      setCurrentTrackIndex(0);
      setIsPlaying(false);
    } catch (error) {
      console.error("Error downloading audio from YouTube:", error);
    }
  };

  const handleNextTrack = () => {
    if (playMode === "sequential") {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % audioUrls.length);
    } else if (playMode === "random") {
      const randomIndex = Math.floor(Math.random() * audioUrls.length);
      setCurrentTrackIndex(randomIndex);
    }
  };

  const handleAudioEnded = () => {
    handleNextTrack();
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Music Player</Text>
        <audio ref={audioRef} src={audioUrls[currentTrackIndex]} onEnded={handleAudioEnded} />
        <HStack spacing={2}>
          <IconButton aria-label="Play" icon={<FaPlay />} onClick={handlePlay} isDisabled={audioUrls.length === 0 || isPlaying} />
          <IconButton aria-label="Pause" icon={<FaPause />} onClick={handlePause} isDisabled={audioUrls.length === 0 || !isPlaying} />
          <IconButton aria-label="Stop" icon={<FaStop />} onClick={handleStop} isDisabled={audioUrls.length === 0} />
        </HStack>
        <Input type="file" accept="audio/*" multiple onChange={handleFileChange} />
        <Button leftIcon={<FaDownload />} onClick={handleDownload} isDisabled={audioUrls.length === 0}>
          Download
        </Button>
        <Input placeholder="Enter YouTube URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
        <Button onClick={handleYoutubeDownload} isDisabled={!youtubeUrl}>
          Download from YouTube
        </Button>
        <Select value={playMode} onChange={(e) => setPlayMode(e.target.value)}>
          <option value="sequential">Sequential</option>
          <option value="random">Random</option>
        </Select>
      </VStack>
    </Container>
  );
};

export default Index;