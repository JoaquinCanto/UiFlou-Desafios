import { useCallback } from 'react';
import ReactPlayer from 'react-player';

interface PlayerEvent {
	target?: {
		currentTime: number;
	};
	playedSeconds?: number;
}

interface VideoPlayerProps {
	videoId: string;
	onProgress: (seconds: number) => void;
	onPlay?: () => void;
	onPause?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, onProgress, onPlay, onPause }) => {
	const Player = ReactPlayer as React.ComponentType<Record<string, unknown>>;

	const handleTimeUpdate = useCallback((e: PlayerEvent) => {
		// Extraemos el tiempo ya sea del evento nativo o del objeto de ReactPlayer
		const seconds = e?.target?.currentTime ?? e?.playedSeconds ?? 0;

		if (!isNaN(seconds)) {
			onProgress(seconds);
		}
	}, [onProgress]);

	return (
		<div style={{ width: '100%', height: '100%', aspectRatio: '16/9' }}>
			<Player
				src={`https://www.youtube.com/watch?v=${videoId}`}
				controls={true}
				width="100%"
				height="100%"
				onTimeUpdate={handleTimeUpdate}
				onProgress={handleTimeUpdate}
				onPlay={onPlay}
				onPause={onPause}
				config={{
					youtube: {
						playerVars: {
							rel: 0,
							iv_load_policy: 3,
							origin: window.location.origin
						}
					}
				}}
			/>
		</div>
	);
};

export default VideoPlayer;