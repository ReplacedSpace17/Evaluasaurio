// Intro.jsx
//Imports de React y librerías
import React from "react";
import { Layout, Grid } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../../../assets/logo2.svg";
import texto from "../../../assets/Logo.svg";

// Componentes
import HeroSection from "../components/Component1.jsx";

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

const Intro = () => {
  const navigate = useNavigate();

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        userSelect: "none",
      }}
    >
      {/* NAVBAR */}
      <Header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          width: "100%",
          height: "72px",
          background: "rgba(40,40,40,0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "0 18px" : "0 24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            width: "100%",
            maxWidth: "1400px",
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile
              ? "center"
              : "space-between",
            willChange: "opacity, transform",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Icono */}
            <img
              src={logo}
              alt="Evaluasaurio"
              draggable={false}
              style={{
                height: isMobile ? "40px" : "44px",
                width: isMobile ? "40px" : "44px",
                objectFit: "contain",
                userSelect: "none",
                pointerEvents: "none",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            />

            {/* Texto */}
            <img
              src={texto}
              alt="Evaluasaurio"
              draggable={false}
              style={{
                height: isMobile ? "16px" : "18px",
                objectFit: "contain",
                opacity: 0.92,
                userSelect: "none",
                pointerEvents: "none",
                imageRendering: "auto",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
        </motion.div>
      </Header>

      {/* CONTENIDO */}
      <Content
        style={{
          marginTop: "72px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <HeroSection />
      </Content>
    </Layout>
  );
};

export default Intro;