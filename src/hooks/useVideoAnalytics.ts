import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

// 1. Interfaces para tipado estricto
export interface AnalyticsData {
	timestamp: number;
	metricValue: number;
	event?: string;
}

interface UseVideoAnalyticsProps {
	videoId: string;
	currentTime: number;
	isEnabled?: boolean;
}

// 2. Función de Fetch simulando un Backend Segmentado
// En el futuro, reemplazar este bloque por una llamada real a Axios.
const fetchAnalyticsSegment = async (videoId: string, segment: number): Promise<AnalyticsData[]> => {
	console.log(`[API] Solicitando segmento ${segment} para video ${videoId}`);

	// Simulamos latencia de red (800ms)
	await new Promise(resolve => setTimeout(resolve, 800));

	// Generamos datos para el segmento solicitado (cada segmento = 300 segundos)
	const mockData: AnalyticsData[] = [];
	const startSecond = segment * 300;
	const endSecond = startSecond + 300;

	// Generamos un punto de datos cada 2 segundos para que la UI sea dinámica
	for (let i = startSecond; i < endSecond; i += 2) {
		mockData.push({
			timestamp: i,
			metricValue: Math.floor(Math.random() * (98 - 60 + 1)) + 60, // Valor entre 60 y 98
			// Simulamos eventos específicos cada 20 segundos
			event: i % 20 === 0 ? `Detección de seguridad en seg. ${i}` : undefined
		});
	}

	return mockData;
};

export const useVideoAnalytics = ({ videoId, currentTime, isEnabled = true }: UseVideoAnalyticsProps) => {

	// 3. Definición de Segmento (Chunking)
	const segmentSize = 300; // 5 minutos por segmento
	const currentSegment = Math.floor(currentTime / segmentSize);

	// 4. TanStack Query: Manejo de estados y Caché
	const query = useQuery({
		queryKey: ['video-analytics', videoId, currentSegment],
		queryFn: () => fetchAnalyticsSegment(videoId, currentSegment),
		enabled: isEnabled && !!videoId,
		staleTime: 1000 * 60 * 5, // Cache de 5 min
		placeholderData: (previousData) => previousData, // Mejora la UX al cambiar segmentos
	});

	// 5. Búsqueda Optimizada (Estrategia O(1) / O(n) sobre segmento pequeño)
	const currentDataPoint = useMemo(() => {
		// Validación de seguridad para evitar "find is not a function"
		if (!query.data || !Array.isArray(query.data)) return null;

		const targetSecond = Math.floor(currentTime);

		// Al buscar solo en un array de ~150 elementos (300seg/2seg), 
		// el impacto en performance es despreciable.
		return query.data.find(point =>
			Math.floor(point.timestamp) === targetSecond ||
			Math.floor(point.timestamp) === targetSecond - 1 // Tolerancia por si el interval salta segundos
		) || null;
	}, [query.data, currentTime]);

	return {
		data: query.data,
		currentDataPoint,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
		// Útil para mostrar un spinner pequeño o aviso en el Analytics.tsx
		isFetchingNextSegment: query.isFetching && !query.isLoading
	};
};