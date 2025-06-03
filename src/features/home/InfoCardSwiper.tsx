import { useState } from "react";
import InfoCard from "./InfoCard";

const infoCards = [
  {
    id: "perfil",
    title: "¡Completa tu perfil!",
    description:
      "Completa tu perfil para acceder a más funciones y oportunidades. Así otros usuarios podrán confiar más en ti y tendrás acceso a más servicios.",
    type: "perfil",
  },
  {
    id: "membresia",
    title: "¡Activa tu membresía!",
    description:
      "Obtén beneficios exclusivos activando tu membresía y disfruta de todos los beneficios de la app.",
    type: "membresia",
  },
];

const InfoCardSwiper = () => {
  const [visibleCards, setVisibleCards] = useState(infoCards);

  const dismissCard = () => {
    setVisibleCards((cards) => cards.slice(1));
  };

  if (!visibleCards[0]) return null;

  return (
    <InfoCard
      title={visibleCards[0].title}
      description={visibleCards[0].description}
      onClose={dismissCard}
    />
  );
};

export default InfoCardSwiper;
