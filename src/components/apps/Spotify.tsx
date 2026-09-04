import React, { useState, useRef, useEffect, useCallback } from "react";
import { useStore } from "~/stores";
import tracks from "~/configs/spotify";
import type { SpotifyTrack } from "~/types";

interface PlayerState {
  currentTrackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: boolean;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const Spotify: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const globalVolume = useStore((state) => state.volume);
  const setGlobalVolume = useStore((state) => state.setVolume);

  const [state, setState] = useState<PlayerState>({
    currentTrackIndex: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: globalVolume / 100,
    shuffle: false,
    repeat: false
  });

  const currentTrack: SpotifyTrack | undefined = tracks[state.currentTrackIndex];

  const loadTrack = useCallback(
    (index: number, autoPlay: boolean = false) => {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const track = tracks[index];
      const audio = new Audio(track.audio);
      audio.volume = state.volume;
      audioRef.current = audio;

      const handleLoadedMetadata = () => {
        setState((prev) => ({ ...prev, duration: audio.duration }));
        if (autoPlay) {
          audio.play().catch((err) => console.error("Playback error:", err));
        }
      };

      const handleTimeUpdate = () => {
        setState((prev) => ({ ...prev, currentTime: audio.currentTime }));
      };

      const handleEnded = () => {
        if (state.repeat) {
          audio.currentTime = 0;
          audio.play();
        } else {
          const nextIndex = (index + 1) % tracks.length;
          if (state.shuffle) {
            const randomIndex = Math.floor(Math.random() * tracks.length);
            loadTrack(randomIndex, true);
          } else {
            loadTrack(nextIndex, true);
          }
        }
      };

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
      };
    },
    [state.volume, state.repeat, state.shuffle]
  );

  useEffect(() => {
    if (!currentTrack) return;

    const cleanup = loadTrack(state.currentTrackIndex, false);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = globalVolume / 100;
      setState((prev) => ({ ...prev, volume: globalVolume / 100 }));
    }
  }, [globalVolume]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.error("Playback error:", err));
    }
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [state.isPlaying]);

  const handleNext = useCallback(() => {
    let nextIndex: number;
    if (state.shuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (state.currentTrackIndex + 1) % tracks.length;
    }

    setState((prev) => ({
      ...prev,
      currentTrackIndex: nextIndex,
      currentTime: 0,
      isPlaying: true
    }));

    loadTrack(nextIndex, true);
  }, [state.currentTrackIndex, state.shuffle, loadTrack]);

  const handlePrevious = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    const prevIndex =
      state.currentTrackIndex === 0 ? tracks.length - 1 : state.currentTrackIndex - 1;

    setState((prev) => ({
      ...prev,
      currentTrackIndex: prevIndex,
      currentTime: 0,
      isPlaying: true
    }));

    loadTrack(prevIndex, true);
  }, [state.currentTrackIndex, loadTrack]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * audio.duration;

    audio.currentTime = newTime;
    setState((prev) => ({ ...prev, currentTime: newTime }));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setState((prev) => ({ ...prev, volume: newVolume }));
    setGlobalVolume(Math.round(newVolume * 100));
  };

  const playTrack = (index: number) => {
    setState((prev) => ({
      ...prev,
      currentTrackIndex: index,
      currentTime: 0,
      isPlaying: true
    }));

    loadTrack(index, true);
  };

  const toggleShuffle = () => {
    setState((prev) => ({ ...prev, shuffle: !prev.shuffle }));
  };

  const toggleRepeat = () => {
    setState((prev) => ({ ...prev, repeat: !prev.repeat }));
  };

  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div className="h-full w-full flex flex-col" style={{ backgroundColor: "#121212" }}>
      <div className="flex-1 flex overflow-hidden">
        <div
          className="w-56 flex-shrink-0 flex flex-col p-2"
          style={{ backgroundColor: "#000000" }}
        >
          <div className="p-4 mb-4">
            <div className="flex items-center space-x-2">
              <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#1DB954">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              <span className="text-white font-bold text-xl">Spotify</span>
            </div>
          </div>

          <nav className="space-y-1 px-2">
            <div className="flex items-center space-x-4 p-3 rounded-md cursor-pointer text-white hover:bg-white/10 transition-colors">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
              </svg>
              <span className="font-semibold">Home</span>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-md cursor-pointer text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" />
              </svg>
              <span className="font-semibold">Search</span>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-md cursor-pointer text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM16 4.732 20 7v13h-4V4.732zM6 22a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866l6-3.464A1 1 0 0 1 13 0v18a1 1 0 0 1-1 1H6zm1-18.268V20h4V2.732l-4 2.316z" />
              </svg>
              <span className="font-semibold">Your Library</span>
            </div>
          </nav>

          <div className="my-4 mx-2 border-t border-gray-800" />

          {currentTrack && (
            <div className="mt-auto p-2">
              <div className="p-2 rounded-md" style={{ backgroundColor: "#282828" }}>
                <div className="flex items-center space-x-3">
                  <img
                    src={currentTrack.cover}
                    alt={currentTrack.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">
                      {currentTrack.title}
                    </div>
                    <div className="text-gray-400 text-xs truncate">
                      {currentTrack.artist}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className="flex-1 overflow-y-auto p-6"
          style={{ backgroundColor: "#121212" }}
        >
          <div className="mb-6">
            <h1 className="text-white text-3xl font-bold mb-2">Good evening</h1>
            <p className="text-gray-400">Your music library</p>
          </div>

          <div className="space-y-1">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-gray-400 text-sm border-b border-gray-800 mb-2">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-4">Artist</div>
              <div className="col-span-2 text-right">
                <svg viewBox="0 0 16 16" className="w-4 h-4 inline" fill="currentColor">
                  <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
                  <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z" />
                </svg>
              </div>
            </div>

            {tracks.map((track, index) => (
              <div
                key={track.id}
                onClick={() => playTrack(index)}
                className={`grid grid-cols-12 gap-4 px-4 py-2 rounded-md cursor-pointer transition-colors group ${
                  state.currentTrackIndex === index ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <div className="col-span-1 flex items-center">
                  {state.currentTrackIndex === index && state.isPlaying ? (
                    <div className="flex items-end space-x-0.5 h-4">
                      <span
                        className="w-1 bg-green-500 animate-pulse"
                        style={{ height: "60%" }}
                      />
                      <span
                        className="w-1 bg-green-500 animate-pulse"
                        style={{ height: "100%", animationDelay: "0.2s" }}
                      />
                      <span
                        className="w-1 bg-green-500 animate-pulse"
                        style={{ height: "40%", animationDelay: "0.4s" }}
                      />
                    </div>
                  ) : (
                    <span
                      className={`text-gray-400 group-hover:hidden ${state.currentTrackIndex === index ? "text-green-500" : ""}`}
                    >
                      {index + 1}
                    </span>
                  )}
                  <span className="hidden group-hover:block text-white">
                    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
                      <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
                    </svg>
                  </span>
                </div>
                <div className="col-span-5 flex items-center space-x-3">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <span
                    className={`font-medium truncate ${state.currentTrackIndex === index ? "text-green-500" : "text-white"}`}
                  >
                    {track.title}
                  </span>
                </div>
                <div className="col-span-4 flex items-center text-gray-400">
                  {track.artist}
                </div>
                <div className="col-span-2 flex items-center justify-end text-gray-400">
                  {formatTime(state.currentTrackIndex === index ? state.duration : 0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="h-20 flex-shrink-0 flex items-center px-4 border-t border-gray-800"
        style={{ backgroundColor: "#181818" }}
      >
        <div className="w-1/4 flex items-center space-x-4">
          {currentTrack && (
            <>
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-14 h-14 rounded object-cover"
              />
              <div className="min-w-0">
                <div className="text-white text-sm font-medium truncate">
                  {currentTrack.title}
                </div>
                <div className="text-gray-400 text-xs truncate">
                  {currentTrack.artist}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto">
          <div className="flex items-center space-x-4 mb-2">
            <button
              onClick={toggleShuffle}
              className={`p-1 transition-colors ${state.shuffle ? "text-green-500" : "text-gray-400 hover:text-white"}`}
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
                <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06l2.306-2.306a.75.75 0 0 0 0-1.06L13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z" />
                <path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.306 2.306a.75.75 0 0 1 0 1.06l-2.306 2.306a.75.75 0 1 1-1.06-1.06l1.018-1.018H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z" />
              </svg>
            </button>

            <button
              onClick={handlePrevious}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
                <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:scale-105 transition-transform"
            >
              {state.isPlaying ? (
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="black">
                  <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" className="w-4 h-4 ml-0.5" fill="black">
                  <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
                </svg>
              )}
            </button>

            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
                <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z" />
              </svg>
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-1 transition-colors ${state.repeat ? "text-green-500" : "text-gray-400 hover:text-white"}`}
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
                <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z" />
              </svg>
            </button>
          </div>

          <div className="w-full flex items-center space-x-2">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(state.currentTime)}
            </span>
            <div
              ref={progressRef}
              className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-white group-hover:bg-green-500 rounded-full relative transition-colors"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-xs text-gray-400 w-10">
              {formatTime(state.duration)}
            </span>
          </div>
        </div>

        <div className="w-1/4 flex items-center justify-end space-x-2">
          <svg viewBox="0 0 16 16" className="w-4 h-4 text-gray-400" fill="currentColor">
            <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z" />
            <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={state.volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #fff ${state.volume * 100}%, #4b5563 ${state.volume * 100}%)`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Spotify;
