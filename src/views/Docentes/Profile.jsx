import React, { useState, useEffect } from "react";
import { Layout, Card } from "antd";
import backend from "../../config/backend";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

const { Header, Content } = Layout;
import PublicationByID_docente from "../../Components/PublicacionesDocente";
import CardVerticalProfile from "../../Components/ProfileCardVertical";
import CardHorizontalProfile from "../../Components/ProfileCardHrizontal";
import Navbar from "../../Components/Navbar";
import Grafica1 from "../../Components/graphics/Grafica1";
import Grafica2 from "../../Components/graphics/Grafica2";
import Grafica3 from "../../Components/graphics/Grafica3";
import texto from "../../assets/Logo.svg";
import logo from "../../assets/logo2.svg";

const Profile = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  //obtener la id del docente de la url
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const pathParts = currentPath.split("/");
  const docenteId = pathParts[2]; // Suponiendo que la URL es /teacher/:id
  const [loadingProfile, setLoadingProfile] = useState(true);
const [loadingGrafica1, setLoadingGrafica1] = useState(true);
const [loadingGrafica2, setLoadingGrafica2] = useState(true);
const [loadingGrafica3, setLoadingGrafica3] = useState(true);

  //datos para el card
  const [profile, setProfile] = useState({
  id: null,
  name: "",
  apellido_paterno: "",
  apellido_materno: "",
  sexo: "",
  departamento: "",
  created_at: "",
  promedio: 0,
  total_evaluaciones: 0,
  top_keywords: [], // 👈 clave: inicializamos como arreglo vacío
});

const [promedioCalificaciones, setPromedioCalificaciones] = useState([]);
const [promedioMaterias, setPromedioMaterias] = useState([]);
const [evolucionMaterias, setEvolucionMaterias] = useState([]);
const basePath = `${backend}/teachers/${docenteId}/califications/more`
  //------------------------------------------- carga de información del docente
  useEffect(() => {
  setLoadingProfile(true);
  fetch(`${backend}/teachers/${docenteId}/info`)
    .then(res => res.json())
    .then(data => {
      setProfile({
        id: data.id,
        name: data.name,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        sexo: data.sexo,
        departamento: data.departamento,
        created_at: data.created_at,
        promedio: data.promedio ?? 0,
        total_evaluaciones: data.total_evaluaciones ?? 0,
        top_keywords: data.top_keywords ?? [],
      });
    })
    .catch(console.error)
    .finally(() => setLoadingProfile(false));
}, [docenteId]);

useEffect(() => {
  setLoadingGrafica1(true);
  fetch(`${backend}/teachers/${docenteId}/score`)
    .then(res => res.json())
    .then(data => setPromedioCalificaciones(data))
    .catch(console.error)
    .finally(() => setLoadingGrafica1(false));
}, [docenteId]);




useEffect(() => {
  setLoadingGrafica2(true);
  fetch(`${backend}/teachers/${docenteId}/score/subject`)
    .then(res => res.json())
    .then(data => setPromedioMaterias(data))
    .catch(console.error)
    .finally(() => setLoadingGrafica2(false));
}, [docenteId]);

useEffect(() => {
  setLoadingGrafica3(true);
  fetch(`${backend}/teachers/${docenteId}/score/subject/year`)
    .then(res => res.json())
    .then(data => setEvolucionMaterias(data))
    .catch(console.error)
    .finally(() => setLoadingGrafica3(false));
}, [docenteId]);




 

  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Breakpoints
  const isMobile = windowWidth < 768;
  const isMedium = windowWidth >= 1000 && windowWidth < 1540;
  const ocultarfotoMedida = windowWidth < 1300;
  const ocultarGraficas = windowWidth < 1000;

  return (
    <Layout style={{ height: "100vh", overflow: "hidden", width: "100vw", margin: 0 }}>
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
  {/* Logo a la izquierda (desktop solo) */}
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
      <img src={logo} alt="Logo" style={{ height: 50 ,  marginRight: 8}} />
      <img src={texto} alt="Texto Logo" style={{ height: 20, marginRight: 8 }} />
    </div>
  )}

  {/* Spacer flexible entre logo y container */}
  <div style={{ flex: 1 }}></div>

  {/* Container del navbar */}
  <div
    style={{
      maxWidth: 600,       // ancho máximo del navbar
      width: "100%",       // ocupe todo el espacio disponible hasta maxWidth
      display: "flex",
      justifyContent: "center",
      minWidth: 0,         // importante para flexShrink
    }}
  >
    <Navbar windowWidth={windowWidth} />
  </div>

  {/* Spacer flexible al final */}
  <div style={{ flex: 1 }}></div>
</Header>






      {/* CONTENIDO */}
      <Content
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: `calc(100vh - 64px)`, // 64px aprox header
          padding: 16,
          gap: 16,
          overflow: "hidden",
        }}
      >
        {/* LAYOUT 1 */}
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
) : (
  isMobile ? <CardHorizontalProfile profile={profile} /> : <CardVerticalProfile profile={profile} />
)}
        </div>

        {/* LAYOUT 2 + 3 */}
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
            justifyContent: "start",
            marginTop: isMobile ? 8 : 0,
          }}
        >
          {/* PUBLICACIONES */}
          <Layout style={{ backgroundColor: "#fff", maxWidth: 700, minWidth: 300, width: '100%', height: "100%", overflowY: "auto", padding: 15, borderRadius: 10, marginTop: 0, border: "1px solid #d9d9d9", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <PublicationByID_docente 
              ocultarFoto={ocultarfotoMedida} 
              basePath={basePath}
              />

          </Layout>

          {/* GRÁFICAS */}
          <Layout style={{
            backgroundColor: "#fff",
            display: ocultarGraficas ? "none" : "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            maxWidth: 800,
            minWidth: 300,
            width: '100%',
            height: "100%",
            overflowY: "auto",
            padding: 15,
            borderRadius: 10,
            marginLeft: 15,
            border: "1px solid #d9d9d9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            
            {/* CONTENEDOR DE GRAFICA1 Y GRAFICA2 */}
            <div style={{
              backgroundColor: "transparent",
              width: "100%",
              height: isMedium ? "auto" : "50%",
              maxHeight: isMedium ? "none" : 300,
              display: "flex",
              flexDirection: isMedium ? "column" : "row",
              gap: isMedium ? 12 : 0,
              justifyContent: "start",
              alignItems: "center",
              padding: 0
            }}>
              <div style={{
                backgroundColor: "transparent",
                width: isMedium ? "100%" : "50%",
                height: isMedium ? 250 : "100%",
                display: "flex", justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                padding: 10
              
              }}>
               {loadingGrafica1 ? <Spin tip="Cargando gráfica 1..." /> : <Grafica1 datos={promedioCalificaciones} />}
              </div>
              <div style={{
                backgroundColor: "transparent",
                width: isMedium ? "100%" : "50%",
                height: isMedium ? 250 : "100%",
                display: "flex", justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                padding: 10
              }}>
                 {loadingGrafica2 ? <Spin tip="Cargando gráfica 2..." /> : <Grafica2 datos={promedioMaterias} />}
              </div>
            </div>

            {/* GRAFICA 3 */}
            <div style={{
              backgroundColor: "transparent",
              width: "100%",
              height: isMedium ? 300 : "50%",
              marginTop: isMedium ? 12 : 0,
              padding:10
            }}>
              {loadingGrafica3 ? <Spin tip="Cargando gráfica 3..." /> : <Grafica3 datos={evolucionMaterias} />}

            </div>
          </Layout>
        </div>
      </Content>
    </Layout>
  );
};

export default Profile;
