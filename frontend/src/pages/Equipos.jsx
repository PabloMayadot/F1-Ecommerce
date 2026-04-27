import { Link } from "react-router-dom";
import TeamCard from "../components/TeamCard";
import "../styles/equipos.css";

function Equipos() {
  const teams = [
    {
      id: 1,
      image: "/assets/img/2026redbullracingcarright.webp",
      title: "Red Bull Racing",
      car: "RB22",
      flag: "/assets/img/at-2.svg",
      drivers: ["Max Verstappen", "Isack Hadjar"],
      engine: "Red Bull Ford"
    },
    {
      id: 2,
      image: "/assets/img/2026mercedescarright.webp",
      title: "Mercedes-AMG",
      car: "W17",
      flag: "/assets/img/de-2.svg",
      drivers: ["George Russell", "Kimi Antonelli"],
      engine: "Mercedes-Benz"
    },
    {
      id: 3,
      image: "/assets/img/2026ferraricarright.webp",
      title: "Scuderia Ferrari",
      car: "SF-26",
      flag: "/assets/img/it-2.svg",
      drivers: ["Charles Leclerc", "Lewis Hamilton"],
      engine: "Ferrari"
    },
    {
      id: 4,
      image: "/assets/img/2026mclarencarright.webp",
      title: "McLaren",
      car: "MCL40",
      flag: "/assets/img/gb-2.svg",
      drivers: ["Lando Norris", "Oscar Piastri"],
      engine: "Mercedes"
    },
    {
      id: 5,
      image: "/assets/img/2026astonmartincarright.webp",
      title: "Aston Martin",
      car: "AMR26",
      flag: "/assets/img/gb-2.svg",
      drivers: ["Fernando Alonso", "Lance Stroll"],
      engine: "Honda"
    },
    {
      id: 6,
      image: "/assets/img/2026alpinecarright.webp",
      title: "Alpine",
      car: "A526",
      flag: "/assets/img/fr-2.svg",
      drivers: ["Pierre Gasly", "Franco Colapinto"],
      engine: "Mercedes"
    },
    {
      id: 7,
      image: "/assets/img/2026williamscarright.webp",
      title: "Williams",
      car: "FW48",
      flag: "/assets/img/gb-2.svg",
      drivers: ["Alex Albon", "Carlos Sainz"],
      engine: "Mercedes"
    },
    {
      id: 8,
      image: "/assets/img/2026racingbullscarright.webp.avif",
      title: "Visa Cash App RB",
      car: "VCARB 03",
      flag: "/assets/img/it-2.svg",
      drivers: ["Liam Lawson", "Arvid Lindblad"],
      engine: "Red Bull Ford"
    },
    {
      id: 9,
      image: "/assets/img/2026audicarright.webp",
      title: "Audi",
      car: "A-F1",
      flag: "/assets/img/de-2.svg",
      drivers: ["Nico Hülkenberg", "Gabriel Bortoleto"],
      engine: "Audi"
    },
    {
      id: 10,
      image: "/assets/img/2026haascarright.webp",
      title: "Haas F1 Team",
      car: "VF-26",
      flag: "/assets/img/us-2.svg",
      drivers: ["Esteban Ocon", "Ollie Bearman"],
      engine: "Ferrari"
    },
    {
      id: 11,
      image: "/assets/img/2026cadillaccarright.webp",
      title: "Cadillac Racing",
      car: "V-Series R",
      flag: "/assets/img/us-2.svg",
      drivers: ["Sergio Perez", "Valtteri Bottas"],
      engine: "Ferrari"
    }
  ];

  return (
    <div className="teams-page">
      <main>
        <h1>Equipos de Fórmula 1 Temporada 2026</h1>
        <div className="teams-grid">
          {teams.map((team) => (
            <TeamCard 
              key={team.id}
              image={team.image}
              title={team.title}
              car={team.car}
              flag={team.flag}
              drivers={team.drivers}
              engine={team.engine}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Equipos;
