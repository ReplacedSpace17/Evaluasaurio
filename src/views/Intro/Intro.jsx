import React, { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Space, Button, Spin, Drawer } from "antd";
import { DownOutlined, UpOutlined, MenuOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import "./navbar.css";
import logo from "../../assets/logo2.svg";
import texto from "../../assets/Logo.svg";
import { singularityWebsite, Github, Instagram, TikTok, Facebook, GithubRepo } from '../../config/urls';
import { getVisitado } from "../../functions/Localstorage.js";

const { Header, Content } = Layout;
const { SubMenu } = Menu;

const menuCommunity = [
  { key: "insta", label: <a href={Instagram} target="_blank" rel="noopener noreferrer">Instagram</a> },
  { key: "tiktok", label: <a href={TikTok} target="_blank" rel="noopener noreferrer">TikTok</a> },
  { key: "fb", label: <a href={Facebook} target="_blank" rel="noopener noreferrer">Facebook</a> },
  { key: "gh", label: <a href={Github} target="_blank" rel="noopener noreferrer">GitHub</a> },
];

const Intro = () => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);

  useEffect(() => {
    const visitado = getVisitado();
    if (!visitado) console.log("Primera visita");
    else navigate("/menu");

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const isMobile = windowWidth < 768;

  // Función para manejar click en items
  const handleClick = (key) => {
    switch (key) {
      case "1": navigate("/menu"); break;
      case "2": window.location.href = singularityWebsite; break;
      case "3": navigate("/docs"); break;
      case "5": window.location.href = "mailto:replacedspace17@singularitymx.org"; break;
      default: break;
    }
  };

  return (
    <Layout style={{ userSelect: "none" }}>
      {/* NAVBAR */}
      <Header style={{ position: "fixed", top: 0, zIndex: 100, width: "100%", height: "80px", backgroundColor: "#1b1b1bff", display: "flex", alignItems: "center", padding: "0 20px" }}>
        <motion.div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => navigate('/')}>
            <img src={logo} alt="Logo" style={{ height: 50 }} />
            {!isMobile && <img src={texto} alt="Texto Logo" style={{ height: 20 }} />}
          </div>

          {isMobile ? (
            <>
              <Button type="text" icon={<MenuOutlined />} onClick={() => setDrawerVisible(true)} style={{ color: "white", fontSize: "1.5rem" }} />
              <Drawer
                title="Menú"
                placement="right"
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
                bodyStyle={{ padding: 0 }}
              >
                <Menu
                  mode="vertical"
                  selectable={false}
                  onClick={({ key }) => { setDrawerVisible(false); handleClick(key); }}
                  whiteSpace="nowrap"
                  
                >
                  <Menu.Item key="1">Ir a Evaluasaurio</Menu.Item>
                  <Menu.Item key="2">Singularity</Menu.Item>
                  <Menu.Item key="3">Documentación</Menu.Item>

                  <SubMenu key="4" title="Comunidad">
                    {menuCommunity.map(item => (
                      <Menu.Item key={item.key}>{item.label}</Menu.Item>
                    ))}
                  </SubMenu>
                  <Menu.Item key="5">Contacto</Menu.Item>
                </Menu>
              </Drawer>
            </>
          ) : (
            <Menu
              theme="dark"
              mode="horizontal"
              selectable={false}
              style={{ background: "none", borderBottom: "none", display: "flex", alignItems: "center" }}
              onClick={({ key }) => handleClick(key)}
            >
              <Menu.Item key="1">Ir a Evaluasaurio</Menu.Item>
              <Menu.Item key="2">Singularity</Menu.Item>
              <Menu.Item key="3">Documentación</Menu.Item>
              <Menu.Item key="4">Contacto</Menu.Item>
             <SubMenu key="5" title="Comunidad">
  {menuCommunity.map(item => (
    <Menu.Item key={item.key}>{item.label}</Menu.Item>
  ))}
</SubMenu>


            </Menu>
          )}
        </motion.div>
      </Header>

      {/* CONTENIDO */}
      <Content style={{ padding: 0, width: "100%", height: "100vh", position: "relative", fontFamily: "Poppins, sans-serif", overflow: "hidden" }}>
        {isLoading && (
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#00000088", zIndex: 5 }}>
            <Spin tip="Cargando..." size="large" />
          </div>
        )}

        <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 0 }}>
          <Spline scene="https://prod.spline.design/V7pJi9-RDivyCVMi/scene.splinecode" onLoad={() => setIsLoading(false)} />
        </div>

        {/* PANEL DERECHO / MÓVIL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: isMobile ? "100%" : 600,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "2rem",
            background: "linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
            backdropFilter: "blur(15px)",
            borderLeft: isMobile ? "none" : "1px solid rgba(255, 255, 255, 0.3)",
            borderTopLeftRadius: isMobile ? 0 : "20px",
            borderBottomLeftRadius: isMobile ? 0 : "20px",
            boxShadow: isMobile ? "none" : "0 8px 32px rgba(0, 0, 0, 0.2)",
            zIndex: 10,
          }}
        >
          <motion.h1 style={{ fontSize: isMobile ? "2rem" : "3.5rem", fontWeight: "800", lineHeight: 1.2, color: "#111", marginBottom: "1rem" }}>
            <span style={{ color: "#0077FF" }}>Evaluasaurio:</span> la manera fácil de evaluar a tus docentes.
          </motion.h1>
          <p style={{ fontSize: "16px", color: "#333" }}>
            Descubre, aprende y contribuye a mejorar la experiencia educativa de tu escuela.
          </p>
         <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
  <motion.button
    style={{
      padding: "0.8rem 1.8rem",
      borderRadius: "12px",
      border: "2px solid #111",
      backgroundColor: "#111",
      color: "#fff",
      fontSize: "1rem",
      cursor: "pointer",
      fontWeight: 600,
    }}
    onClick={() => navigate("/menu")}
    whileHover={{ backgroundColor: "#fff", color: "#111", scale: 1.05 }} // invertido
  >
    🚀 Comenzar
  </motion.button>

  <motion.a
    style={{
      padding: "0.8rem 1.8rem",
      borderRadius: "12px",
      border: "2px solid #111",
      backgroundColor: "transparent",
      color: "#111",
      fontSize: "1rem",
      cursor: "pointer",
      fontWeight: 600,
      textDecoration: "none",
    }}
    href={GithubRepo}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ backgroundColor: "#111", color: "#fff", scale: 1.05 }} // invertido
  >
    GitHub
  </motion.a>
</div>

        </motion.div>
      </Content>
    </Layout>
  );
};

export default Intro;
