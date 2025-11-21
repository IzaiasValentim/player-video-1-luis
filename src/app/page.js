'use client';

import { useState, useEffect, useRef } from 'react';

const currentVideo = 
    {
        name: "Clipe - Miki Matsubara - Stay With Me",
        artist: "Miki Matsubara",
        path: "medias/movies/miki_matsubara_stay_with_me.mp4",
        url: "https://www.youtube.com/watch?v=QNYT9wVwQ8A&list=RDQNYT9wVwQ8A&start_radio=1"
    };

const formatarTempo = (segundos) => {
    if (isNaN(segundos) || segundos < 0) return '0:00';
    const min = Math.floor(segundos / 60);
    const sec = Math.floor(segundos % 60);
    const segundosFormatados = sec < 10 ? '0' + sec : sec;
    return `${min}:${segundosFormatados}`;
};

export default function VideoPlayer() {

    const videoRef = useRef(null); // Refatorado de audioRef para videoRef

    // Hooks de Estado
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5); 
    const [prevVolume, setPrevVolume] = useState(0.5); 

    const playPauseMedia = () => {
        const video = videoRef.current; // Refatorado para 'video'
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play().catch(error => console.error("Erro ao tentar tocar:", error));
        }
        setIsPlaying(!isPlaying);
    };

    const toggleVolumeMute = () => {
        const video = videoRef.current; // Refatorado para 'video'
        if (!video) return;

        if (volume > 0) {
            setPrevVolume(volume);
            setVolume(0);
            video.volume = 0;
        } else {
            // Desmutar -> Volta para o volume anterior (ou 0.5 se for 0)
            const newVolume = prevVolume > 0 ? prevVolume : 0.5;
            setVolume(newVolume);
            video.volume = newVolume;
        }
    };

    const handleProgressChange = (e) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (videoRef.current) { // Refatorado para videoRef
            videoRef.current.currentTime = newTime;
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) { // Refatorado para videoRef
            videoRef.current.volume = newVolume;
        }
    };

    // Este useEffect agora gerencia os eventos do elemento <video>.
    useEffect(() => {
        const video = videoRef.current; // Refatorado para 'video'
        if (!video) return;

        // 1. Handlers de Eventos do Vídeo
        const handleTimeUpdate = () => setCurrentTime(video.currentTime);
        const handleLoadedMetadata = () => {
            setDuration(video.duration);
            video.volume = volume;
        };
        const handleEnded = () => setIsPlaying(false); // Pausa quando o vídeo termina

        // 2. Adiciona os Ouvintes de Evento
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('ended', handleEnded);

        // 3. Função de Limpeza
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
        <div className="video-player"> {/* Classe renomeada para video-player */}

            {/* ONDE O VÍDEO É EXIBIDO: A tag <video> usa a Ref e o caminho do vídeo */}
            <video
                ref={videoRef} // Refatorado para videoRef
                src={currentVideo.path} // Refatorado para currentVideo
                preload="metadata"
                controls={false} // Desabilita controles nativos para usar os customizados
                onClick={playPauseMedia} // Permite Play/Pause ao clicar no vídeo
            ></video>

            {/* Os detalhes do vídeo */}
            <div className="detalhes-video"> {/* Classe renomeada */}
                <p className="titulo">{currentVideo.name}</p>
                <p className="artista">{currentVideo.artist}</p>
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

            {/* Controles (Play/Pause, Volume, Sem Próxima/Anterior para um único vídeo) */}
            <div className="controles">

                {/* Botões vazios para manter o layout centralizado */}
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