import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaTrash } from "react-icons/fa";

const Halloween = () => {
  const profesores = [
    {
      id: 1,
      nombre: "Dr. John Doe",
      departamento: "Ciencias de la Computación",
      evaluaciones: 45,
      promedio: 4.8,
    },
    {
      id: 2,
      nombre: "Mtra. Sarah López",
      departamento: "Ingeniería Eléctrica",
      evaluaciones: 32,
      promedio: 3.9,
    },
    {
      id: 3,
      nombre: "Ing. Carlos Pérez",
      departamento: "Sistemas Digitales",
      evaluaciones: 21,
      promedio: 2.7,
    },
  ];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleAction = (dir) => {
    setDirection(dir);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % profesores.length);
    }, 300);
  };

  const current = profesores[index];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #000000, #1a1a1a, #2d2d2d)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", color: "#ff7b00", marginBottom: "0.5rem" }}>
        🎃 Evalusaurio v1.2.0
      </h1>
      <p style={{ color: "#bbb", marginBottom: "2rem", textAlign: "center" }}>
        ¡Evento de Halloween! Evalúa al profesor más aterrador del campus 👻
      </p>

      <div
        style={{
          position: "relative",
          width: "320px",
          height: "440px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence>
          <motion.div
            key={current.id}
            initial={{
              x: direction === 1 ? 300 : -300,
              opacity: 0,
              rotate: direction === 1 ? 15 : -15,
            }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{
              x: direction === 1 ? -300 : 300,
              opacity: 0,
              rotate: direction === 1 ? -15 : 15,
            }}
            transition={{ duration: 0.4 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, info) => {
              if (info.offset.x > 100) handleAction(1);
              else if (info.offset.x < -100) handleAction(-1);
            }}
            style={{
              position: "absolute",
              width: "320px",
              height: "440px",
              background:
                "linear-gradient(145deg, rgba(30,30,30,0.95), rgba(50,20,0,0.9))",
              border: "2px solid rgba(255,120,0,0.4)",
              borderRadius: "20px",
              boxShadow: "0 0 20px rgba(255,120,0,0.3)",
              padding: "30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              userSelect: "none",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,120,0,0.9), rgba(180,60,0,0.6))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                color: "white",
                marginBottom: "20px",
                boxShadow: "0 0 20px rgba(255,120,0,0.5)",
              }}
            >
              {current.nombre.charAt(0)}
            </div>

            <h2 style={{ fontSize: "1.5rem", color: "#ffa44f", marginBottom: "5px" }}>
              {current.nombre}
            </h2>
            <p style={{ fontStyle: "italic", color: "#ddd" }}>{current.departamento}</p>

            <p style={{ marginTop: "15px", color: "#999" }}>
              Evaluaciones: {current.evaluaciones}
            </p>
            <p style={{ color: "#999", marginBottom: "25px" }}>
              Promedio: {current.promedio}
            </p>

            <div style={{ display: "flex", gap: "50px", marginTop: "15px" }}>
              <button
                onClick={() => handleAction(-1)}
                style={{
                  backgroundColor: "#ff4040",
                  border: "none",
                  color: "white",
                  padding: "15px",
                  borderRadius: "50%",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  boxShadow: "0 0 10px rgba(255,64,64,0.5)",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                <FaTrash />
              </button>

              <button
                onClick={() => handleAction(1)}
                style={{
                  backgroundColor: "#2ecc71",
                  border: "none",
                  color: "white",
                  padding: "15px",
                  borderRadius: "50%",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  boxShadow: "0 0 10px rgba(46,204,113,0.5)",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                <FaHeart />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Halloween;
