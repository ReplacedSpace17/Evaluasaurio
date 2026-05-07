import React from "react";
import { Button, Card, Avatar, Typography, Tag, Rate } from "antd";
import {
  PlusOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import iconDept from "../../../assets/icons/instalaciones.svg";

const { Title, Text } = Typography;

const Card_Departamentos_escritorio = ({ profile }) => {
  const navigate = useNavigate();

  const patternBg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' width='40' height='59.428' patternTransform='rotate(155)scale(2)' patternUnits='userSpaceOnUse'><rect width='100%' height='100%' fill='%230466c8'/><path fill='none' stroke='%23023e7e' stroke-linecap='round' stroke-linejoin='round' stroke-width='5' d='M0 70.975V47.881m20-1.692L8.535 52.808v13.239L20 72.667l11.465-6.62V52.808zm0-32.95 11.465-6.62V-6.619L20-13.24 8.535-6.619V6.619zm8.535 4.927v13.238L40 38.024l11.465-6.62V18.166L40 11.546zM20 36.333 0 47.88m0 0v23.094m0 0 20 11.548 20-11.548V47.88m0 0L20 36.333m0 0 20 11.549M0 11.547l-11.465 6.619v13.239L0 38.025l11.465-6.62v-13.24zv-23.094l20-11.547 20 11.547v23.094M20 36.333V13.24'/></pattern></defs><rect width='800%' height='800%' fill='url(%23a)' transform='translate(-158 -228)'/></svg>`;

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: 350,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #d9d9d9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
      bodyStyle={{ padding: 0, flex: 1, display: "flex", flexDirection: "column" }}
    >
      {/* HEADER */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 160,
          backgroundImage: `url("${patternBg}")`,
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined style={{ color: "#fff", fontSize: 20 }} />}
          onClick={() => navigate("/evaluaciones/departamentos")}
          style={{ position: "absolute", top: 10, left: 10 }}
        />
        <Avatar
          size={130}
          src={iconDept}
          style={{
            position: "absolute",
            bottom: -60,
            left: "50%",
            transform: "translateX(-50%)",
            border: "8px solid #252525ff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            padding: 30,
          }}
        />
      </div>

      {/* CONTENIDO */}
      <div
        style={{
          marginTop: 60,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          overflowY: "auto",
        }}
      >
        {/* Nombre del departamento */}
        <Title level={3} style={{ textAlign: "center", marginBottom: 4 }}>
          {profile.name}
        </Title>

        {/* Jefatura */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <TeamOutlined style={{ color: "#1677ff" }} />
          <Text type="secondary" style={{ fontSize: 14 }}>
            Jefatura: {profile.jefatura || "Sin asignar"}
          </Text>
        </div>

        {/* Promedio */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rate
            allowHalf
            value={parseFloat(profile.promedio) || 0}
            disabled
            style={{ fontSize: 20 }}
          />
          <Text style={{ marginTop: 4 }}>
            {parseFloat(profile.promedio).toFixed(1)} / 5
          </Text>
        </div>

        {/* Palabras clave */}
        {profile.top_keywords.length > 0 && (
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              Temas frecuentes:
            </Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                justifyContent: "center",
              }}
            >
              {profile.top_keywords.slice(0, 6).map((kw, index) => (
                <Tag color="purple" key={index}>
                  {kw}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Total evaluaciones */}
        <Text style={{ marginTop: 16 }}>
          Total de evaluaciones:{" "}
          <strong>{profile.total_evaluaciones || 0}</strong>
        </Text>
      </div>

      {/* FOOTER */}
      <div style={{ padding: 16, borderTop: "1px solid #f0f0f0" }}>
        <Button
          type="secondary"
          icon={<HomeOutlined />}
          style={{
            width: "100%",
            marginBottom: 8,
            border: "2px solid #d9d9d9",
          }}
          onClick={() => navigate(`/menu`)}
        >
          Inicio
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ width: "100%" }}
          onClick={() => navigate(`/submit/departament/${profile.id}`)}
        >
          Agregar opinión
        </Button>
      </div>
    </Card>
  );
};

export default Card_Departamentos_escritorio;
