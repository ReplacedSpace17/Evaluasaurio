import React from "react";
import Card_event from "./Card_event";

const Eventos = ({ title, data, width }) => {
  return (
    <div
      style={{
        width: width,
        backgroundColor: "none",
        display: "flex",
        flexDirection: "column",
        marginTop: 15,
        padding: 0,
        borderRadius: 18,
        userSelect: "none",
      }}
    >
      <h2
        style={{
          fontSize: "17px",
          fontWeight: 400,
          marginBottom: 10,
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "12px", // espacio entre eventos
          backgroundColor: "#FFFFFF",
          padding: 20,
          borderRadius: 18,
          border: "1px solid #D1D9E0",
        }}
      >
        <h3
          style={{
            fontSize: "15px",
            fontWeight: "bold",
            color: "#25292E",
            marginBottom: 8,
          }}
        >
          Disponibles este mes
        </h3>

        {/* Mapear eventos visibles */}
        {data
          .filter((event) => event.visible)
          .map((event, index) => (
            <Card_event
              key={index}
              title={event.name}
              image={event.img} // usa la ruta directamente
              description={event.descripcion}
              navigate={event.navigate}
              launchDate={event.date_lanzamiento}
              finalDate={event.date_finalizacion}
              url={event.navigate}
            />
          ))}
      </div>
    </div>
  );
};

export default Eventos;
