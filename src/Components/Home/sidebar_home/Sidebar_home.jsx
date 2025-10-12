import React from "react";
import { Layout, Divider } from "antd";
import { StarFilled } from "@ant-design/icons";
import data from "./data_example.json";

const Sidebar_home = ({ width_component, title, padding_content }) => {
  return (
    <Layout.Sider
      width={width_component}
      style={{
        background: "none",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: padding_content,
        userSelect: "none",
        
        overflowY: "auto",
      }}
      breakpoint="lg"
      collapsedWidth="0"
    >
      {/* Título */}
      <h2
        style={{
          color: "#25292E",
          fontSize: 18,
          fontWeight: 600,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        {title}
      </h2>

      <Divider style={{ margin: "10px 0" }} />

      {/* Lista de elementos */}
      {data.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 16,
            padding: "8px 10px",
            borderRadius: 8,
            width: "100%",
            transition: "background 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <p
            style={{
              margin: 0,
              fontWeight: 600,
              color: "#25292E",
              fontSize: 15,
            }}
          >
            {item.name}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginTop: 3,
            }}
          >
            <StarFilled style={{ color: "#F5C518", fontSize: 14 }} />
            <span style={{ fontSize: 14, color: "#555" }}>
              {item.score} Estrellas
            </span>
            <span style={{ fontSize: 14, color: "#888" }}>/ {item.type}</span>
          </div>
        </div>
      ))}
    </Layout.Sider>
  );
};

export default Sidebar_home;
