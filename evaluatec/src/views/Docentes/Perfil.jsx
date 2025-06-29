import React, { useEffect, useState } from "react";
import { Layout, Avatar, Modal, Button, List, Card, Rate, Input, Empty, Select, Spin,  } from "antd";
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
      <Content style={{
        width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "50%",

      }}>

        <Content style={{
          display: "flex", flexDirection: "row",
          backgroundColor: "red", padding: "10px", width: "80%", maxWidth: "1150px", minWidth: "1000px", marginTop: "40px", height:"600px"
        }}>
          <Content style={{
            width: "40%", backgroundColor: "transparent", maxWidth: "350px", minWidth: "300px", marginRight: "10px", flexDirection: "column",
            alignContent: "center", justifyContent: "start", display: "flex",alignItems: "center", height:"auto"
          }}>
            <Content style={{
              width: "100%", backgroundColor: "white",
              height: "100%",
              maxHeight: "600px",
              border: "2px solid #C2C2C2",
              borderRadius: "15px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start"
            }}>
              <img style={{
                backgroundColor: "#e5e5f7",
opacity: "0.8",
backgroundImage:  "linear-gradient(#444cf7 1px, transparent 1px), linear-gradient(to right, #444cf7 1px, #e5e5f7 1px)",
"background-size": "20px 20px",
                width:"100%", height:"200px",
                borderRadius: "15px 15px 0px 0px"
              }}/>
<h1>Nombre</h1>
            </Content>
          </Content>
          <Content style={{
            width: "50%", backgroundColor: "black", maxWidth: "800px", minWidth: "600px", height: "100%",
          }}>
          </Content>
        </Content>
      </Content>
    </Layout>
  );
};

export default Profile_Teacher;