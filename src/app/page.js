'use client';

import { useState, useEffect, useRef } from 'react';

const videosList =
    [
        {
            name: "Clipe - Miki Matsubara - Stay With Me",
            artist: "Miki Matsubara",
            path: "medias/videos/miki_matsubara_stay_with_me.mp4",
            url: "https://www.youtube.com/watch?v=QNYT9wVwQ8A&list=RDQNYT9wVwQ8A&start_radio=1"
        },
        {
            name: "",
            artist: "",
            path: "medias/videos/miki_matsubara_stay_with_me.mp4",
            url: "https://www.youtube.com/watch?v=QNYT9wVwQ8A&list=RDQNYT9wVwQ8A&start_radio=1"
        },
    ][0];
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
                    src={videosList.path}
                    preload="metadata"
                    controls={false}
                    onClick={playPauseMedia}
                    id="obj-video"
                ></video>

                {/* Overlay que eu criei para que o usuário possa acessar o vídeo pelo link */}
                <a
                    href={videosList.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-link-overlay"
                >
                    <i className="fas fa-external-link-alt"></i>
                    <span>Assistir no link externo</span>
                </a>
            </div>


            <div className="detalhes-video">
                <p className="titulo">{videosList.name ? videosList.name : "Não definido" }</p>
                <p className="artista">{videosList.artist ? videosList.artist : "Desconhecido" }</p>
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

                <button className="btn-controle" disabled><i className="fas fa-backward"></i></button>

                <button id="btn-play-pause" className="btn-controle principal" onClick={playPauseMedia}>
                    <i className={getPlayPauseIcon()}></i>
                </button>

                <button className="btn-controle" disabled><i className="fas fa-forward"></i></button>

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
        </div>
    );
}