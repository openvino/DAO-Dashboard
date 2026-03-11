# Fix: useAllProposals Hook

Este hook tiene problemas conocidos de performance en este proyecto. Analiza y reescribe `src/hooks/useAllProposals.ts` para corregir:

## Problemas a resolver

1. **sleep(3000) para estimar blockTime**: Ineficiente. Base Sepolia tiene ~2 segundos por bloque. Usa ese valor directamente o lee de un endpoint de la chain.

2. **Loop secuencial con sleep(250)**: El `for` loop que procesa proposals de una en una con 250ms de delay es muy lento. Reemplaza con `Promise.all` o `Promise.allSettled` con concurrencia controlada (lotes de 5-10).

3. **didRunRef pattern**: Es un workaround para StrictMode. En su lugar, usa un `AbortController` apropiado o restructura para que el doble-fetch en StrictMode no cause problemas.

4. **queryFilter por propuesta**: Se llama `queryFilter` una vez por propuesta. Considera hacer una sola llamada `queryFilter` para todos los proposals en el rango de bloques y luego mapear.

5. **No hay caché**: Los proposals no cambian frecuentemente. Considera agregar un caché simple con `sessionStorage` o un timeout de revalidación.

6. **Error handling**: Los errores individuales se swallean silenciosamente. Devuelve proposals parciales con un campo `error` por propuesta, o al menos acumula los errores.

## Implementa la versión mejorada

Lee el archivo actual primero, luego reescríbelo con todos estos problemas corregidos. Mantén la misma API de retorno `{ proposals, loading, error }` pero agregar `refetch` como función opcional.

Lee: src/hooks/useAllProposals.ts
