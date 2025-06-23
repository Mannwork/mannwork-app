# Feature: Requests (Solicitudes)

Esta feature maneja la visualización y gestión de solicitudes de trabajo en la aplicación Mannwork.

## Estructura

```
src/features/request/
├── components/
│   ├── RequestsHeader.tsx          # Header con título y botones de acción
│   ├── RequestsTabs.tsx            # Tabs condicionales según rol del usuario
│   ├── RequestCard.tsx             # Card individual de solicitud
│   ├── RequestsList.tsx            # Lista de solicitudes con pull-to-refresh
│   ├── EmptyRequestsState.tsx      # Estado vacío con call-to-action
│   ├── RequestStatusBadge.tsx      # Badge de estado de solicitud
│   ├── RequestImages.tsx           # Galería de imágenes de la solicitud
│   ├── RequestLocation.tsx         # Información de ubicación
│   ├── LoadingState.tsx            # Estado de carga
│   └── RequestDetailModal.tsx      # Modal a pantalla completa con detalle completo
├── hooks/
│   └── useUserRole.ts              # Hook para obtener rol del usuario
├── data/
│   └── mockRequests.ts             # Datos mock para desarrollo
├── index.ts                        # Exportaciones de la feature
└── README.md                       # Esta documentación
```

## Rutas

```
src/app/(protected)/(mainTabs)/requests/
├── index.tsx                       # Lista principal de solicitudes
├── [requestId].tsx                 # Detalle de solicitud específica
└── create.tsx                      # Crear nueva solicitud
```

## Componentes

### RequestsHeader

Header principal con:

- Título "Solicitudes"
- Botón de búsqueda
- Botón de crear nueva solicitud

### RequestsTabs

Tabs condicionales según el rol del usuario:

- **Cliente**: "Solicitudes enviadas" y "Solicitudes completadas"
- **Profesional**: "Solicitudes recibidas" y "Solicitudes completadas"

### RequestCard

Card que muestra toda la información de una solicitud:

- Título y descripción
- Categoría y subcategoría
- **Información de usuarios:**
  - **Para Clientes**: Muestra nombre y primera letra del apellido de los profesionales
  - **Para Profesionales**: Muestra nombre y primera letra del apellido del cliente
- Ubicación
- Imágenes (máximo 3 con contador)
- Estado de la solicitud
- Fecha de creación
- Botón "Ver detalles"

### RequestDetailModal

Modal a pantalla completa con información completa de la solicitud:

- **Galería de imágenes**: Scroll horizontal con imágenes grandes
- **Información detallada**: Título, descripción completa, categoría, ubicación
- **Estados**: Estado del servicio y estado del pago
- **Usuarios involucrados**: Lista completa con avatares y botón de contacto
- **Acciones específicas por rol**:
  - **Profesionales**: Iniciar trabajo (solo si está pendiente) y cancelar
  - **Clientes**: Solo cancelar solicitud
- **Navegación**: Botón de retroceso y scroll completo

### RequestsList

Lista de solicitudes con:

- Pull-to-refresh
- Estado vacío integrado
- Scroll infinito (futuro)

### EmptyRequestsState

Estado vacío con:

- Mensajes personalizados según rol y tab
- Call-to-action apropiado
- Iconografía descriptiva

## Estados de Solicitud

- `pending`: Pendiente
- `in_progress`: En progreso
- `completed`: Completada
- `cancelled`: Cancelada

## Estados de Pago

- `pending`: Pendiente de pago
- `partial`: Pago parcial
- `completed`: Pagado
- `cancelled`: Cancelado

## Acciones por Rol y Estado

### Profesionales

- **Solicitud Pendiente**:
  - ✅ Iniciar trabajo
  - ✅ Cancelar solicitud
- **Solicitud En Progreso**:
  - ❌ Iniciar trabajo (no disponible)
  - ✅ Cancelar solicitud
- **Solicitud Completada/Cancelada**:
  - ❌ Sin acciones disponibles

### Clientes

- **Solicitud Pendiente**:
  - ✅ Cancelar solicitud
- **Solicitud En Progreso**:
  - ✅ Cancelar solicitud
- **Solicitud Completada/Cancelada**:
  - ❌ Sin acciones disponibles

## Visualización de Usuarios

### Para Clientes

- **Un profesional**: "Carlos R."
- **Múltiples profesionales**: "Carlos R. y 2 más"

### Para Profesionales

- **Cliente**: "María G."

## Hooks

### useUserRole

Hook que obtiene el rol del usuario desde Supabase:

```typescript
const { data: userRole, isLoading } = useUserRole();
```

## Datos Mock

Los datos mock incluyen solicitudes de ejemplo con diferentes estados y categorías para facilitar el desarrollo y testing. Incluyen información de usuarios tanto para clientes como para profesionales.

## Uso

### Vista Principal

```typescript
import {
  RequestsHeader,
  RequestsTabs,
  RequestsList,
  useUserRole,
  getMockRequestsByTab,
} from "@/features/request";

const RequestsScreen = () => {
  const { data: userRole } = useUserRole();
  const requests = getMockRequestsByTab(userRole, activeTab);

  const handleRequestPress = (request: Request) => {
    router.push({
      pathname: "/(protected)/(mainTabs)/requests/[requestId]",
      params: { requestId: request.id },
    });
  };

  return (
    <View>
      <RequestsHeader onSearch={handleSearch} onCreate={handleCreate} />
      <RequestsTabs
        userRole={userRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <RequestsList
        requests={requests}
        userRole={userRole}
        activeTab={activeTab}
        onRequestPress={handleRequestPress}
      />
    </View>
  );
};
```

### Vista de Detalle

```typescript
import {
  RequestDetailModal,
  useUserRole,
  getMockRequestsByTab,
} from "@/features/request";

const RequestDetailScreen = () => {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
  const { data: userRole } = useUserRole();

  // Obtener la solicitud específica
  const allRequests = userRole
    ? [
        ...getMockRequestsByTab(userRole, "sent"),
        ...getMockRequestsByTab(userRole, "completed"),
        ...getMockRequestsByTab(userRole, "received"),
      ]
    : [];

  const request = allRequests.find((req) => req.id === requestId);

  return (
    <RequestDetailModal
      request={request}
      currentUserRole={userRole}
      isVisible={true}
      onClose={() => router.back()}
      onContact={handleContact}
      onUpdateStatus={handleUpdateStatus}
    />
  );
};
```

## Funcionalidades del Modal de Detalle

### Información Visual

- **Imágenes**: Galería horizontal con imágenes grandes (320x240px)
- **Estados**: Badges de color para servicio y pago
- **Usuarios**: Avatares con iniciales y información completa

### Interacciones

- **Contactar**: Navega al chat con el usuario
- **Acciones específicas**: Según rol y estado de la solicitud
- **Navegación**: Botón de retroceso para cerrar

### Responsive Design

- Safe area handling
- Scroll vertical para contenido largo
- Scroll horizontal para imágenes
- Botones de acción accesibles

## Navegación

### Rutas Disponibles

- `/(protected)/(mainTabs)/requests/` - Lista principal
- `/(protected)/(mainTabs)/requests/[requestId]` - Detalle de solicitud
- `/(protected)/(mainTabs)/requests/create` - Crear solicitud

### Navegación Programática

```typescript
// Ir al detalle de una solicitud
router.push({
  pathname: "/(protected)/(mainTabs)/requests/[requestId]",
  params: { requestId: "123" },
});

// Volver atrás
router.back();
```

## Próximas Mejoras

- [ ] Integración con API real de Supabase
- [ ] Búsqueda y filtros avanzados
- [ ] Paginación infinita
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Analytics de uso
- [ ] Chat integrado entre usuarios
- [ ] Sistema de calificaciones
- [ ] Historial de cambios de estado
- [ ] Comentarios y notas en solicitudes
- [ ] Confirmación antes de cancelar
- [ ] Notificaciones de cambios de estado
