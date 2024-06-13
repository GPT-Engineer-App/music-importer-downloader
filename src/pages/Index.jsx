import React, { useState, useRef } from "react";
import { Container, VStack, Text, Button, Input, HStack, IconButton } from "@chakra-ui/react";
import { FaPlay, FaPause, FaStop, FaDownload } from "react-icons/fa";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
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
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setIsPlaying(false);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = "downloaded_audio.mp3";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Music Player</Text>
        <audio ref={audioRef} src={audioUrl} />
        <HStack spacing={2}>
          <IconButton aria-label="Play" icon={<FaPlay />} onClick={handlePlay} isDisabled={!audioUrl || isPlaying} />
          <IconButton aria-label="Pause" icon={<FaPause />} onClick={handlePause} isDisabled={!audioUrl || !isPlaying} />
          <IconButton aria-label="Stop" icon={<FaStop />} onClick={handleStop} isDisabled={!audioUrl} />
        </HStack>
        <Input type="file" accept="audio/*" onChange={handleFileChange} />
        <Button leftIcon={<FaDownload />} onClick={handleDownload} isDisabled={!audioUrl}>
          Download
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;