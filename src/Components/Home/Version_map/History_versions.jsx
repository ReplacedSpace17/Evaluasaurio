import React, { useState } from "react";
import { Modal, List } from "antd";

const History_versions = ({ data, width }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const openModal = (version) => {
    setSelectedVersion(version);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVersion(null);
  };

  return (
    <div
      style={{
        width: width,
        backgroundColor: "#FFFFFF",
        border: `1px solid #D1D9E0`,
        borderRadius: 12,
        marginTop: 20,
        padding: 20,
        maxHeight: 700,
        userSelect: "none",
      }}
    >
      <h2
        style={{
          fontSize: "17px",
          fontWeight: 400,
          marginBottom: 12,
          color: "#25292E",
        }}
      >
        Historial de versiones
      </h2>

      <div
        style={{
          position: "relative",
          paddingLeft: 20,
          borderLeft: "2px solid #D1D9E0",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              paddingLeft: 20,
              cursor: "pointer",
            }}
            onClick={() => openModal(item)}
          >
            <div
              style={{
                position: "absolute",
                left: "-26px",
                top: "5px",
                width: "10px",
                height: "10px",
                backgroundColor: "#D9D9D9",
                borderRadius: "50%",
              }}
            ></div>

            <div>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  marginBottom: 4,
                  color: "#6B747E",
                }}
              >
                {item.nameversion}
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "#21252A",
                  margin: 0,
                }}
              >
                {item.resume}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        title={selectedVersion?.nameversion}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={600}
        centered
      >
        {selectedVersion && (
          <div>
            <p>
              <strong>Fecha:</strong> {selectedVersion.date}
            </p>
            <p>{selectedVersion.description}</p>
            <h4 style={{ marginTop: 20 }}>Cambios:</h4>

            {/* Contenedor con scroll */}
            <div
              style={{
                maxHeight: 300, // altura máxima visible
                overflowY: "auto",
                paddingRight: 10,
                border: "1px solid #f0f0f0",
                borderRadius: 8,
              }}
            >
              <List
                size="small"
                dataSource={selectedVersion.changes}
                renderItem={(change, index) => (
                  <List.Item key={index}>• {change}</List.Item>
                )}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default History_versions;
