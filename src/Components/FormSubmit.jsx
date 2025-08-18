import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Slider, Typography,  message, Modal } from "antd";
import { FaStar } from "react-icons/fa";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons"; // importamos la flecha

import backend from "../config/backend";
import { useNavigate } from "react-router-dom";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Swal from "sweetalert2";



const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const FormSubmit = ({id}) => {
    //obtener el id desde los parametros
const fpPromise = FingerprintJS.load();

const generateFingerprint = async () => {
  const fp = await fpPromise;
  const result = await fp.get();
  return result.visitorId; // string único
};

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [score, setScore] = useState(1); 
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
    const navigate = useNavigate();
const [dragging, setDragging] = useState(false);
  const keywords = [
    "excelente", "bueno", "regular", "malo", "muy malo", "recomendable", "no recomendable"
  ];
useEffect(() => {
  fetch(`${backend}/teachers`)
    .then(res => res.json())
    .then(result => {
      if (result.status === "success") {
        setTeachers(result.data);

        // Si el id de la URL es numero y no es 0, seleccionarlo en el formulario
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
}, [id, form]);

//enviar data al backend+/calification/submit
//enviar data al backend+/calification/submit
const SendData = async (values) => {
  setSubmitting(true);

  try {
    const fingerprint = await generateFingerprint();

    const payload = {
      ...values,
      user_fingerprint: fingerprint
    };

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
        console.log("Ya votó por este docente en esta materia");
        // ⚠️ Si ya votó, mostramos modal en lugar de solo message.error
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


//navigate to /submit/:id when the form is submitted
const navigateToSubmit = () => {
    //si el id es numero y no es 0, navegar a /submit/:id
    if (!isNaN(id) && id != 0) {
        navigate(`/teacher/${id}`);
    }
    else {
        navigate('/');
    }
}

  const onFinish = (values) => {
    setSubmitting(true);
    setTimeout(() => {
      console.log("Form values:", values);
      setSubmitting(false);
      setShowAnimation(true);
      message.success("Calificación enviada con éxito!");
      form.resetFields();
      setScore(1);

      // Animación de pantalla completa por 2.5s
      setTimeout(() => setShowAnimation(false), 2500);
      // Redirigir después de la animación
      setTimeout(navigateToSubmit, 2500);
    }, 1500);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = score >= i ? 1 : score >= i - 0.5 ? 0.5 : 0;
      stars.push(
        <FaStar
          key={i}
          style={{
            marginLeft: 16,
            fontSize: 24,
            color: filled ? "#ffc107" : "#e4e5e9",
            transform: filled ? "scale(1.3)" : "scale(1)",
            transition: "all 0.2s ease",
          }}
        />
      );
    }
    return stars;
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20, cursor: "pointer" }} onClick={() => navigate(-1)}>
      <ArrowLeftOutlined style={{ fontSize: 24, marginRight: 12, color: "#000" }} />
      <Title level={3} style={{ margin: 0 }}>
        Calificar docente
      </Title>
    </div>
      <Form form={form} layout="vertical" onFinish={SendData}>
        {/* Docente */}
        <Form.Item
          label="Docente"
          name="teacher_id"
          rules={[{ required: true, message: "Selecciona un docente" }]}
        >
        <Select
  placeholder="Escribe o selecciona un docente"
  showSearch
  optionFilterProp="label"   // 👈 clave: buscar en "label"
>
  {teachers.map((t) => (
    <Option 
      key={t.id} 
      value={t.id} 
      label={`${t.name} ${t.apellido_paterno} ${t.apellido_materno}`} // 👈 label string
    >
      {t.name} {t.apellido_paterno} {t.apellido_materno}
    </Option>
  ))}
</Select>

        </Form.Item>

        {/* Materia */}
        <Form.Item
          label="Materia"
          name="materia_id"
          rules={[{ required: true, message: "Selecciona una materia" }]}
        >
          <Select
  placeholder="Escribe o selecciona una materia"
  showSearch
  optionFilterProp="label"
>
  {subjects.map((s) => (
    <Option key={s.id} value={s.id} label={s.name}>
      {s.name}
    </Option>
  ))}
</Select>

        </Form.Item>

        {/* Calificación con estrellas */}
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
  step={0.1}
  marks={{1:"1",1.5:"1.5",2:"2",2.5:"2.5",3:"3",3.5:"3.5",4:"4",4.5:"4.5",5:"5"}}
  tooltipVisible={false} // deshabilitamos el tooltip por defecto
  tooltip={{ open: dragging }} // solo mostrar cuando se arrastra
  value={score}
  onChange={(val) => setScore(val)}
  onBeforeChange={() => setDragging(true)}   // empieza a arrastrar
  onAfterChange={() => setDragging(false)}   // termina de arrastrar
/>
        </Form.Item>

        {/* Opinión */}
        <Form.Item
          label="Opinión"
          name="opinion"
          rules={[{ required: true, message: "Escribe tu opinión" }]}
        >
          <TextArea rows={4} placeholder="Escribe tu opinión..." />
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
            {keywords.map((k) => (
              <Option key={k} value={k}>
                {k}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Botón */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={submitting}>
            Enviar calificación
          </Button>
        </Form.Item>
      </Form>

      {/* Animación pantalla completa */}
      {showAnimation && (
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%", height: "100%",
          backgroundColor: "#4caf50",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          animation: "popIn 0.5s ease forwards"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "50%",
            width: 120,
            height: 120,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 60,
            color: "#4caf50",
            animation: "scaleBounce 0.5s ease forwards"
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
