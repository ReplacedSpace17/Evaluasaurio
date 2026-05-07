
import React, { useState, useEffect } from "react";
import { Layout, Button } from "antd";
import { MenuOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import "./Home.css";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import Publications from "../../Components/Publications";
import { useNavigate } from "react-router-dom";
import texto from "../../assets/Logo.svg";
import logo from "../../assets/logo2.svg";
const { Header, Sider, Content } = Layout;
import backend from "../../config/backend";
import { motion } from "framer-motion";
import FeedReports from "./ReportList";
const Reportes_form = () => {

 const [sidebarVisible, setSidebarVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    if (window.innerWidth < 768) setSidebarVisible(false);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 768 && sidebarVisible) setSidebarVisible(false);
    if (windowWidth >= 768 && !sidebarVisible) setSidebarVisible(true);
  }, [windowWidth]);

  const toggleSidebar = () => setSidebarVisible((v) => !v);

  const handleFloatButtonClick = () => {
   navigate('/reports/submit');
    // Aquí puedes abrir un modal, ir a otra página, etc.
  };

  return (
    <Layout style={{ height: "100vh", overflow: "hidden", margin: 0, width: "100vw" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#193961",
          color: "white",
          padding: "0 16px",
          flexShrink: 0,
          
        }}
      >
       <div
  style={{
    fontWeight: "bold",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginLeft: 16,
    backgroundColor:"none"
  }}
  onClick={() => navigate('/')}
>
  <img src={logo} alt="Logo" style={{ height: 40, marginRight: 8 }} />
  {/* Solo mostrar el texto/logo secundario si la pantalla es >= 768px */}
  {windowWidth >= 768 && (
    <img src={texto} alt="Texto Logo" style={{ height: 20, marginRight: 8 }} />
  )}
</div>

        

        

        
      </Header>

      <Layout style={{ height: "calc(100vh - 64px)" }}>
        
        <Content style={{ padding: 24, background: "#ffffffff", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Layout style={{ maxWidth:800, minWidth:350, width: '80%', height: "100%", overflowY: "auto" , backgroundColor: "transparent" }}>
            <motion.h1 style={{ fontSize:  "1.1rem" , fontWeight: "600", lineHeight: 1.2, color: "#454545ff", marginBottom: "0.5rem", textAlign:"center" }}>
            Reportes de Incidencias
          </motion.h1>
           <FeedReports />
          </Layout>

          {/* Floating Button */}
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleFloatButtonClick}
            style={{
              position: "fixed",
              width: 56,
              height: 56,
              fontSize: 24,
              bottom: 24,
              right: 24,
              zIndex: 1000, // para que esté encima de todo
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
            }}
          />
        </Content>
      </Layout>
    </Layout>
  );
};
export default Reportes_form;