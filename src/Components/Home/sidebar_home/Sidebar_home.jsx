import React, { useState } from "react";
import { Layout, Divider, Modal } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const Sidebar_home = ({ width_component, title, padding_content }) => {
  const [openModal, setOpenModal] = useState(null);

  const questions = [
    {
      title: "¿Qué busca Evaluasaurio?",
      answer:
        "Esta plataforma busca promover la participación de estudiantes en la evaluación de sus docentes, departamentos e instalaciones académicas, con el fin de que cualquier persona pueda decidir si inscribirse o no en una materia o carrera.",
    },
    {
      title: "¿Quién desarrolló Evaluasaurio?",
      answer:
        "Fue desarrollada por el colectivo de ciencia abierta Singularity, el cuál forma parte del movimiento mundial del DIY Bio. ",
    },
    {
      title: "¿Está activo el proyecto?",
      answer:
        "Sí, actualmente se encuentra activo y en constante mejora para ofrecer nuevas funcionalidades y experiencias.",
    },
    {
      title: "¿Puedo colaborar?",
      answer:
        "Claro, en Singularity siempre estamos abiertos a recibir colaboraciones. Puedes contactarnos a través de nuestras redes sociales o al siguiente correo electrónico: replacedspace17@singularitymx.org",
    },
        {
      title: "¿Puedo implementarlo en mi institución?",
      answer:
        "Por supuesto, Evaluasaurio está diseñado para ser una herramienta flexible y adaptable. Si estás interesado en implementarlo en tu institución, no dudes en contactarnos para discutir los detalles. También puedes revisar el repositorio del proyecto en: https://github.com/ReplacedSpace17/Evaluasaurio",
    },
  ];

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

      {/* Lista de preguntas */}
      {questions.map((q, index) => (
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
          onClick={() => setOpenModal(index)}
        >
          <p
            style={{
              margin: 0,
              fontWeight: 300,
              color: "#25292E",
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <QuestionCircleOutlined style={{ color: "#1677ff" }} />
            {q.title}
          </p>
        </div>
      ))}

      {/* Modal dinámico */}
      {openModal !== null && (
        <Modal
          open={openModal !== null}
          onCancel={() => setOpenModal(null)}
          onOk={() => setOpenModal(null)}
          centered
          title={questions[openModal].title}
          okText="Cerrar"
          cancelButtonProps={{ style: { display: "none" } }}
        >
          <p style={{ fontSize: 15, color: "#444", fontWeight: 300 }}>
            {questions[openModal].answer}
          </p>
        </Modal>
      )}
    </Layout.Sider>
  );
};

export default Sidebar_home;
