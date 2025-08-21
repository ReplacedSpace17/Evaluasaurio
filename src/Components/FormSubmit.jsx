import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Slider, Typography, message, Divider, Modal, Checkbox } from "antd";
import { FaStar } from "react-icons/fa";
import { ArrowLeftOutlined, CheckOutlined, QuestionCircleOutlined } from "@ant-design/icons"; 
import backend from "../config/backend";
import { useNavigate } from "react-router-dom";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Swal from "sweetalert2";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const FormSubmit = ({ id }) => {
  const fpPromise = FingerprintJS.load();
  const generateFingerprint = async () => {
    const fp = await fpPromise;
    const result = await fp.get();
    return result.visitorId;
  };
  const [notify, setNotify] = useState(false);

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [score, setScore] = useState(1); 
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hasSlid, setHasSlid] = useState(false); 
  const [modalTeacherVisible, setModalTeacherVisible] = useState(false);
  const [modalSubjectVisible, setModalSubjectVisible] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const navigate = useNavigate();
  const [departamentos, setDepartamentos] = useState([]);

const keywords = [
  // Recomendación general
  "recomendable",
  "muy recomendable",
  "no recomendable",
  "evitar",

  // Didáctica y enseñanza
  "claro",
  "confuso",
  "estructurado",
  "desorganizado",
  "dinámico",
  "monótono",
  "práctico",
  "solo teórico",
  "interactivo",
  "pasivo",

  // Comunicación y actitud
  "amable",
  "arrogante",
  "accesible",
  "difícil de contactar",
  "respetuoso",
  "irrespetuoso",
  "paciente",
  "impaciente",
  "empático",
  "indiferente",

  // Organización y cumplimiento
  "puntual",
  "impuntual",
  "organizado",
  "responsable",
  "irresponsable",
  "preparado",
  "improvisado",

  // Evaluación y feedback
  "justo",
  "injusto",
  "constructivo",
  "crítico",
  "objetivo",
  "subjetivo",
  "motivador para mejorar",
  "desmotivador"
];



  useEffect(() => {
    fetch(`${backend}/teachers`)
      .then(res => res.json())
      .then(result => {
        if (result.status === "success") {
          setTeachers(result.data);
          if (!isNaN(id) && id != 0) {
            form.setFieldsValue({ teacher_id: parseInt(id) });
          }
        }
      })
      .catch(console.error);

    fetch(`${backend}/subjects`)
      .then(res => res.json())
      .then(data => setSubjects(data))
      .catch(console.error);

      fetch(`${backend}/departments`)
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(console.error);
  }, [id, form]);

  // ========================== Calificación ==========================
  const SendData = async (values) => {
    setSubmitting(true);
    try {
      const fingerprint = await generateFingerprint();
      const payload = { ...values, user_fingerprint: fingerprint };

      const res = await fetch(`${backend}/califications/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setShowAnimation(true);
        message.success("Calificación enviada con éxito!");
        form.resetFields();
        setScore(1);

        setTimeout(() => setShowAnimation(false), 2500);
        setTimeout(navigateToSubmit, 2500);
      } else {
        if (res.status === 409) {
          Swal.fire({
            icon: 'warning',
            title: 'Ya enviaste una calificación para este docente en esta materia',
            text: 'Solo puedes enviar una calificación por docente y materia.',
            confirmButtonText: 'Entendido'
          });
        } else {
          message.error(data.message || "Error al enviar la calificación");
        }
      }
    } catch (err) {
      console.error(err);
      message.error("Ocurrió un error al enviar la calificación");
    } finally {
      setSubmitting(false);
    }
  };

  const navigateToSubmit = () => {
    if (!isNaN(id) && id != 0) {
      navigate(`/teacher/${id}`);
    } else {
      navigate('/');
    }
  };

 const renderStars = () => {
  if (!hasSlid) return null; 
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = score >= i ? 1 : score >= i - 0.5 ? 0.5 : 0;

    if (filled === 1) {
      // estrella llena
      stars.push(
        <FaStar
          key={i}
          style={{
            marginLeft: 16,
            fontSize: 24,
            color: "#ffc107",
            transform: "scale(1.3)",
            transition: "all 0.2s ease",
          }}
        />
      );
    } else if (filled === 0.5) {
      // media estrella
      stars.push(
        <div key={i} style={{ position: "relative", marginLeft: 16, width: 24, height: 24 }}>
          <FaStar
            style={{
              fontSize: 24,
              color: "#e4e5e9", // fondo gris
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <FaStar
            style={{
              fontSize: 24,
              color: "#ffc107", // mitad amarilla
              position: "absolute",
              top: 0,
              left: 0,
              clipPath: "inset(0 50% 0 0)", // 👈 recorta solo la mitad izquierda
              transform: "scale(1.3)",
              transition: "all 0.2s ease",
            }}
          />
        </div>
      );
    } else {
      // estrella vacía
      stars.push(
        <FaStar
          key={i}
          style={{
            marginLeft: 16,
            fontSize: 24,
            color: "#e4e5e9",
            transform: "scale(1)",
            transition: "all 0.2s ease",
          }}
        />
      );
    }
  }
  return stars;
};


  // ========================== Modal Teacher ==========================
const handleModalTeacherSubmit = async (values) => {
  setModalSubmitting(true);
  try {
    const payload = { ...values, department_id: values.departamento };
    delete payload.departamento;

    const res = await fetch(`${backend}/teacher_requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.status === 200) {
      await Swal.fire({
        icon: 'success',
        title: '¡Solicitud enviada!',
        text: data.message || 'La solicitud de docente se envió correctamente.',
        confirmButtonText: 'Aceptar',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: true
      });
      setModalTeacherVisible(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.message || 'No se pudo enviar la solicitud.',
        confirmButtonText: 'Aceptar'
      });
    }

  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un error al enviar la solicitud.',
      confirmButtonText: 'Aceptar'
    });
  } finally {
    setModalSubmitting(false);
  }
};

  // ========================== Modal Subject ==========================
  const handleModalSubjectSubmit = async (values) => {
  setModalSubmitting(true);
  try {
    const res = await fetch(`${backend}/subject_requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const data = await res.json();

    if (res.status === 200) {
      await Swal.fire({
        icon: 'success',
        title: '¡Solicitud enviada!',
        text: data.message || 'La solicitud de materia se envió correctamente.',
        confirmButtonText: 'Aceptar',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: true
      });
      setModalSubjectVisible(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.message || 'No se pudo enviar la solicitud.',
        confirmButtonText: 'Aceptar'
      });
    }

  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un error al enviar la solicitud.',
      confirmButtonText: 'Aceptar'
    });
  } finally {
    setModalSubmitting(false);
  }
};

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: 20, cursor: "default" }}>
        <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate(-1)}>
          <ArrowLeftOutlined style={{ fontSize: 24, marginRight: 12, color: "#000" }} />
          <Title level={3} style={{ margin: 0 }}>
            Calificar docente
          </Title>
        </div>
        <Divider />
        <Typography.Text type="secondary" style={{ fontSize: 14, marginTop: 4 }}>
          Tu calificación es 100% anónima y se usará solo con fines académicos.
        </Typography.Text>
      </div>

      <Form form={form} layout="vertical" onFinish={SendData}>
        {/* Docente */}
        <Form.Item
          label="Docente"
          name="teacher_id"
          rules={[{ required: true, message: "Selecciona un docente" }]}
        >
          <Select placeholder="Escribe o selecciona un docente" showSearch optionFilterProp="label">
            {teachers.map((t) => (
              <Option key={t.id} value={t.id} label={`${t.name} ${t.apellido_paterno} ${t.apellido_materno}`}>
                {t.name} {t.apellido_paterno} {t.apellido_materno}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Typography.Link 
          style={{ fontSize: 13, marginBottom: 12, display: "inline-flex", alignItems: "center" }}
          onClick={() => setModalTeacherVisible(true)}
        >
          <QuestionCircleOutlined style={{ marginRight: 6 }} /> ¿No ves al docente? Haz clic aquí
        </Typography.Link>

        {/* Materia */}
        <Form.Item
          label="Materia"
          name="materia_id"
          rules={[{ required: true, message: "Selecciona una materia" }]}
        >
          <Select placeholder="Escribe o selecciona una materia" showSearch optionFilterProp="label">
            {subjects.map((s) => (
              <Option key={s.id} value={s.id} label={s.name}>
                {s.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Typography.Link 
          style={{ fontSize: 13, marginBottom: 16, display: "inline-flex", alignItems: "center" }}
          onClick={() => setModalSubjectVisible(true)}
        >
          <QuestionCircleOutlined style={{ marginRight: 6 }} /> ¿No ves la materia? Haz clic aquí
        </Typography.Link>

        {/* Calificación */}
        <Form.Item
          label={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>Calificación</span>
              <div style={{ display: "flex" }}>{renderStars()}</div>
            </div>
          }
          name="score"
          rules={[{ required: true, message: "Selecciona una calificación" }]}
        >
          <Slider
            min={1}
            max={5}
            step={0.5}
            marks={{1:"1",1.5:"1.5",2:"2",2.5:"2.5",3:"3",3.5:"3.5",4:"4",4.5:"4.5",5:"5"}}
            tooltipVisible={false}
            tooltip={{ open: dragging }}
            value={score}
            onChange={(val) => {
              setScore(val);
              if (!hasSlid) setHasSlid(true);
            }}
            onBeforeChange={() => setDragging(true)}
            onAfterChange={() => setDragging(false)}
          />
        </Form.Item>

        {/* Opinión */}
        <Form.Item
          label="Opinión"
          name="opinion"
          rules={[{ required: true, message: "Escribe tu opinión" }]}
        >
          <TextArea rows={4} style={{ resize: "none" }} placeholder="Escribe tu opinión..." maxLength={2000}/>
        </Form.Item>

        {/* Palabras clave */}
        <Form.Item
          label="Palabras clave"
          name="keywords"
          rules={[{ required: true, message: "Selecciona al menos una palabra clave" }]}
        >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Selecciona o escribe palabras clave"
            maxTagCount={4}
            maxTagTextLength={15}
            onChange={(value) => {
              if (value.length > 4) value = value.slice(0, 4);
              form.setFieldsValue({ keywords: value });
            }}
          >
            {keywords.map((k) => <Option key={k} value={k}>{k}</Option>)}
          </Select>
        </Form.Item>

        {/* Botón */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={submitting}>
            Enviar calificación
          </Button>
        </Form.Item>
      </Form>

     {/* ========================== Modal Docente ========================== */}
<Modal
  title="Solicitud de registro de docente"
  open={modalTeacherVisible}
  onCancel={() => {
    setModalTeacherVisible(false);
    setNotify(false); // resetea el checkbox al cerrar
  }}
  footer={null}
  centered
>
  <Form layout="vertical" onFinish={handleModalTeacherSubmit}>
    <Form.Item label="Nombre" name="name" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item label="Apellido Paterno" name="apellido_paterno" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item label="Apellido Materno" name="apellido_materno" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item label="Sexo" name="sexo" rules={[{ required: true }]}>
      <Select>
        <Option value="M">Masculino</Option>
        <Option value="F">Femenino</Option>
      </Select>
    </Form.Item>

    {/* Checkbox para mostrar correo */}
    <Form.Item>
      <Checkbox checked={notify} onChange={(e) => setNotify(e.target.checked)}>
        Avisarme cuando se agregue el docente
      </Checkbox>
    </Form.Item>

    {/* Input de correo solo si notify es true */}
    {notify && (
      <Form.Item
        label="Correo"
        name="email"
        rules={[{ required: true, message: "Ingresa tu correo" }]}
      >
        <Input type="email" placeholder="tu@correo.com" />
      </Form.Item>
    )}

    <Form.Item label="Departamento" name="departamento" rules={[{ required: true }]}>
      <Select>
        {departamentos.map((d) => (
          <Option key={d.id} value={d.id}>{d.name}</Option>
        ))}
      </Select>
    </Form.Item>

    <Button type="primary" htmlType="submit" loading={modalSubmitting} block>
      Enviar solicitud
    </Button>
  </Form>
</Modal>

     
      {/* ========================== Modal Materia ========================== */}
      <Modal
        title="Solicitud de registro de nueva materia"
        open={modalSubjectVisible}
        onCancel={() => setModalSubjectVisible(false)}
        footer={null}
        centered
      >
        <Form layout="vertical" onFinish={handleModalSubjectSubmit}>
          <Form.Item label="Nombre" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          <Button type="primary" htmlType="submit" loading={modalSubmitting} block>
            Enviar solicitud
          </Button>
        </Form>
      </Modal>

      {/* Animación éxito */}
      {showAnimation && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "#4caf50", display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 9999, animation: "popIn 0.5s ease forwards"
        }}>
          <div style={{
            backgroundColor: "white", borderRadius: "50%", width: 120, height: 120,
            display: "flex", justifyContent: "center", alignItems: "center",
            fontSize: 60, color: "#4caf50", animation: "scaleBounce 0.5s ease forwards"
          }}>
            <CheckOutlined />
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes popIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes scaleBounce {
            0% { transform: scale(0); }
            50% { transform: scale(1.4); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default FormSubmit;
