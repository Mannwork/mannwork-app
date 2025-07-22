export const formatTime = (timestamp: string) => {
        try {
            const date = new Date(timestamp);

            // Formatear la hora en formato HH:MM
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");

            // Determinar si es hoy, ayer o la fecha completa
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (date.toDateString() === today.toDateString()) {
                return `Hoy ${hours}:${minutes}`;
            } else if (date.toDateString() === yesterday.toDateString()) {
                return `Ayer ${hours}:${minutes}`;
            } else {
                // Formato: DD/MM/YYYY HH:MM
                const day = date.getDate().toString().padStart(2, "0");
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                const year = date.getFullYear();
                return `${day}/${month}/${year} ${hours}:${minutes}`;
            }
        } catch (error) {
            console.error("Error formateando la fecha:", error);
            return timestamp;
        }
    };