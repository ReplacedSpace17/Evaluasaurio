import React, { useState, useEffect } from "react";
import { Layout, Button, Modal, Typography, Drawer, Checkbox } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import texto from "../../assets/texto_negro.svg";
import logo from "../../assets/logo_negro.svg";
import {
  setVisitado,
  getLastVersionSeen,
  setLastVersionSeen,
  getDataVersion,
  getPolicyAccepted,
  setPolicyAccepted
} from "../../functions/Localstorage";

import Sidebar_home from "../../Components/Home/sidebar_home/Sidebar_home";
import Novedades from "../../Components/Home/Novedades/Novedades";
import Menu_component from "../../Components/Home/Menu/Menu";
import Eventos from "../../Components/Home/Eventos/Eventos";
import History_versions from "../../Components/Home/Version_map/History_versions"
 import avisoPrivacidad from "../../aviso_privacidad.json";
 
 
const { Header, Sider, Content } = Layout;

const { Paragraph } = Typography;

//imports de imagenes del mes
import novedadesData from "../../Components/Home/Novedades/Novedades.json"
import eventosData from "../../Components/Home/Eventos/eventos.json"
import versionData from "../../versions/versions.json"

const Menu = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isVersionModalVisible, setIsVersionModalVisible] = useState(false);
  const [isPolicyModalVisible, setIsPolicyModalVisible] = useState(false);
const [policyChecked, setPolicyChecked] = useState(false);
  const [dataVersion, setDataVersion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setVisitado();
  }, []);
useEffect(() => {
  const versionSeen = getLastVersionSeen();
  const policyAccepted = getPolicyAccepted();
  const data = getDataVersion();

  if (!policyAccepted) {
    // Muestra primero el aviso de privacidad
    setIsPolicyModalVisible(true);
  } else if (!versionSeen && data) {
    // Solo muestra el modal de versión si ya aceptó la política
    setDataVersion(data);
    setIsVersionModalVisible(true);
  }
}, []);


  const handleCloseVersionModal = () => {
    setIsVersionModalVisible(false);
    setLastVersionSeen();
  };

 const handleClosePolicyModal = () => {
  setIsPolicyModalVisible(false);
  setPolicyAccepted();

  const versionSeen = getLastVersionSeen();
  const data = getDataVersion();

  if (!versionSeen && data) {
    setDataVersion(data);
    setIsVersionModalVisible(true);
  }
};


  // Detecta cambios de tamaño
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    if (window.innerWidth < 1443) setSidebarVisible(false);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 1443 && sidebarVisible) setSidebarVisible(false);
    if (windowWidth >= 1443 && !sidebarVisible) setSidebarVisible(true);
  }, [windowWidth]);

  const toggleSidebar = () => {
    // Evita abrir/cerrar el menú si es menor a 992px
    if (windowWidth < 992) return;

    if (windowWidth < 1443) setDrawerVisible(!drawerVisible);
    else setSidebarVisible((v) => !v);
  };

  const showBlackContainer = windowWidth >= 900;
  const redContainerWidth = showBlackContainer ? "80%" : "95%";
// Definimos height del header según el ancho
const headerHeight = windowWidth < 768 ? 50 : 70;

  return (
    <Layout style={{ height: "100vh", overflow: "hidden", margin: 0, width: "100vw" }}>
      {/* Header */}
     <Header
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#F6F8FA",
    padding: "0 16px",
    height: headerHeight, // <-- aquí
    borderBottom: "1px solid #D1D9E0",
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
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" style={{ height: headerHeight - 20, marginRight: 8 }} />
          {windowWidth >= 768 && (
            <img src={texto} alt="Texto Logo" style={{ height: 20 }} />
          )}
        </div>

        {/* Mostrar icono de menú SOLO si el ancho es >= 992px */}
        {windowWidth >= 992 && (
          <Button type="text" onClick={toggleSidebar}>
            {drawerVisible || sidebarVisible ? (
              <CloseOutlined style={{ fontSize: 24, color: "black" }} />
            ) : (
              <MenuOutlined style={{ fontSize: 24, color: "black" }} />
            )}
          </Button>
        )}
      </Header>

      <Layout style={{ height: `calc(100vh - ${headerHeight}px)` }}>
        {/* Sidebar en modo escritorio */}
        {windowWidth >= 1443 && (
          <Sider
            width={300}
            style={{
              background: "#FFFFFF",
              borderRight: "1px solid #D1D9E0",
              height: "100%",
              overflow: "hidden",
              marginLeft: 10,
            }}
            collapsedWidth={0}
            collapsible
            collapsed={!sidebarVisible}
            trigger={null}
          >
            <Sidebar_home width_component="100%" title="Preguntas frecuentes" padding_content="20px" />
          </Sider>
        )}

        {/* Drawer SOLO si está entre 992px y 1443px */}
        {windowWidth >= 992 && windowWidth < 1443 && (
          <Drawer
            placement="left"
            closable={false}
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={300}
            style={{
              padding: 0,
              margin: 0,
              background: "#ffffffff",
              borderRight: "1px solid #D1D9E0",
              display: "flex",
            }}
          >
            <Sidebar_home width_component="100%" title="Evaluaciones recientes" padding_content="0px" />
          </Drawer>
        )}

        {/* Contenido principal */}
        <Content
          style={{
            padding: 10,
            paddingTop: 15,
            background: "#fff",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "20px",
            transition: "all 0.3s ease",
          }}
        >
          {/* Contenedor rojo */}
          <div
            style={{
              backgroundColor: "none",
              width: redContainerWidth,
              height: "100%",
              maxWidth: 800,
              
              borderRadius: 12,
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "start",
              overflowY: "auto",
            }}
          >
            <h1 style={{
              color:"#25292E",
              marginTop: 0,
              fontSize: 20,
            }}>Bienvenido a Evaluasaurio</h1>
            <Novedades title="Novedades del mes" width="95%" data={novedadesData} isMobile={windowWidth < 768} />
            <Menu_component title="Evaluaciones" width="95%" />
            <Eventos title="Eventos" data ={eventosData} width="95%"/>
             <p style={{
              fontSize: 12,
              color: "#888F99",
              marginTop: 20,
              marginBottom: 10,
            }}>
              Ultima actualización del aviso de privacidad: <strong>17/10/2025</strong> - <a onClick={() => navigate("/privacy-policy")} style={{ cursor: "pointer" }}>Política de privacidad</a>
            </p>
            <p style={{
              fontSize: 12,
              color: "#888F99",
              marginTop: 20,
              marginBottom: 10,
            }}>
              © 2025 Evaluasaurio. Todos los derechos reservados.
            </p>
          </div>

          {/* Contenedor negro */}
          {showBlackContainer && (
            <div
              style={{
                backgroundColor: "none",
                width: "20%",
                height: "100%",
                minWidth: 300,
                maxWidth: 500,
                borderRadius: 12,
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
                overflowY: "auto",
              }}
            >
              <History_versions data={versionData} />
            </div>
          )}
        </Content>
      </Layout>

      {/* Modal de versión */}
      <Modal
        title={`📦 Versión ${dataVersion?.nameversion}`}
        open={isVersionModalVisible}
        onOk={handleCloseVersionModal}
        onCancel={handleCloseVersionModal}
        okText="Cerrar"
        centered
      >
        {dataVersion && (
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            <Paragraph>
              <strong>Fecha:</strong> {dataVersion.date}
            </Paragraph>
            <Paragraph>
              <strong>Descripción:</strong> {dataVersion.description}
            </Paragraph>
            <Paragraph>
              <strong>Cambios:</strong>
            </Paragraph>
            <ul style={{ paddingLeft: "20px" }}>
              {dataVersion.changes.map((change, i) => (
                <li key={i}>{change}</li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
      {/* Modal de aviso de privacidad */}
    <Modal
  title="Aviso Legal y de Privacidad"
  open={isPolicyModalVisible}
  onOk={handleClosePolicyModal}
  onCancel={() => {}}
  closable={false}
  maskClosable={false}
  okText="Aceptar"
  centered
  okButtonProps={{ disabled: !policyChecked }}
>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 16,
      maxHeight: "70vh",
      overflowY: "auto",
      paddingRight: 8,
      userSelect: "none",
    }}
  >
    {/* Encabezado */}
    <div>
      <Typography.Title level={5} style={{ marginBottom: 4 }}>
        {avisoPrivacidad.colectivo}
      </Typography.Title>
      <Typography.Text type="secondary">
        Última actualización: {avisoPrivacidad.ultima_actualizacion}
      </Typography.Text>
    </div>

    {/* Propósito específico */}
    {avisoPrivacidad.proposito_especifico && (
      <div>
        <Typography.Title level={5} style={{ marginBottom: 4, fontSize: 12 }}>
          {avisoPrivacidad.proposito_especifico.titulo}
        </Typography.Title>
        <Typography.Paragraph style={{ fontSize: 12, color: "#333" }}>
          {avisoPrivacidad.proposito_especifico.contenido}
        </Typography.Paragraph>
      </div>
    )}

    {/* Base legal */}
    {avisoPrivacidad.base_legal && (
      <div>
        <Typography.Title level={5} style={{ marginBottom: 4, fontSize: 12 }}>
          {avisoPrivacidad.base_legal.titulo}
        </Typography.Title>
        {avisoPrivacidad.base_legal.puntos && (
          <ul style={{ marginLeft: 20, fontSize: 12, color: "#333" }}>
            {avisoPrivacidad.base_legal.puntos.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        )}
      </div>
    )}

    {/* Marco reglamentario */}
    {avisoPrivacidad.marco_reglamentario && (
      <div>
        <Typography.Title level={5} style={{ marginBottom: 4, fontSize: 12 }}>
          {avisoPrivacidad.marco_reglamentario.titulo}
        </Typography.Title>
        {avisoPrivacidad.marco_reglamentario.puntos && (
          <ul style={{ marginLeft: 20, fontSize: 12, color: "#333" }}>
            {avisoPrivacidad.marco_reglamentario.puntos.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        )}
      </div>
    )}

    {/* Renderizado dinámico del aviso legal */}
    {Object.entries(avisoPrivacidad.aviso_legal).map(([key, section]) => (
      <div key={key}>
        <Typography.Title
          level={5}
          style={{
            color: "#111",
            fontWeight: "bold",
            marginTop: 12,
            marginBottom: 4,
            fontSize: 12
          }}
        >
          {section.titulo}
        </Typography.Title>

        {section.contenido && (
          <Typography.Paragraph style={{ marginBottom: 8, color: "#333", fontSize: 12 }}>
            {section.contenido}
          </Typography.Paragraph>
        )}

        {section.puntos && (
          <ul style={{ marginLeft: 20, color: "#333", fontSize: 12 }}>
            {section.puntos.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        )}
      </div>
    ))}

    {/* Aceptación */}
    <Checkbox
      checked={policyChecked}
      onChange={(e) => setPolicyChecked(e.target.checked)}
    >
      He leído y acepto el aviso de privacidad
    </Checkbox>
  </div>
</Modal>




    </Layout>
  );
};

export default Menu;
