# Generar nuevo hook Web3

Crea un nuevo custom hook para esta DAO. El proyecto usa:
- thirdweb v5 (`useActiveAccount`, `sendTransaction`, `ethers5Adapter`)
- ethers.js v5 para interacción con contratos
- Base Sepolia (chain ID: 84532)
- Contrato Governor en `import.meta.env.VITE_GOVERNOR_ADDRESS`
- Token en `import.meta.env.VITE_TOKEN_ADDRESS`

## Descripción del hook a crear
$ARGUMENTS

## Estructura requerida para el hook

```typescript
export function useXxx() {
  // Estado con useReducer si hay múltiples estados relacionados
  // AbortController para cancelación en cleanup
  // Manejo de: loading, error, data, y opcionalmente refetch

  return { data, loading, error, refetch? }
}
```

## Requisitos que debe cumplir

1. **Cancelación**: `useEffect` cleanup que aborte fetches pendientes
2. **Tipos**: Sin `any`, tipos de retorno explícitos
3. **Errores**: Distingue errores de red, errores de contrato (revert), y `user rejected`
4. **Estado de wallet**: Maneja `account === undefined` (no conectado)
5. **StrictMode safe**: No usar `didRunRef` — usa cleanup correcto
6. **Imports**: Desde los paths correctos del proyecto (`@/src/...`)

Crea el archivo en `src/hooks/` con el nombre apropiado para la funcionalidad.
