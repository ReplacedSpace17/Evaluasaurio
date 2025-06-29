import React, { useEffect, useState } from "react";
import { Layout, Avatar, Modal, Button, List, Card, Rate, Input, Empty, Select, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import "antd/dist/reset.css";
import backend from "../../config/backend";
import axios from "axios";

const { Header, Content } = Layout;
const { TextArea } = Input;

const Profile_Teacher = () => {
  const { id } = useParams();
  const [professor, setProfessor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [newSubject, setNewSubject] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true); // Estado para el loader
  const [modalMessage, setModalMessage] = useState({ visible: false, message: "", type: "" }); // Estado para el modal de mensajes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backend}/profileTeacher.php?id=${id}`);
        const data = await response.json();
        if (data.status === "success") {
          setProfessor(data.data);
          console.log(data.data);
        } else {
          setProfessor(null);

        }
      } catch (error) {
        console.error("Error al obtener los datos del profesor:", error);
        setProfessor(null);
      } finally {
        setLoading(false); // Desactivar el loader
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await fetch(backend + "/getMaterias.php");
        const data = await response.json();
        if (data.status === "success") {
          setSubjects(data.data);
        }
      } catch (error) {
        console.error("Error al obtener las materias:", error);
      }
    };

    fetchSubjects();
    fetchData();
  }, [id]);

  const handleShowModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  const handleSubjectChange = (value) => {
    if (value.includes("new")) {
      setNewSubject(value.replace("new-", ""));
      setSelectedSubject(value);
    } else {
      setSelectedSubject(value);
      setNewSubject(null);
    }
  };

  const handleSubjectSearch = (value) => {
    setSearchValue(value.toUpperCase()); // Convertir a mayúsculas
  };

  const handleRegisterSubject = async (nombre_materia) => {
    const data = { materia: nombre_materia.toUpperCase() }; // Convertir a mayúsculas

    try {
      const response = await axios.post(
        backend + "/addMateria.php",
        JSON.stringify(data),
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status === "success") {
        const newId = response.data.id;
        setSubjects([...subjects, { id: newId, name: nombre_materia.toUpperCase() }]);
        setSelectedSubject(newId);
        setNewSubject(null);
        return newId;
      } else {
        setModalMessage({ visible: true, message: response.data.message, type: "error" });
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error al registrar la materia:", error);
      return null;
    }
  };

  const handleSendOpinion = async (json) => {
    try {
      const response = await axios.post(
        backend + "/addCalificacion.php",
        JSON.stringify(json),
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status === "success") {
        setModalMessage({ visible: true, message: "Opinión registrada correctamente", type: "success" });
        handleCloseModal();
      } else {
        setModalMessage({ visible: true, message: response.data.message, type: "error" });
      }
    } catch (error) {
      console.error("Error al enviar la opinión:", error);
      setModalMessage({ visible: true, message: "Error al enviar la opinión", type: "error" });
    }
  };

  const handleSubmitRating = async () => {
    if (!selectedSubject) {
      setModalMessage({ visible: true, message: "Debes seleccionar o registrar una materia", type: "error" });
      return;
    }

    if (rating === 0) {
      setModalMessage({ visible: true, message: "Debes asignar una puntuación", type: "error" });
      return;
    }

    if (comment.trim() === "") {
      setModalMessage({ visible: true, message: "Debes escribir un comentario", type: "error" });
      return;
    }

    if (selectedSubject.includes("new")) {
      const newSubjectName = selectedSubject.replace("new-", "");
      const Id_Materia = await handleRegisterSubject(newSubjectName);
      if (Id_Materia) {
        const json = {
          teacher_id: parseInt(id),
          materia_id: parseInt(Id_Materia),
          score: rating,
          opinion: comment,
          keywords: keywords,
        };
        await handleSendOpinion(json);
      }
    } else {
      const json = {
        teacher_id: parseInt(id),
        materia_id: parseInt(selectedSubject),
        score: rating,
        opinion: comment,
        keywords: keywords,
      };
      await handleSendOpinion(json);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Avatar icon={<UserOutlined />} size={64} />
      </Header>
      <Content style={{ width: "80%", padding: "20px", maxWidth: "900px", margin: "auto", backgroundColor: "#fff" }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        ) : professor ? (
          <>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h2>{professor.name} {professor.apellido_p} {professor.apellido_m}</h2>
              <h4>{professor.departamento}</h4>
              <Rate disabled allowHalf defaultValue={professor.puntuacion_mean || 0} />
              <Button type="primary" onClick={handleShowModal} style={{ marginTop: "10px" }}>
                Calificar
              </Button>
            </div>

            <h3>Materias</h3>
            {professor.materias.length > 0 ? (
              <List
                dataSource={professor.materias}
                renderItem={(materia) => <List.Item>{materia.nombre.toUpperCase()}</List.Item>}
              />
            ) : (
              <Empty description="No hay materias registradas" />
            )}

            <h3>Opiniones</h3>
            <Input
              placeholder="Buscar opiniones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: "20px" }}
            />

            {professor.opiniones.length > 0 ? (
              <List
                dataSource={professor.opiniones.filter((op) =>
                  op.comentario.toLowerCase().includes(searchTerm.toLowerCase())
                )}
                renderItem={(opinion) => (
                  <Card key={opinion.id} style={{ marginBottom: "16px" }}>
                    <Card.Meta
                      title={`Puntuación: ${opinion.puntuacion}`}
                      description={opinion.comentario}
                    />
                  </Card>
                )}
              />
            ) : (
              <Empty description="No hay opiniones registradas" />
            )}
          </>
        ) : (
          <Empty description="No se encontraron datos del profesor" />
        )}

        <Modal
          title={`Calificar a ${professor ? professor.name : "Profesor"}`}
          open={modalVisible}
          onCancel={handleCloseModal}
          footer={null}
          centered={true}
        >
          <h3>Materia</h3>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Selecciona o agrega una materia"
            onSearch={handleSubjectSearch}
            onChange={handleSubjectChange}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            options={[
              ...subjects.map((subject) => ({ label: subject.name.toUpperCase(), value: subject.id })),
              ...(searchValue &&
                !subjects.some((subject) => subject.name.toLowerCase() === searchValue.toLowerCase())
                ? [{ label: `Registrar materia: "${searchValue.toUpperCase()}"`, value: `new-${searchValue}` }]
                : []),
            ]}
          />

          {newSubject !== null && (
            <Input
              placeholder="Nombre de la nueva materia"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value.toUpperCase())} // Convertir a mayúsculas
              style={{ marginTop: "10px" }}
            />
          )}

          <h3>Puntuación</h3>
          <Rate onChange={setRating} value={rating} />

          <h3>Opinión</h3>
          <TextArea rows={4} onChange={(e) => setComment(e.target.value)} value={comment} />

          <h3>Palabras Clave</h3>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Selecciona palabras clave"
            onChange={setKeywords}
            options={[
              { label: "Exigente", value: "Exigente" },
              { label: "Justo", value: "Justo" },
              { label: "Accesible", value: "Accesible" },
              { label: "Flexible", value: "Flexible" },
              { label: "Inspirador", value: "Inspirador" },
              { label: "Desorganizado", value: "Desorganizado" },
            ]}
          />

          <Button type="primary" onClick={handleSubmitRating} style={{ marginTop: "10px" }}>
            Enviar
          </Button>
        </Modal>

        <Modal
          title={modalMessage.type === "success" ? "Éxito" : "Error"}
          open={modalMessage.visible}
          onCancel={() => setModalMessage({ ...modalMessage, visible: false })}
          footer={[
            <Button key="close" onClick={() => setModalMessage({ ...modalMessage, visible: false })}>
              Cerrar
            </Button>,
          ]}
        >
          <p>{modalMessage.message}</p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Profile_Teacher;