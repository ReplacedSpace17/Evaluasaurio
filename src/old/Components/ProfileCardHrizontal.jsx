import React from "react";
import { Button, Avatar, Typography, Tag, Rate } from "antd";
import { PlusOutlined, ArrowLeftOutlined , HomeOutlined} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import imageBoy from "../assets/images/boy.png";
import imageGirl from "../assets/images/girl.png";

const { Title, Text } = Typography;

const CardHorizontalProfile = ({ profile }) => {
  const navigate = useNavigate();
const patternBg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' width='40' height='59.428' patternTransform='rotate(155)scale(2)' patternUnits='userSpaceOnUse'><rect width='100%' height='100%' fill='%230466c8'/><path fill='none' stroke='%23023e7e' stroke-linecap='round' stroke-linejoin='round' stroke-width='5' d='M0 70.975V47.881m20-1.692L8.535 52.808v13.239L20 72.667l11.465-6.62V52.808zm0-32.95 11.465-6.62V-6.619L20-13.24 8.535-6.619V6.619zm8.535 4.927v13.238L40 38.024l11.465-6.62V18.166L40 11.546zM20 36.333 0 47.88m0 0v23.094m0 0 20 11.548 20-11.548V47.88m0 0L20 36.333m0 0 20 11.549M0 11.547l-11.465 6.619v13.239L0 38.025l11.465-6.62v-13.24zv-23.094l20-11.547 20 11.547v23.094M20 36.333V13.24'/></pattern></defs><rect width='800%' height='800%' fill='url(%23a)' transform='translate(-158 -228)'/></svg>`;
 

  const avatarImage = profile.sexo === "Femenino" ? imageGirl : imageBoy;

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
      {/* Contenedor 1 - Avatar (40%) */}
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
        backgroundRepeat: "repeat"
        }}
      >
        {/* Botón regresar */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined style={{ color: "#fff", fontSize: 20 }} />}
          onClick={() => navigate('/evaluaciones/docentes')}
          style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}
        />

        <Avatar
          size={100}
          src={avatarImage}
          style={{
            border: "3px solid #fff",
            backgroundColor: "#87d068",
          }}
        />
      </div>

      {/* Contenedor 2 - Información (60%) */}
      <div
        style={{
          width: "60%",
          height: "100%",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: 10,
        }}
      >
        <div style={{ width: "100%", padding: 0 }}>
          <Title level={4} style={{ marginTop: 0 }}>
            {profile.name} {profile.apellido_paterno}
          </Title>

          <Tag color="blue" style={{ marginTop: 0 }}>
            {profile.departamento}
          </Tag>
        </div>

        <div
          style={{
            width: "100%",
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <Rate
            allowHalf
            value={profile.promedio}
            defaultValue={profile.promedio}
            style={{ fontSize: 16 }}
          />
          <Text style={{ marginTop: 4 }}>{profile.promedio} / 5</Text>
        </div>

        
        <div
          style={{
            width: "100%",
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "end",
          }}
        > 
          <Button type="primary" icon={<PlusOutlined />} style={{ width: "100%", }} onClick={() => navigate(`/submit/${profile.id}`)}>
            Agregar opinión
          </Button>
         
        </div>
      </div>
    </div>
  );
};

export default CardHorizontalProfile;
