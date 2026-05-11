
// Imports de React y librerías

/* 
Componente de la sección hero de la página de introducción, con título, descripción, botones y animaciones.
*/

import React from "react";
import { motion } from "framer-motion";
import { Button, Grid } from "antd";
import {
  CaretRightFilled,
  GithubOutlined,
} from "@ant-design/icons";
import fondo from "../assets/fondoComp1.svg";


const { useBreakpoint } = Grid;

// Componente de la sección hero
const HeroSection = () => {
  const screens = useBreakpoint();

  const isMobile = !screens.md;

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "calc(100vh - 72px)",
        maxWidth: "1700px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: isMobile ? "24px 18px" : "40px 24px",
        background: `
          url(${fondo}) no-repeat center center,
          #fafafa
        `,
        backgroundSize: "cover",
        boxSizing: "border-box",
        overflow: "hidden",
        borderLeft: "1.5px solid rgba(0, 0, 0, 0.12)",
        borderRight: "1.5px solid rgba(0, 0, 0, 0.12)",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "2000px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.1,
          }}
          style={{
            marginTop: isMobile ? 50 : 180,
            fontSize: isMobile
              ? "clamp(2.2rem, 10vw, 3.2rem)"
              : "clamp(2.8rem, 7vw, 4.5rem)",
            lineHeight: isMobile ? 1.12 : 1.3,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#111",
            maxWidth: "1500px",
            paddingInline: isMobile ? "4px" : 0,
            fontFamily:
              "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Evaluación docente anónima, abierta y transparente.
        </motion.h1>

        {/* Descripción */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
          style={{
            marginTop: isMobile ? "22px" : "30px",
            maxWidth: isMobile ? "95%" : "1100px",
            fontSize: isMobile
              ? "1.02rem"
              : "clamp(1.05rem, 1.8vw, 2rem)",
            lineHeight: isMobile ? 1.55 : 1.25,
            color: "#505050",
            fontWeight: 300,
            paddingInline: isMobile ? "8px" : 0,
            fontFamily:
              "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Diseñado para recopilar retroalimentación estudiantil de manera
          simple, accesible y confiable, facilitando procesos de evaluación
          docente.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.3,
          }}
          style={{
            marginTop: isMobile ? "34px" : "40px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "14px" : "18px",
              width: isMobile ? "100%" : "auto",
              maxWidth: isMobile ? "360px" : "none",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Primary */}
            <Button
              type="primary"
              icon={<CaretRightFilled />}
              block={isMobile}
              style={{
                height: isMobile ? "58px" : "64px",
                width: isMobile ? "100%" : "240px",
                borderRadius: "14px",
                background: "#111",
                borderColor: "#111",
                fontWeight: 600,
                fontSize: isMobile ? "17px" : "20px",
                boxShadow:
                  "0 8px 24px rgba(0,0,0,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily:
                  "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Ir a Evaluasaurio
            </Button>

            {/* Secondary */}
            <Button
              icon={<GithubOutlined />}
              block={isMobile}
              style={{
                height: isMobile ? "58px" : "64px",
                width: isMobile ? "100%" : "240px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.72)",
                border: "1.5px solid rgba(0, 0, 0, 0.14)",
                color: "#111",
                fontWeight: 600,
                fontSize: isMobile ? "17px" : "20px",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily:
                  "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Ver en GitHub
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll  */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1,
            duration: 0.8,
          }}
          style={{
            position: "absolute",
            bottom: "34px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {/* Mouse */}
          <div
            style={{
              width: "30px",
              height: "52px",
              border: "1.5px solid rgba(0, 0, 0, 0.98)",
              borderRadius: "999px",
              display: "flex",
              justifyContent: "center",
              paddingTop: "8px",
              boxSizing: "border-box",
            }}
          >
            <motion.div
              animate={{
                y: [0, 12, 0],
                opacity: [1, 0.3, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: "easeInOut",
              }}
              style={{
                width: "4px",
                height: "10px",
                borderRadius: "999px",
                background: "rgb(0, 0, 0)",
              }}
            />
          </div>

          {/* Texto */}
          <motion.span
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            style={{
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(0, 0, 0, 1)",
              fontWeight: 500,
              fontFamily:
                "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            Scroll
          </motion.span>
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;