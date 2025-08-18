import React from "react";
import {
  Button,
  Card,
  Avatar,
  Typography,
  Tag,
  Rate,
} from "antd";
import { PlusOutlined, ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import imageBoy from "../assets/images/boy.svg";
import imageGirl from "../assets/images/girl.svg";

const { Title, Text } = Typography;

const CardVerticalProfile = ({ profile }) => {
  const navigate = useNavigate();
  const sexoColor = profile.sexo === "Femenino" ? "magenta" : "blue";
  const avatarImage = profile.sexo === "Femenino" ? imageGirl : imageBoy;

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
        padding: 0,
        border: "1px solid #d9d9d9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
      bodyStyle={{
        padding: 0,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header con avatar y botón regresar */}
      <div
      style={{
        position: "relative",
        width: "100%",
        height: 160,
        backgroundImage: `url("${patternBg}")`,
        backgroundSize: "cover",
        backgroundRepeat: "repeat"
      }}
    >
        <Button
          type="text"
          icon={<ArrowLeftOutlined style={{ color: "#fff", fontSize: 20 }} />}
          onClick={() => navigate('/')}
          style={{ position: "absolute", top: 10, left: 10 }}
        />

        <Avatar
          size={150}
          src={avatarImage}
          style={{
            position: "absolute",
            bottom: -60,
            left: "50%",
            transform: "translateX(-50%)",
            border: "4px solid #fff",
            backgroundColor: "#fff",
          }}
        />
      </div>

      {/* Contenido scrollable */}
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
        <Title level={3} style={{ textAlign: "center", marginBottom: 4 }}>
          {profile.name} {profile.apellido_paterno} {profile.apellido_materno}
        </Title>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            margin: "10px 0",
          }}
        >
          <Tag color={sexoColor}>{profile.sexo}</Tag>
          <Tag color="blue">{profile.departamento}</Tag>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
          <Rate allowHalf value={profile.promedio} disabled style={{ fontSize: 20 }} />
          <Text style={{ marginTop: 4 }}>{profile.promedio} / 5</Text>
        </div>

        <div style={{ width: "100%", marginBottom: 12, textAlign: "center" }}>
          <Text strong>Total Evaluaciones: {profile.total_evaluaciones}</Text>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              justifyContent: "center",
            }}
          >
            {profile.top_keywords.map((kw, index) => {
              const key = Object.keys(kw)[0];
              const count = kw[key];
              return (
                <Tag color="purple" key={index}>
                  {key} ({count})
                </Tag>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer con botón agregar */}
      <div style={{ padding: 16, borderTop: "1px solid #f0f0f0" }}>
        <Button
          type="secondary"
          icon={<HomeOutlined />}
          style={{ width: "100%", marginBottom: 8, border: "2px solid #d9d9d9" }}
          onClick={() => navigate(`/`)}
        >
          Inicio
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ width: "100%" }}
          onClick={() => navigate(`/submit/${profile.id}`)}
        >
          Agregar opinión
        </Button>
         
      </div>
    </Card>
  );
};

export default CardVerticalProfile;
