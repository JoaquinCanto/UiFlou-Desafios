# Dashboard de Video Analíticas - Desafíos 1 & 3

Este proyecto es una solución técnica avanzada para la visualización y análisis de datos asociados a contenido audiovisual. Se enfoca en la eficiencia del manejo de grandes volúmenes de datos y en proporcionar una experiencia de usuario (UX) fluida mediante sincronización en tiempo real.

## 🚀 Tecnologías y Herramientas

* **React 19 & TypeScript**: Interfaz robusta con tipado estricto para evitar errores en tiempo de ejecución.
* **TanStack Query (React Query) v5**: Gestión de estado asíncrono, almacenamiento en caché y lógica de re-intento.
* **HeroUI (Tailwind CSS v4)**: Sistema de diseño moderno con componentes optimizados para accesibilidad y rendimiento.
* **React Player**: Abstracción para la reproducción de video con soporte para diversos formatos de streaming.

---

## 📂 Estructura del Proyecto

Para facilitar la evaluación, el código se ha organizado de forma modular:

* **`/src/hooks/useVideoAnalytics.ts`**: Lógica de negocio, fetching segmentado y sincronización de datos.
* **`/src/components/VideoPlayer.tsx`**: Abstracción del reproductor y normalización de eventos temporales.
* **`/src/components/Analytics.tsx`**: Visualización de métricas con estados de carga (Skeletons).
* **`/src/components/Dashboard.tsx`**: Orquestador principal que gestiona el layout y el flujo de información.
* **`/src/main.tsx`**: Configuración de proveedores globales (QueryClient, HeroUI Theme).

---

## 📽️ Desafío 1: Visualización de Video y Datos Analíticos

### Implementación y Sincronización
Se ha implementado un Dashboard que integra un reproductor de video con un panel de métricas dinámico. 

* **Bonus de Sincronización Real-Time**: Aunque el desafío no lo exigía como obligatorio, la solución utiliza los eventos nativos del motor de video (`onTimeUpdate`) para asegurar que los datos mostrados en el panel de analíticas correspondan exactamente al segundo actual de reproducción, con una precisión de ±1s.

### Justificación del Formato de Video
Se propone el uso de **HLS (HTTP Live Streaming)**:
* **Adaptabilidad**: El *Adaptive Bitrate Streaming* garantiza que el video no se detenga por fluctuaciones en la red, manteniendo la coherencia de la analítica.
* **Escalabilidad**: Es el estándar de la industria para transmisiones de larga duración o streaming en vivo, alineándose con los requisitos de escalabilidad del proyecto.

---

## 📊 Desafío 3: Hook Personalizado y Estrategia de Datos
El hook `useVideoAnalytics` encapsula la lógica compleja de fetching y sincronización, permitiendo que los componentes visuales permanezcan desacoplados de la fuente de datos.

### Estrategia para Videos de Larga Duración (>1 hora)
Manejar horas de metadatos en un solo JSON degradaría el rendimiento. Por ello, se implementó una estrategia de **Segmented Fetching (Chunking)**:

1.  **División por Segmentos (Chunks)**: El hook particiona la línea de tiempo en segmentos (ej. cada 5 minutos). Solo se descargan los datos del segmento actual.
2.  **Caché Inteligente**: Se utiliza una `queryKey` que incluye el `videoId` y el `currentSegment`. Esto permite que, si el usuario retrocede en el video, los datos se recuperen instantáneamente desde la caché local de TanStack Query.
3.  **Optimización de Búsqueda**: La búsqueda del punto de datos exacto se realiza mediante una función `useMemo` optimizada que opera solo sobre el segmento cargado (~150 puntos), garantizando una respuesta de O(1) o cercano a O(n) sobre un set muy reducido.
4.  **UX con Placeholder Data**: Mientras se descarga un nuevo segmento, el hook mantiene los datos anteriores o muestra estados de carga (Skeletons), evitando saltos bruscos en la interfaz.
5.  **Simulación de Backend**: El hook incluye una función que simula un endpoint REST real, con latencia de red y segmentación lógica, permitiendo una transición directa a una API de producción.

---

## 🛠️ Instalación y Ejecución

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Ejecutar en desarrollo**:
    ```bash
    npm run dev
    ```

3.  **Compilar para producción**:
    ```bash
    npm run build
    ```

---

## 📈 Decisiones de Diseño (UX/UI)

* **Skeleton Loading**: Se utilizan "esqueletos" para evitar saltos visuales (CLS) mientras se cargan nuevos segmentos de datos, manteniendo una estructura limpia.
* **Responsive Layout**: Uso de Flexbox para un diseño adaptable; el video mantiene su relación de aspecto 16:9 mientras el panel lateral se ajusta según la resolución.
* **Dark Mode**: Interfaz configurada en modo oscuro para reducir la fatiga visual en contextos de monitoreo profesional.