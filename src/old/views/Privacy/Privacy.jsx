import React from "react";
import { Typography, Layout } from "antd";
import avisoPrivacidad from "../../aviso_privacidad.json"; // ajusta la ruta según tu estructura
import logo from "../../assets/texto_negro.svg";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const PrivacyPolicy = () => {
  return (
    <Layout
      style={{
        backgroundColor: "#ffffffff",
        minHeight: "100vh",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        userSelect: "none"
      }}
    >
      <Content
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          maxWidth: 900,
          width: "100%",
          padding: "40px 50px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Encabezado */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 30 }}>
          <img src={logo} alt="Logo" style={{ height: 20, }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
          
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Aviso Legal y de Privacidad
            </Title>
            <Text type="secondary">
              {avisoPrivacidad.colectivo} — Última actualización:{" "}
              {avisoPrivacidad.ultima_actualizacion}
            </Text>
          </div>
        </div>
{/* Contenido dinámico */}
<div style={{ lineHeight: 1.7 }}>
  {Object.entries(avisoPrivacidad.aviso_legal).map(([key, section]) => (
    <div
      key={key}
      style={{
        marginBottom: 25,
        padding: key === "alcance_territorial" ? "10px" : "0",
        backgroundColor: key === "alcance_territorial" ? "#f9f9f9" : "transparent",
        borderRadius: key === "alcance_territorial" ? 6 : 0,
      }}
    >
      <Title
        level={4}
        style={{
          color: "#1a1a1a",
          fontWeight: "bold",
          borderBottom: "2px solid #f0f0f0",
          paddingBottom: 5,
        }}
      >
        {section.titulo}
      </Title>

      {section.contenido && (
        <Paragraph style={{ color: "#333", marginBottom: 10 }}>
          {section.contenido}
        </Paragraph>
      )}

      {section.puntos && (
        <ul style={{ marginLeft: 20, color: "#333" }}>
          {section.puntos.map((p, idx) => (
            <li key={idx}>{p}</li>
          ))}
        </ul>
      )}
    </div>
  ))}
</div>

        {/* Pie de página */}
        <div style={{ marginTop: 50, borderTop: "1px solid #eee", paddingTop: 20 }}>
          <Paragraph style={{ fontSize: 13, color: "#666", textAlign: "center" }}>
            © 2025 {avisoPrivacidad.colectivo}. Proyecto abierto sin fines de lucro.  
            Versión: {avisoPrivacidad.version}
          </Paragraph>
        </div>
      </Content>
    </Layout>
  );
};

export default PrivacyPolicy;
