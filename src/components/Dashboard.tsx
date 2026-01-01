import React, { useState, useCallback } from 'react';
import { Card, CardBody } from "@heroui/react";
import VideoPlayer from './VideoPlayer';
import Analytics from './Analytics';

const Dashboard: React.FC = () => {
	const [currentTime, setCurrentTime] = useState(0);
	const videoId = "yDp3cB5fHXQ";

	// Manejador simple para actualizar el estado
	const handleProgress = useCallback((seconds: number) => {
		const nextSecond = Math.floor(seconds);
		setCurrentTime(prev => {
			if (Math.floor(prev) === nextSecond) return prev;
			return seconds;
		});
	}, []);

	return (
		<div className='flex flex-col min-h-full w-full p-8'>
			<div className='flex flex-row flex-wrap gap-6 w-full'>

				{/* Contenedor del Video */}
				<div style={{ flex: '2 1 600px' }}>
					<Card style={{ overflow: 'hidden', border: 'none' }}>
						<CardBody style={{ padding: 0 }}>
							<VideoPlayer
								videoId={videoId}
								onProgress={handleProgress}
								onPlay={() => console.log("Video iniciado")}
								onPause={() => console.log("Video pausado")}
							/>
						</CardBody>
					</Card>
				</div>

				{/* Contenedor de Analíticas */}
				<div className='flex-autode'>
					<Analytics
						currentTime={currentTime}
						videoId={videoId}
					/>
				</div>

			</div>
		</div>
	);
};

export default Dashboard;