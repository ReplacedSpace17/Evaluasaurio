import React, { useState, useEffect } from "react";
import { Layout, Card, Spin } from "antd";
import backend from "../../config/backend";
import { useNavigate } from "react-router-dom";
import PublicationByID_departaments from "../../Components/Departaments/Publications_departaments/Publicaciones_by_ID_Departaments";
import Card_Departamentos_escritorio from "../../Components/Departaments/Card_profile/Profile_departament_desktop";
import Card_departament_mobile from "../../Components/Departaments/Card_profile/Profile_departament_mobile";
import Navbar from "../../Components/Navbar";
import texto from "../../assets/Logo.svg";
import logo from "../../assets/logo2.svg";

const { Header, Content } = Layout;

const Profile_departamento = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  // Obtener el ID del departamento desde la URL
  const currentPath = window.location.pathname;
  const pathParts = currentPath.split("/");
  const departamentoId = pathParts[2];

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPublicaciones, setLoadingPublicaciones] = useState(true);

  // Datos del perfil del departamento
  const [profile, setProfile] = useState({
    id: null,
    name: "",
    jefatura: "",
    promedio: 0,
    total_evaluaciones: 0,
    top_keywords: [],
  });

  // Opiniones del departamento
  const [publicacionesDept, setPublicacionesDept] = useState([]);

  // Obtener la información del departamento
  useEffect(() => {
    setLoadingProfile(true);
    fetch(`${backend}/departamentos/evaluacion/${departamentoId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setProfile({
            id: data.id,
            name: data.name,
            jefatura: data.jefatura,
            promedio: data.score_mean ?? 0,
            total_evaluaciones: data.opiniones?.length ?? 0,
            top_keywords: data.opiniones?.flatMap((op) => op.keywords) ?? [],
          });

          // Adaptar las opiniones al formato que usa PublicationByID_departaments
          const mappedOpiniones =
            data.opiniones?.map((op) => ({
              opinion: op.opiniones,
              keywords: op.keywords,
              score: op.calificacion,
              fecha: op.fecha,
            })) ?? [];

          setPublicacionesDept(mappedOpiniones);
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoadingProfile(false);
        setLoadingPublicaciones(false);
      });
  }, [departamentoId]);

  // Listener de redimensionamiento
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Breakpoints
  const isMobile = windowWidth < 768;
  const ocultarfotoMedida = windowWidth < 1300;

  return (
    <Layout style={{ height: "100vh", overflow: "hidden", width: "100vw", margin: 0,  }}>
      {/* HEADER */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          background: "#193961",
          color: "white",
          padding: "0 16px",
          position: "relative",
        }}
      >
        {windowWidth >= 768 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              flexShrink: 0,
              marginLeft: 16,
            }}
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Logo" style={{ height: 50, marginRight: 8 }} />
            <img src={texto} alt="Texto Logo" style={{ height: 20, marginRight: 8 }} />
          </div>
        )}
        <div style={{ flex: 1 }}></div>
        <div
          style={{
            maxWidth: 600,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          <Navbar windowWidth={windowWidth} />
        </div>
        <div style={{ flex: 1 }}></div>
      </Header>

      {/* CONTENIDO */}
      <Content
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: `calc(100vh - 64px)`,
          padding: 16,
          gap: 16,
          overflow: "hidden",
          backgroundColor: "#ffffffff"
        }}
      >
        {/* PERFIL */}
        <div
          style={{
            width: isMobile ? "100%" : "20%",
            minWidth: isMobile ? "100%" : 300,
            flexShrink: 0,
            display: "flex",
            backgroundColor: "transparent",
            height: isMobile ? 220 : "100%",
            maxHeight: isMobile ? 220 : 600,
            minHeight: isMobile ? 220 : 500,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            marginTop: isMobile ? 0 : 12,
          }}
        >
          {loadingProfile ? (
            <Spin tip="Cargando perfil..." size="large" />
          ) : isMobile ? (
            <Card_departament_mobile profile={profile} />
          ) : (
            <Card_Departamentos_escritorio profile={profile} />
          )}
        </div>

        {/* PUBLICACIONES */}
        <div
          style={{
            flex: 1,
            width: isMobile ? "100%" : "80%",
            height: isMobile ? "auto" : "100%",
            overflowY: "auto",
            backgroundColor: "transparent",
            padding: 0,
            borderRadius: 4,
            display: "flex",
            alignContent: "start",
            justifyContent: "center",
            marginTop: isMobile ? 8 : 0,
          }}
        >
          <Layout
            style={{
              backgroundColor: "#ffffffff",
              maxWidth: 1000,
              minWidth: 300,
              width: "100%",
              height: "100%",
              overflowY: "auto",
              padding: 15,
              borderRadius: 10,
              marginTop: 0,
              border: "1px solid #d9d9d9",
              
            }}
          >
            {loadingPublicaciones ? (
              <Spin tip="Cargando opiniones..." size="large" />
            ) : (
              <PublicationByID_departaments
                ocultarFoto={ocultarfotoMedida}
                publications={publicacionesDept}
              />
            )}
          </Layout>
        </div>
      </Content>
    </Layout>
  );
};

export default Profile_departamento;
