import { Card, CardBody, CardFooter, CardHeader, Divider, Skeleton } from "@heroui/react";
import { useVideoAnalytics } from '../hooks/useVideoAnalytics';

const Analytics: React.FC<{ currentTime: number; videoId: string }> = ({ currentTime, videoId }) => {
	const { data, currentDataPoint, isLoading, isError, isFetchingNextSegment } = useVideoAnalytics({
		videoId,
		currentTime
	});

	if (isError) return <div className="p-4 text-danger">Error de sincronización.</div>;

	// El estado "cargando" es cuando el hook dice isLoading 
	// O cuando estamos reproduciendo pero aún no llega el primer punto de datos
	const isDataReady = !isLoading && !!currentDataPoint;

	return (
		<Card className="flex flex-col lg:h-lg lg:w-lg gap-4 w-auto">
			<CardHeader className="flex justify-between items-center p-6 pb-0">
				<h3 className="text-lg font-bold">Métricas de Seguridad</h3>

				{/* Badge de actualización dinámico */}
				{isFetchingNextSegment && (
					<div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full animate-pulse font-bold">
						SYNCING...
					</div>
				)}
			</CardHeader>
			<Divider className="self-center w-11/12" />
			<CardBody className="flex flex-col justify-between p-6 h-full">
				<div className="flex flex-col gap-6">

					{/* Sección del Valor Principal */}
					<div className="flex flex-col gap-2">
						<Skeleton isLoaded={isDataReady} className="rounded-lg w-32">
							<div className="flex items-baseline gap-2">
								<span className="text-5xl font-bold">
									{currentDataPoint?.metricValue}%
								</span>
								<span className="text-sm opacity-60">Eficiencia</span>
							</div>
						</Skeleton>
					</div>

					{/* Sección del Evento Detectado */}
					<div className="flex flex-col gap-2">
						<span className="text-xs font-semibold opacity-50 uppercase tracking-wider">
							Evento Actual
						</span>
						<Skeleton isLoaded={isDataReady} className="rounded-lg w-full">
							<div className="p-4 border-1 border-divider rounded-xl bg-content2/30">
								{currentDataPoint?.event ? (
									<p className="text-sm">
										<span className="font-bold">Detección:</span> {currentDataPoint.event}
									</p>
								) : (
									<p className="text-sm italic opacity-40">
										Escaneando entorno... ({Math.floor(currentTime)}s)
									</p>
								)}
							</div>
						</Skeleton>
					</div>
				</div>
			</CardBody>
			<Divider className="self-center w-11/12" />
			{/* Footer con información de caché */}
			<CardFooter className="flex justify-between items-center pt-4 text-[10px] opacity-50 uppercase tracking-tighter">
				<Skeleton isLoaded={!isLoading} className="rounded-md">
					<span>Puntos en caché: {data?.length || 0}</span>
				</Skeleton>
				<span>ID: {videoId}</span>
			</CardFooter>
		</Card>
	);
};

export default Analytics;