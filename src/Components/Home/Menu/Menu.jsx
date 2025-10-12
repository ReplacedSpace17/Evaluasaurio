import React, { useState, useEffect } from "react";
import docentes from "../../../assets/icons/docentes.svg";
import departamentos from "../../../assets/icons/departamentos.svg";
import Card_menu from "./Card_menu";

const Menu_component = ({ title, width }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        width: width,
        backgroundColor: "none",
        display: "flex",
        flexDirection: "column",
        marginTop: 15,
        userSelect: "none",
      }}
    >
      <h2
        style={{
          fontSize: "17px",
          fontWeight: 400,
          marginBottom: 12,
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "row" : "row",
          flexWrap: isMobile ? "wrap" : "nowrap", // wrap para móvil
          gap: 12,
        }}
      >
        <Card_menu
          width={150}
          height={150}
          icon={docentes}
          text="Docentes"
          navigate="/evaluaciones/docentes"
          mobile={isMobile}
        />
        <Card_menu
          width={150}
          height={150}
          icon={departamentos}
          text="Departamentos"
          navigate="/evaluaciones/departamentos"
          mobile={isMobile}
        />
        {/* Puedes agregar más Card_menu */}
      </div>
    </div>
  );
};

export default Menu_component;
