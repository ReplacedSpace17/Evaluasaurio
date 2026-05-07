import React, { useEffect, useState } from "react";
import { List, Typography, Tag, Spin } from "antd";
import { StarFilled } from "@ant-design/icons";
import backend from "../../../config/backend";
import "./sidebar.css";

// Ícono genérico para todos los departamentos
import iconDept from "../../../assets/icons/instalaciones.svg";
import corona from "../../../assets/icons/corona.svg";

const { Title, Text } = Typography;

const Sidebar_Departaments = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(backend + "/departments/top")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filtrar los que tienen score_mean distinto de null y ordenarlos
          const valid = data
            .filter((d) => d.score_mean !== null)
            .sort((a, b) => b.score_mean - a.score_mean);
          setDepartamentos(valid);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching departments:", err);
        setLoading(false);
      });
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
          alignItems: "center",
        }}
      >
        <div style={{ marginRight: 8 }}>
          <img src={corona} alt="Corona" style={{ width: 32, height: 32 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Title level={4} style={{ marginBottom: 0, color: "#222", fontSize: 14 }}>
            Mejores departamentos
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Basado en promedio de evaluaciones
          </Text>
        </div>
      </div>

      {/* Lista scrollable */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={departamentos}
            renderItem={(item, index) => (
              <List.Item
                style={{
                  cursor: "default",
                  padding: "10px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: 45,
                        height: 45,
                        backgroundColor: "#e2ebf7d0",
                        borderRadius: 10,
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={iconDept}
                        alt={item.nombre}
                        style={{
                          width: 28,
                          height: 28,
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  }
                  title={
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Text strong style={{ fontSize: 13 }}>
                        #{index + 1} {item.nombre}
                      </Text>
                    </div>
                  }
                  description={
                    <Tag
                      color={
                        item.score_mean >= 4
                          ? "green"
                          : item.score_mean >= 3
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
                      {item.score_mean.toFixed(1)}
                    </Tag>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar_Departaments;
