// Imports de React y librerías
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../../assets/logo2.svg";

// Componente de pantalla de carga
const SplashScreen = ({ onFinish }) => {
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const fillTimer = setTimeout(() => {
      setFilled(true);
    }, 1900);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2600);

    return () => {
      clearTimeout(fillTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

// Renderizado del componente
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#fafafa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "relative",

          // Responsive
          width: "clamp(120px, 28vw, 220px)",
          height: "clamp(120px, 28vw, 220px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {filled && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: [0, 0.18, 0],
              scale: [0.9, 1.15, 1.2],
            }}
            transition={{
              duration: 1.4,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              inset: "-15%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.14) 0%, rgba(99,102,241,0.05) 35%, transparent 70%)",
              zIndex: 0,
              filter: "blur(22px)",
            }}
          />
        )}
        <img
          src={logo}
          alt="Evaluasaurio"
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            position: "absolute",
            inset: 0,
            opacity: 0.16,
            filter: "grayscale(1) brightness(0.4)",
            zIndex: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            zIndex: 2,
            WebkitMaskImage: `url(${logo})`,
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            WebkitMaskSize: "contain",
            maskImage: `url(${logo})`,
            maskRepeat: "no-repeat",
            maskPosition: "center",
            maskSize: "contain",
          }}
        >
          <motion.div
            initial={{ height: "0%" }}
            animate={{ height: "100%" }}
            transition={{
              duration: 2,
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              background:
                "linear-gradient(180deg, #2d2d2d 0%, #111111 100%)",
            }}
          />
          <motion.div
            animate={{
              x: [0, -30, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              bottom: "78%",
              left: "-15%",
              width: "130%",
              height: "12%",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "999px",
              filter: "blur(10px)",
            }}
          />
          <motion.div
            animate={{
              opacity: [0.12, 0.24, 0.12],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
            }}
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.06) 50%, transparent 80%)",
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;