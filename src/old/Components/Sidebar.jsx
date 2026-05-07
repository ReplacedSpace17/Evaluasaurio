import React, { useEffect, useState } from "react";
import { List, Typography, Modal, Tag, Space } from "antd";
import { StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import backend from "../config/backend";
import "./sidebar.css";

// Importa los íconos de los departamentos
import iconSistemas from "../assets/icons/departaments/sistemas.svg";
import iconIndustrial from "../assets/icons/departaments/industrial.svg";
import iconBasicas from "../assets/icons/departaments/basicas.svg";
import iconEconomico from "../assets/icons/departaments/economico.svg";
import iconMetal from "../assets/icons/departaments/metal.svg";
import iconPosgrado from "../assets/icons/departaments/posgrado.svg";
import iconHonorarios from "../assets/icons/departaments/honorarios.svg";

import corona from "../assets/icons/corona.svg";
const { Title, Text } = Typography;

const Sidebar = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const iconMap = {
    "Sistemas y Computación": iconSistemas,
    "Ingeniería Industrial": iconIndustrial,
    "Ciencias Básicas": iconBasicas,
    "Ciencias Económico Administrativas": iconEconomico,
    "Metal Mecánica": iconMetal,
    "División de Estudios de Posgrado e Investigación": iconPosgrado,
    "Honorarios": iconHonorarios,
  };

  useEffect(() => {
    fetch(backend + "/teachers/top")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDepartamentos(data);
        } else if (data.status === "success" && Array.isArray(data.data)) {
          setDepartamentos(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleDeptClick = (dept) => {
    if (dept.Top && dept.Top.length > 0) {
      setSelectedDept(dept);
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedDept(null);
  };

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
      {/* Encabezado */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fafafa",
          padding: "16px 16px 8px 16px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          flexDirection: "row",
        }}
      >
      <div style={{marginRight:8}}>
        <img src={corona} alt="Corona" style={{ width: 32, height: 32}} />
      </div>
       <div style={{ display: "flex", flexDirection: "column", marginLeft: 8 }}>
         <Title level={4} style={{ marginBottom: 4, color: "#222", fontSize: 14 }}>
          Mejores puntuados
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Selecciona un departamento
        </Text>
       </div>
      </div>

      {/* Lista scrollable */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
        <List
          itemLayout="horizontal"
          dataSource={departamentos}
          renderItem={(item) => {
            const iconSrc = iconMap[item.Departamento] || iconSistemas;
            return (
              <List.Item
                className="profesor-item"
                onClick={() => handleDeptClick(item)}
                style={{
                  cursor: item.Top?.length > 0 ? "pointer" : "default",
                  opacity: item.Top?.length > 0 ? 1 : 0.6,
                }}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: 50,
                        height: 50,
                        padding: 12,
                        backgroundColor: "#e2ebf7d0",
                        borderRadius: 8,
                      }}
                    >
                      <img
                        src={iconSrc}
                        alt={item.Departamento}
                        style={{
                          width: "auto",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  }
                  title={
                    <Text style={{ fontSize: 13, fontWeight: 400 }}>
                      {item.Departamento}
                    </Text>
                  }
                  description={
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.Top?.length > 0
                        ? `${item.Top.length} profesores destacados`
                        : "Sin calificaciones"}
                    </Text>
                  }
                />
              </List.Item>
            );
          }}
        />
      </div>

      {/* Modal con Top 3 */}
      <Modal
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        centered
        title={
          selectedDept ? (
            <div>
              <Text strong style={{ fontSize: 16 }}>
                {selectedDept.Departamento}
              </Text>
            </div>
          ) : (
            ""
          )
        }
      >
        {selectedDept?.Top?.map((prof) => (
          <div
            key={prof.Top}
            style={{
              padding: "8px 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text strong style={{ fontSize: 14 }}>
                #{prof.Top} {prof.Nombre} {prof.Apellido_paterno}{" "}
                {prof.Apellido_materno}
              </Text>
              <Tag
                color={
                  parseFloat(prof.Score_mean) >= 4
                    ? "green"
                    : parseFloat(prof.Score_mean) >= 3
                    ? "orange"
                    : "red"
                }
                style={{
                  fontSize: 12,
                  padding: "2px 8px",
                  borderRadius: "8px",
                  width: "fit-content",
                }}
              >
                <StarFilled style={{ marginRight: 4 }} />
                {parseFloat(prof.Score_mean).toFixed(1)}
              </Tag>
            </Space>
          </div>
        ))}

        {selectedDept?.Top?.length === 0 && (
          <Text type="secondary">No hay profesores calificados aún.</Text>
        )}
      </Modal>
    </div>
  );
};

export default Sidebar;
