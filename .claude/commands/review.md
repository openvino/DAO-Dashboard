# Code Review — React + Web3 DAO

Haz una revisión completa del archivo o selección actual. Analiza todo lo siguiente:

## React & TypeScript
- Hooks mal usados (dependencias faltantes en useEffect, closures obsoletos, stale state)
- Componentes que deberían memoizarse (React.memo, useMemo, useCallback)
- Re-renders innecesarios: props que cambian referencia en cada render, objetos/arrays inline
- Tipado débil (any, as casting sin justificación, tipos faltantes)
- Patrones de componente: demasiada lógica en el componente, candidatos para custom hooks
- Keys faltantes o incorrectas en listas

## Web3 / Thirdweb / Ethers
- Race conditions en fetches de blockchain (useEffect sin cleanup, múltiples requests paralelos)
- Timeouts/sleeps hardcodeados innecesarios (como el `sleep(3000)` para estimar bloques)
- Loops secuenciales que podrían ser Promise.all
- Manejo de errores faltante (llamadas a contratos sin try/catch)
- Dependencias de red hardcodeadas (debería usar config centralizada)
- Estado de wallet no manejado correctamente (loading, disconnected, wrong network)
- BigInt/BigNumber: conversiones incorrectas o inconsistentes
- Gas estimation y límites no considerados

## Performance
- Fetches que se repiten sin caché ni memoización
- Polling innecesario vs event listeners de blockchain
- Componentes grandes que podrían dividirse con lazy loading
- Imágenes y assets sin optimizar

## Seguridad
- Variables de entorno expuestas incorrectamente (VITE_ prefix en datos sensibles)
- Inputs del usuario sin sanitizar (DOMPurify ausente donde se necesita)
- Addresses no validadas antes de usarse en contratos

## Output
Para cada problema encontrado:
1. **Severidad**: Critical / Warning / Suggestion
2. **Ubicación**: línea o función específica
3. **Problema**: qué está mal y por qué
4. **Fix**: código concreto de cómo arreglarlo

Sé directo y específico. No menciones cosas que están bien.

$SELECTION
