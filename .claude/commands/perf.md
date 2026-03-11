# Performance Audit — React + Blockchain

Analiza el archivo o selección para encontrar problemas de performance. Este proyecto usa React 18, thirdweb v5, ethers.js v5, y hace llamadas a contratos en Base Sepolia.

## Prioridades de análisis

### 1. Blockchain & Fetching
- **Requests paralelos vs secuenciales**: ¿Se puede reemplazar un `for` loop con `Promise.all`?
- **Sleeps hardcodeados**: `setTimeout` con delays fijos son siempre un problema; busca alternativas (polling por evento, `provider.waitForTransaction`, etc.)
- **Fetches duplicados**: ¿Se llama al mismo método de contrato varias veces innecesariamente?
- **Block polling**: ¿Se está estimando tiempo de bloque de forma ineficiente? Sugiere usar `provider.getAverageBlockTime()` o un valor conocido para la red (Base Sepolia ≈ 2s).
- **Event filtering**: `queryFilter` en rangos grandes puede ser costoso; sugiere límites de bloque o indexación off-chain.
- **Ausencia de caché**: datos que no cambian frecuentemente (parámetros del Governor) deberían cachearse.

### 2. React Rendering
- Funciones y objetos creados inline en JSX que causan re-renders
- `useEffect` con dependencias incorrectas que causan loops
- Estado compartido que podría colocarse más cerca del componente que lo usa
- Listas sin `key` estable o con `key={index}`
- Contextos que re-renderizan toda la app cuando solo cambia una parte

### 3. Bundle & Carga inicial
- Imports de ethers/thirdweb que traen todo el módulo (busca imports específicos)
- Páginas que podrían usar `React.lazy` + `Suspense`
- Assets grandes o sin lazy loading

## Output
Lista los problemas ordenados por impacto (mayor impacto primero). Para cada uno:
- **Impacto**: Alto / Medio / Bajo (tiempo ahorrado o renders evitados)
- **Código actual** (snippet del problema)
- **Código mejorado** (solución concreta)
- **Por qué**: breve justificación técnica

$SELECTION
