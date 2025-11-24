'use client';

import { useState, useEffect, useRef } from 'react';
import VideoItemList from './components/VideoItemList';


const videosList =
    [
        {
            name: "Clipe - Miki Matsubara - Stay With Me",
            artist: "Miki Matsubara",
            path: "medias/videos/miki_matsubara_stay_with_me.mp4",
            url: "https://www.youtube.com/watch?v=QNYT9wVwQ8A&list=RDQNYT9wVwQ8A&start_radio=1"
        },
        {
            name: "Clipe - Miki Matsubara - Stay With Me",
            artist: "Web",
            path: null,
            url: "https://youtu.be/QNYT9wVwQ8A?list=RDQNYT9wVwQ8A"
        },
          {
            name: "",
            artist: "",
            path: "medias/videos/miki_matsubara_stay_with_me.mp4",
            url: "https://www.youtube.com/watch?v=QNYT9wVwQ8A&list=RDQNYT9wVwQ8A&start_radio=1"
        },
    ];
/* Como no momento é apenas um vídeo, eu já coloquei [0] 
para sempre acessar o primeiro índice do array. */

// Segue igual ao player de audio
const formatarTempo = (segundos) => {
    if (isNaN(segundos) || segundos < 0) return '0:00';
    const min = Math.floor(segundos / 60);
    const sec = Math.floor(segundos % 60);
    const segundosFormatados = sec < 10 ? '0' + sec : sec;
    return `${min}:${segundosFormatados}`;
};

// Componente Principal do Player de Vídeo
export default function VideoPlayer() {

    const videoRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [prevVolume, setPrevVolume] = useState(0.5);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Aplicado para o player em geral.
    const [selectedVideo, setSelectedVideo] = useState(videosList[0]); // Aplicado para a lista de músicas.

    const playPauseMedia = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play().catch(error => console.error("Erro ao tentar reproduzir o vídeo:", error));
        }
        setIsPlaying(!isPlaying);
    };

    const toggleVolumeMute = () => {
        const video = videoRef.current;
        if (!video) return;

        if (volume > 0) {
            setPrevVolume(volume);
            setVolume(0);
            video.volume = 0;
        } else {
            const newVolume = prevVolume > 0 ? prevVolume : 1;
            setVolume(newVolume);
            video.volume = newVolume;
        }
    };

    const handleProgressChange = (e) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    const nextVideo = () => {
        let newIndex;
        if (currentVideoIndex === videosList.length - 1) {
            newIndex = 0;
        } else {
            newIndex = currentVideoIndex + 1;
        }
        setCurrentVideoIndex(newIndex);
        setSelectedVideo(videosList[newIndex]);
        setIsPlaying(true);
    };

    const prevVideo = () => {
        let newIndex;
        if (currentVideoIndex === 0) {
            newIndex = videosList.length - 1;
        } else {
            newIndex = currentVideoIndex - 1;
        }
        setCurrentVideoIndex(newIndex);
        setSelectedVideo(videosList[newIndex]);
        setIsPlaying(true);
    };

    /**
     * Lida com a seleção de uma faixa na lista.
     */
    const handleVideoSelect = (index) => {
        setCurrentVideoIndex(index);
        setSelectedVideo(videosList[index]);
        setIsPlaying(true); // Inicia a reprodução
    };

      useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.currentTime = 0; // Zera o tempo no elemento DOM

        //video.load(); // Força o recarregamento do novo SRC

        if (isPlaying) {
            video.play().catch(error => {
                console.error("Autoplay bloqueado ao trocar de faixa:", error);
                setIsPlaying(false);
            });
        }

    }, [selectedVideo, isPlaying]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => setCurrentTime(video.currentTime);
        const handleLoadedMetadata = () => {
            setDuration(video.duration);
            video.volume = volume;
        };
        const handleEnded = () => setIsPlaying(false);

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('ended', handleEnded);
        };
    }, [volume]);

    const getVolumeIcon = () => {
        if (volume === 0) return 'fas fa-volume-mute';
        if (volume < 0.5) return 'fas fa-volume-down';
        return 'fas fa-volume-up';
    };

    const getPlayPauseIcon = () => {
        return isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }

    // --- JSX (O que será renderizado na tela) ---
    return (
        <div className="video-player">

            {/* ONDE O VÍDEO É DEFINIDO: A tag <video> usa a Ref e o caminho do vdeo */}
            <div className="video-container-wrapper">
                <video
                    ref={videoRef}
                    preload="metadata"
                    controls={false}
                    onClick={playPauseMedia}
                    id="obj-video"
                >
                    {/* 1. Fonte Local (Path) - Tenta carregar este primeiro */}
                    {selectedVideo.path && (
                        <source src={selectedVideo.path} type="video/mp4" />
                    )}

                    {/* 2. Fonte Externa (URL) - Tenta carregar este se o primeiro falhar */}
                    {selectedVideo.url && (
                        <source src={selectedVideo.url} type="video/mp4" />
                    )}
                </video>

                {/* Overlay que eu criei para que o usuário possa acessar o vídeo pelo link */}
                <a
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-link-overlay"
                >
                    <i className="fas fa-external-link-alt"></i>
                    <span>Assistir no link externo</span>
                </a>
            </div>


            <div className="detalhes-video">
                <p className="titulo">{selectedVideo.name ? selectedVideo.name : "Não definido" }</p>
                <p className="artista">{selectedVideo.artist ? selectedVideo.artist : "Desconhecido" }</p>
            </div>

            {/* Progresso e Tempo */}
            <div className="progresso-container">
                <div className="tempo-atual">{formatarTempo(currentTime)}</div>

                <input
                    type="range"
                    id="barra-progresso"
                    value={currentTime}
                    max={duration}
                    onChange={handleProgressChange}
                />

                <div className="duracao-total">{formatarTempo(duration)}</div>
            </div>

            {/* Controles (Play/Pause, Volume) No momento não há lista de vídeos então próximo e anterior não está implementado */}
            <div className="controles">

                <button className="btn-controle" onClick={prevVideo} ><i className="fas fa-backward"></i></button>

                <button id="btn-play-pause" className="btn-controle principal" onClick={playPauseMedia}>
                    <i className={getPlayPauseIcon()}></i>
                </button>

                <button className="btn-controle" onClick={nextVideo}><i className="fas fa-forward"></i></button>

                <div className="volume-container">
                    <button id="btn-volume" className="btn-controle" onClick={toggleVolumeMute}>
                        <i className={getVolumeIcon()}></i>
                    </button>
                    <input
                        type="range"
                        id="volume-range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                    />
                </div>
            </div>
             {/* 3. LISTA DE VÍDEOS (FORA DO PLAYER) */}
            <div className="playlist-container">
                <h3>Lista de Reprodução</h3>
                <div className="track-list">
                    {videosList.map((video, index) => (
                        <VideoItemList
                            key={index}
                            video={video}
                            index={index}
                            isSelected={index === currentVideoIndex}
                            onSelect={handleVideoSelect}
                        />
                    ))}
                </div>
            </div>
        </div>
        
    );
}