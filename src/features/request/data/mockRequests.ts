import { Request } from "../components/RequestCard";

export const mockRequests: Request[] = [
  {
    id: "1",
    title: "Reparación de cañería en cocina",
    description: "Necesito reparar una fuga en la cañería de la cocina. El agua está goteando constantemente y necesito que alguien lo revise y repare lo antes posible.",
    category: "Plomería",
    subcategory: "Reparaciones",
    location: {
      address: "Av. Corrientes 1234",
      city: "Buenos Aires",
      province: "CABA",
    },
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
    ],
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
    userRole: "client",
    client: {
      name: "María",
      lastName: "González",
    },
    users: [
      {
        id: "prof1",
        name: "Carlos",
        lastName: "Rodríguez",
        role: "professional",
      },
      {
        id: "prof2",
        name: "Ana",
        lastName: "Martínez",
        role: "professional",
      },
    ],
  },
  {
    id: "2",
    title: "Instalación de aire acondicionado",
    description: "Quiero instalar un aire acondicionado split en mi habitación. El espacio ya está preparado con la instalación eléctrica necesaria.",
    category: "Climatización",
    subcategory: "Instalaciones",
    location: {
      address: "Calle Florida 567",
      city: "Buenos Aires",
      province: "CABA",
    },
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    ],
    status: "in_progress",
    createdAt: "2024-01-14T15:45:00Z",
    userRole: "client",
    client: {
      name: "Juan",
      lastName: "Pérez",
    },
    users: [
      {
        id: "prof3",
        name: "Roberto",
        lastName: "López",
        role: "professional",
      },
    ],
  },
  {
    id: "3",
    title: "Pintura de habitación",
    description: "Necesito pintar una habitación de 4x3 metros. Ya tengo la pintura, solo necesito que alguien haga el trabajo.",
    category: "Pintura",
    subcategory: "Interiores",
    location: {
      address: "Belgrano 890",
      city: "Buenos Aires",
      province: "CABA",
    },
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    ],
    status: "completed",
    createdAt: "2024-01-10T09:15:00Z",
    userRole: "client",
    client: {
      name: "Laura",
      lastName: "Fernández",
    },
    users: [
      {
        id: "prof4",
        name: "Miguel",
        lastName: "García",
        role: "professional",
      },
    ],
  },
  {
    id: "4",
    title: "Reparación de puerta",
    description: "La puerta del baño no cierra bien, parece que se desajustó la bisagra. Necesito que alguien la ajuste.",
    category: "Carpintería",
    subcategory: "Reparaciones",
    location: {
      address: "Palermo 234",
      city: "Buenos Aires",
      province: "CABA",
    },
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    ],
    status: "cancelled",
    createdAt: "2024-01-08T14:20:00Z",
    userRole: "client",
    client: {
      name: "Pedro",
      lastName: "Silva",
    },
    users: [
      {
        id: "prof5",
        name: "Diego",
        lastName: "Morales",
        role: "professional",
      },
      {
        id: "prof6",
        name: "Sofía",
        lastName: "Vargas",
        role: "professional",
      },
      {
        id: "prof7",
        name: "Luis",
        lastName: "Herrera",
        role: "professional",
      },
    ],
  },
  // Solicitudes desde perspectiva de profesional
  {
    id: "5",
    title: "Mantenimiento de calefacción",
    description: "El sistema de calefacción no funciona correctamente. Necesito que lo revisen y reparen.",
    category: "Climatización",
    subcategory: "Mantenimiento",
    location: {
      address: "San Telmo 456",
      city: "Buenos Aires",
      province: "CABA",
    },
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    ],
    status: "pending",
    createdAt: "2024-01-16T08:30:00Z",
    userRole: "professional",
    client: {
      name: "Carmen",
      lastName: "Ruiz",
    },
    users: [
      {
        id: "client1",
        name: "Carmen",
        lastName: "Ruiz",
        role: "client",
      },
    ],
  },
  {
    id: "6",
    title: "Instalación de persianas",
    description: "Necesito instalar persianas en 3 ventanas del living. Ya tengo las persianas compradas.",
    category: "Carpintería",
    subcategory: "Instalaciones",
    location: {
      address: "Recoleta 789",
      city: "Buenos Aires",
      province: "CABA",
    },
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
    ],
    status: "in_progress",
    createdAt: "2024-01-13T11:20:00Z",
    userRole: "professional",
    client: {
      name: "Elena",
      lastName: "Torres",
    },
    users: [
      {
        id: "client2",
        name: "Elena",
        lastName: "Torres",
        role: "client",
      },
    ],
  },
];

export const getMockRequestsByTab = (
  userRole: "client" | "professional",
  activeTab: string
): Request[] => {
  if (userRole === "client") {
    switch (activeTab) {
      case "sent":
        return mockRequests.filter(req => req.userRole === "client" && req.status !== "completed");
      case "completed":
        return mockRequests.filter(req => req.userRole === "client" && req.status === "completed");
      default:
        return [];
    }
  } else {
    switch (activeTab) {
      case "received":
        return mockRequests.filter(req => req.userRole === "professional" && req.status !== "completed");
      case "completed":
        return mockRequests.filter(req => req.userRole === "professional" && req.status === "completed");
      default:
        return [];
    }
  }
}; 