import React, { useEffect, useState } from "react";
import { List, Avatar, Tag, Typography, Divider, Space } from "antd";
import { UserOutlined, StarFilled } from "@ant-design/icons";
import backend from "../config/backend";
import './sidebar.css';
import { useNavigate } from "react-router-dom";

import imageBoy from "../assets/images/boy.svg";
import imageGirl from "../assets/images/girl.svg";

const { Title, Text } = Typography;

const Sidebar = () => {
  
  const [topProfessors, setTopProfessors] = useState([]);
  const navigate = useNavigate();

  const handleProfessorClick = (professorId) => {
    navigate(`/teacher/${professorId}`);
  };
  
  
  useEffect(() => {
    fetch(backend + "/teachers/top")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setTopProfessors(data.data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fafafa",
      }}
    >
      {/* Encabezado fijo */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fafafa",
          padding: "16px 16px 8px 16px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Title level={4} style={{ marginBottom: 4, color: "#222" }}>
          Mejores Puntuados
        </Title>
        <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
          Profesores con mayor promedio de calificaciones
        </Text>
      </div>

      {/* Lista scrollable */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
        <List
          itemLayout="horizontal"
          dataSource={topProfessors}

          renderItem={(item) => (
           <List.Item className="profesor-item" onClick={() => handleProfessorClick(item.id)} style={{ cursor: 'pointer' }}>
  <List.Item.Meta
    avatar={
      <Avatar
        size={48}
        icon={<UserOutlined />}
        src={item.sexo === "Masculino" ? imageBoy : imageGirl}

      />
    }
    title={
      <Text strong style={{ fontSize: 16 }}>
        {item.name} {item.apellido_paterno} {item.apellido_materno}
      </Text>
    }
    description={
      <Space direction="vertical" size={0}>
        <Tag
          color={
            parseFloat(item.promedio_puntuacion) >= 4
              ? "green"
              : parseFloat(item.promedio_puntuacion) >= 3
              ? "orange"
              : "red"
          }
          style={{
            fontSize: 14,
            padding: "2px 8px",
            borderRadius: "8px",
          }}
        >
          <StarFilled style={{ marginRight: 4 }} />
          {parseFloat(item.promedio_puntuacion).toFixed(1)}
        </Tag>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {item.total_calificaciones} calificaciones
        </Text>
      </Space>
    }
  />
</List.Item>

          )}
        />
      </div>
    </div>
  );
};

export default Sidebar;
