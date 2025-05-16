# 🏛️ OpenVino DAO

OpenVino DAO es una aplicación de gobernanza descentralizada donde los usuarios pueden:
- Crear propuestas (como transferencias de ETH, USDC, OVI o llamadas a `split()` del token de governanza OVI).
- Votar por ellas utilizando su poder de voto.
- Ejecutar propuestas exitosas directamente desde la interfaz.
- Visualizar el historial completo de votos, acciones y estado on-chain.

---

## ⚙️ Funcionalidades

- ✏️ **Creación de Propuestas**:
  - Título, resumen y descripción enriquecida.
  - Acciones disponibles:
    - Transferencia de tokens (USDC, OVI).
    - Envío de ETH desde el `Timelock`.
    - Llamado a `split()` sobre el contrato OVI.

- 📊 **Votación y resultados**:
  - Soporte para múltiples tipos de voto: `For`, `Against`, `Abstain`.
  - Visualización de porcentajes y pesos de votos.

- 🔐 **Ejecución Segura**:
  - Al finalizar el período de votación, las propuestas pueden ser ejecutadas si fueron aprobadas.
  - Validación del `descriptionHash` y de los datos en `queue` y `execute`.

- 📦 **Integraciones**:
  - `thirdweb/react`, `ethers`, `react-hook-form`, `tailwindcss`, `react-router-dom`, `shadcn/ui`.

---

## 🧠 Contratos involucrados

- `Governor` — contrato principal de gobernanza.
- `TimelockController` — gestiona la cola y ejecución de propuestas.
- `OVI Token` — token ERC20 con función `split()`.
- `Treasury` — almacena los fondos de la DAO.

---

## 🧪 Testing Manual

1. Crear propuesta (ETH, token o split).
2. Votar con una wallet que tenga poder de voto.
3. Esperar el bloque de finalización.
4. Queue y luego execute.

---

## 🖥️ Estructura del proyecto

- `src/pages/Governance.tsx`: renderiza todas las propuestas.
- `src/pages/ViewProposal.tsx`: vista detallada de una propuesta.
- `src/pages/NewProposal`: wizard de creación.
- `src/hooks/useProposalById.ts`: lógica para extraer y decodificar propuestas desde la blockchain.
- `src/hooks/useAllProposals.ts`: recupera todas las propuestas desde el backend y la red.

---

## 📁 Variables de entorno requeridas

```env
VITE_GOVERNOR_ADDRESS=0x...
VITE_OVI_ADDRESS=0x...
VITE_TIMELOCK_ADDRESS=0x...
VITE_API_SECRET=...
VITE_API_URL=http://localhost:3001
```

---

## 🧾 Licencia

MIT © OpenVino 2025
