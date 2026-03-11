# Web3 / DAO Patterns Review

Revisa el código seleccionado con foco en patrones Web3 específicos para esta DAO en Base Sepolia (Governor Bravo / OpenZeppelin Governor, thirdweb v5, ethers v5).

## Checklist de patrones DAO

### Estados del Governor
Verifica que se manejan todos los estados posibles del contrato Governor:
`Pending | Active | Canceled | Defeated | Succeeded | Queued | Expired | Executed`
- ¿Hay casos donde se asume que solo existen algunos estados?
- ¿El UI se comporta correctamente en cada estado (botones deshabilitados, mensajes correctos)?

### Votación
- ¿Se valida que el usuario tenga tokens delegados antes de mostrar el botón de votar?
- ¿Se verifica el `quorum` y `votingPower` del usuario en el snapshot block (no el bloque actual)?
- ¿Se maneja el caso de doble voto (ya votó)?
- ¿Los votos se muestran en unidades correctas (wei vs tokens formateados)?

### Proposals
- ¿Se usa el `proposalId` correcto (hash de los parámetros, no un ID incremental)?
- ¿Las `targets`, `values`, `calldatas` están correctamente encoded para ejecutar acciones?
- ¿Se maneja el período de `timelock` antes de ejecutar una propuesta Succeeded?

### Transacciones
- ¿Se muestra feedback al usuario durante: firma → pending → confirmado → error?
- ¿Se espera confirmaciones suficientes antes de actualizar el UI?
- ¿Se maneja `user rejected` (código 4001) diferente a otros errores?
- ¿Se invalida/refresca el estado local después de una transacción exitosa?

### Wallet & Red
- ¿Se verifica que el usuario está en la red correcta (Base Sepolia)?
- ¿Qué pasa si el usuario desconecta la wallet a mitad de un flujo?
- ¿Se maneja `account changed` del provider?

### thirdweb v5 específico
- ¿Se usa `useActiveAccount()` correctamente (puede ser undefined)?
- ¿Las transacciones usan `sendTransaction` con manejo de estado?
- ¿Se usa `ethers5Adapter` correctamente para puentes entre thirdweb y ethers?

## Output
Para cada problema:
1. **Categoría**: (Voting / Transaction / State / Network / Security)
2. **Riesgo**: (Funds at risk / UX broken / Minor UX issue)
3. **Descripción del problema**
4. **Fix recomendado** con código

$SELECTION
