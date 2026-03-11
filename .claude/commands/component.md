# Component Review — React + Tailwind + Radix UI

Revisa este componente React. El proyecto usa TypeScript estricto, Tailwind CSS, Radix UI primitives, y shadcn/ui patterns.

## Análisis

### Estructura & Responsabilidad
- ¿El componente hace demasiado? (más de ~150 líneas es señal de alerta)
- ¿La lógica de negocio debería estar en un hook separado?
- ¿Hay lógica de UI mezclada con lógica de datos?
- ¿Hay componentes internos que deberían extraerse?

### Props & Tipado
- ¿Las props tienen tipos correctos y precisos (no `any`, no `object`)?
- ¿Hay props que siempre se pasan juntas y deberían agruparse?
- ¿El componente acepta `children` correctamente (`React.ReactNode`)?
- ¿Hay props opcionales que deberían tener defaults?

### Tailwind & Estilos
- ¿Las clases de Tailwind están ordenadas (layout → spacing → visual)?
- ¿Se usa `cn()` (clsx + tailwind-merge) para clases condicionales?
- ¿Hay valores hardcodeados que deberían usar tokens de diseño?
- ¿El componente es responsive? ¿Hay breakpoints faltantes?
- ¿Dark mode considerado si aplica?

### Accesibilidad (a11y)
- ¿Botones interactivos tienen `aria-label` o texto visible?
- ¿Los roles ARIA son correctos? ¿Se abusa de `div` donde debería haber `button` o `a`?
- ¿El foco se maneja correctamente en modales y dropdowns?
- ¿Hay alt text en imágenes?
- ¿Los colores tienen suficiente contraste?

### Radix UI
- ¿Se usan correctamente los primitivos de Radix (Dialog, DropdownMenu, etc.)?
- ¿Los `asChild` se usan apropiadamente?
- ¿Se controla el estado correctamente (controlled vs uncontrolled)?

### Performance
- ¿El componente debería estar memoizado con `React.memo`?
- ¿Hay handlers que deberían usar `useCallback`?
- ¿Hay computaciones costosas que deberían usar `useMemo`?

## Output
Lista los problemas por categoría con severidad (Critical / Warning / Suggestion) y el fix concreto. Si hay una reestructuración significativa necesaria, muestra el componente refactorizado.

$SELECTION
