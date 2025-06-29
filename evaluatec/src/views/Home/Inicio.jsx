import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Select, Modal, Button, List, Card, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import backend from "../../config/backend";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Header, Content, Sider } = Layout;
const { Option } = Select;

// Función para eliminar acentos
const removeAccents = (text) => {
  return text
    .normalize("NFD") // Normaliza el texto en forma de descomposición canónica
    .replace(/[\u0300-\u036f]/g, ""); // Elimina los caracteres diacríticos (acentos)
};

const Home = () => {
  const [professors, setProfessors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isRegisterModal, setIsRegisterModal] = useState(false);
  const [publications, setPublications] = useState([]); // Estado para las publicaciones
  const [loadingPublications, setLoadingPublications] = useState(true); // Estado para el loader de publicaciones

  const navigate = useNavigate();

  // Fetch the professors when the component mounts
  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await fetch(backend + "/getProfesors.php");
        const data = await response.json();
        if (data.status === "success") {
          setProfessors(data.data);
        }
      } catch (error) {
        console.error("Error fetching professors:", error);
      }
    };

    fetchProfessors();
  }, []);

  // Fetch the recent publications when the component mounts
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await axios.get(backend+"/getPublications.php");
        if (response.data.status === "success") {
          setPublications(response.data.data);
        } else {
          console.error("Error fetching publications:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching publications:", error);
      } finally {
        setLoadingPublications(false); // Desactivar el loader
      }
    };

    fetchPublications();
  }, []);

  // Filter professors based on search input with accent removal
  const filteredProfessors = professors.filter((professor) => {
    const fullName = `${professor.name} ${professor.apellido_paterno} ${professor.apellido_materno}`.toLowerCase();
    const normalizedFullName = removeAccents(fullName);
    const normalizedSearchTerm = removeAccents(searchTerm.toLowerCase());

    return normalizedFullName.includes(normalizedSearchTerm);
  });

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  // Handle professor selection
  const handleSelectProfessor = (id) => {
    // Navegar a la página del profesor seleccionado
    navigate(`/docente/${id}`);
  };

  // Handle "Registrar nuevo profesor" click
  const handleRegisterNew = () => {
    setIsRegisterModal(true);
    setModalVisible(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProfessor(null);
    setIsRegisterModal(false);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Avatar icon={<UserOutlined />} />
        <div style={{ width: "500px", margin: "0 auto" }}>
          <Select
            showSearch
            placeholder="Buscar profesor..."
            style={{ width: "100%" }}
            onSearch={handleSearchChange}
            onSelect={handleSelectProfessor}
            filterOption={false}
          >
            {filteredProfessors.map((professor) => (
              <Option key={professor.id} value={professor.id}>
                {`${professor.name} ${professor.apellido_paterno} ${professor.apellido_materno}`}
              </Option>
            ))}
            {filteredProfessors.length === 0 && searchTerm && (
              <Option key="new" value="new" onClick={handleRegisterNew}>
                Registrar nuevo profesor
              </Option>
            )}
          </Select>
        </div>
      </Header>
      <Layout>
        <Sider width={250} style={{ background: "#fff", padding: "16px" }}>
          <h3>Friends</h3>
          <List
            dataSource={["Alice", "Bob", "Charlie"]}
            renderItem={(item) => (
              <List.Item>
                <Avatar icon={<UserOutlined />} style={{ marginRight: "8px" }} /> {item}
              </List.Item>
            )}
          />
        </Sider>
        <Content style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
          {loadingPublications ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Spin size="large" />
            </div>
          ) : (
            <List
              dataSource={publications}
              renderItem={(post) => (
                <Card key={post.id} style={{ marginBottom: "16px" }}>
                  <Card.Meta
                    avatar={<Avatar src={`https://i.pravatar.cc/40?u=${post.teacher_id}`} />}
                    title={`${post.teacher} - ${post.materia}`}
                    description={
                      <>
                        <p>{post.opinion}</p>
                        <p>
                          <strong>Puntuación:</strong> {post.score}
                        </p>
                        <p>
                          <strong>Palabras clave:</strong> {post.keywords.join(", ")}
                        </p>
                        <p>
                          <strong>Fecha:</strong> {post.date}
                        </p>
                      </>
                    }
                  />
                </Card>
              )}
            />
          )}
        </Content>
      </Layout>

      {/* Modal to show professor details */}
      <Modal
        title="Detalles del Profesor"
        visible={modalVisible && !isRegisterModal}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedProfessor && (
          <div>
            <p>
              <strong>Nombre:</strong> {selectedProfessor.name} {selectedProfessor.apellido_paterno}{" "}
              {selectedProfessor.apellido_materno}
            </p>
            <p>
              <strong>Sexo:</strong> {selectedProfessor.sexo}
            </p>
          </div>
        )}
      </Modal>

      {/* Modal to register a new professor */}
      <Modal
        title="Registrar Nuevo Profesor"
        visible={modalVisible && isRegisterModal}
        onCancel={handleCloseModal}
        footer={null}
      >
        <div>
          <h3>Formulario de registro</h3>
          <p>Ingrese los detalles del nuevo profesor.</p>
          {/* Aquí agregarías los campos para registrar un nuevo profesor */}
          <Button type="primary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default Home;