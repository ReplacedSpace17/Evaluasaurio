import React from "react";
import { Button, Avatar, Typography, Tag, Rate } from "antd";
import { PlusOutlined, ArrowLeftOutlined, HomeOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import iconDept from "../../../assets/icons/instalaciones.svg";

const { Title, Text } = Typography;

const Card_departament_mobile = ({ profile }) => {
  const navigate = useNavigate();

  const patternBg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' width='40' height='59.428' patternTransform='rotate(155)scale(2)' patternUnits='userSpaceOnUse'><rect width='100%' height='100%' fill='%230466c8'/><path fill='none' stroke='%23023e7e' stroke-linecap='round' stroke-linejoin='round' stroke-width='5' d='M0 70.975V47.881m20-1.692L8.535 52.808v13.239L20 72.667l11.465-6.62V52.808zm0-32.95 11.465-6.62V-6.619L20-13.24 8.535-6.619V6.619zm8.535 4.927v13.238L40 38.024l11.465-6.62V18.166L40 11.546zM20 36.333 0 47.88m0 0v23.094m0 0 20 11.548 20-11.548V47.88m0 0L20 36.333m0 0 20 11.549M0 11.547l-11.465 6.619v13.239L0 38.025l11.465-6.62v-13.24zv-23.094l20-11.547 20 11.547v23.094M20 36.333V13.24'/></pattern></defs><rect width='800%' height='800%' fill='url(%23a)' transform='translate(-158 -228)'/></svg>`;

  return (
    <div
      style={{
        minWidth: 350,
        marginTop: 10,
        width: "100%",
        height: 220,
        backgroundColor: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        border: "1px solid rgba(217, 217, 217, 0)",
        boxShadow: "0 2px 8px rgb(172, 172, 172)",
      }}
    >
      {/* Contenedor Avatar */}
      <div
        style={{
          width: "40%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundImage: `url("${patternBg}")`,
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined style={{ color: "#fff", fontSize: 20 }} />}
          onClick={() => navigate("/evaluaciones/departamentos")}
          style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}
        />

        <Avatar
                  size={100}
                  src={iconDept}
                  style={{
                    
                    border: "8px solid #252525ff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    backgroundColor: "#fff",
                    padding: 20,
                  }}
                />
      </div>

      {/* Contenedor Información */}
      <div
        style={{
          width: "60%",
          height: "100%",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        {/* Nombre y Jefatura */}
        <div>
          <Title level={4} style={{ marginTop: 0 }}>
            {profile.name}
          </Title>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <TeamOutlined style={{ color: "#1677ff" }} />
            <Text type="secondary" style={{ fontSize: 13 }}>
              {profile.jefatura || "Sin asignar"}
            </Text>
          </div>
        </div>

        {/* Promedio */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Rate
            allowHalf
            value={parseFloat(profile.promedio) || 0}
            disabled
            style={{ fontSize: 16 }}
          />
          <Text style={{ marginTop: 4 }}>
            {parseFloat(profile.promedio).toFixed(1)} / 5
          </Text>
        </div>

        {/* Palabras clave */}
        {profile.top_keywords?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {profile.top_keywords.slice(0, 4).map((kw, index) => (
              <Tag color="purple" key={index}>
                {kw}
              </Tag>
            ))}
          </div>
        )}

        {/* Botón Agregar opinión */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ width: "100%" }}
          onClick={() => navigate(`/submit/departament/${profile.id}`)}
        >
          Agregar opinión
        </Button>
      </div>
    </div>
  );
};

export default Card_departament_mobile;
