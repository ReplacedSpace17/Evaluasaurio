import React, { useState } from "react";
import { Form, Input, Select, Button, Typography, Upload, DatePicker, Divider, message } from "antd";
import { ArrowLeftOutlined, CheckOutlined, UploadOutlined, CameraOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import backend from "../../config/backend";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import reduceImage from "../../views/Reportes/ReduceImage";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const FormularioReports = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [fileList, setFileList] = useState([]);

  // Tipos predefinidos de incidentes
 const tipos = [
  "Infraestructura y mantenimiento",
  "Seguridad",
  "Salud y bienestar",
  "Convivencia",
  "Tecnología y conectividad",
  "Recursos académicos",
  "Gestión administrativa",
  "Medio ambiente",
  "Comunicación y señalización",
  "Otros"
];


  // Enviar formulario
// Enviar formulario
const onFinish = async (values) => {
  try {
    setSubmitting(true);

    // Crear FormData para enviar texto y archivo
    const formData = new FormData();
    formData.append("tipo_incidente", values.tipo_incidente.trim());
    formData.append("descripcion", values.descripcion.trim());

    // Ubicación requerida
    formData.append("ubicacion", values.ubicacion.trim());

    // Fecha y hora opcional (usa la actual si no se seleccionó)
// Fecha seleccionada + hora actual del sistema
const fechaHora = values.fecha_hora
  ? dayjs(values.fecha_hora)
      .hour(dayjs().hour())    // hora actual
      .minute(dayjs().minute()) // minuto actual
      .second(dayjs().second()) // segundo actual
      .format("YYYY-MM-DD HH:mm:ss")
  : dayjs().format("YYYY-MM-DD HH:mm:ss");
formData.append("fecha_hora", fechaHora);


    // Archivo opcional con compresión
    if (fileList.length > 0 && fileList[0].originFileObj) {
      const compressedFile = await reduceImage(fileList[0].originFileObj, 1024, 1024, 0.7);
      formData.append("foto", compressedFile);
    }

    // Enviar la solicitud
    const res = await fetch(`${backend}/reports/add`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json().catch(() => ({
      message: "Error inesperado en la respuesta del servidor.",
    }));

    if (res.ok) {
      message.success("✅ ¡Reporte enviado correctamente!");
      form.resetFields();
      setFileList([]);
      setShowAnimation(true);

      // Esperar un poco para mostrar la animación antes de redirigir
      setTimeout(() => {
        setShowAnimation(false);
        navigate("/reports"); // redirige a la lista de reportes
      }, 1500);
    } else {
      console.error("Error del servidor:", data);
      Swal.fire("Error", data.message || "Ocurrió un error al enviar el reporte.", "error");
    }
  } catch (err) {
    console.error("Error en el envío:", err);
    Swal.fire("Error", "No se pudo enviar el reporte. Verifica tu conexión.", "error");
  } finally {
    setSubmitting(false);
  }
};



  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* Encabezado */}
      <div style={{ display: "flex", flexDirection: "column", marginBottom: 20 }}>
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          
        >
          <ArrowLeftOutlined style={{ fontSize: 24, marginRight: 12, color: "#000" }} onClick={() => navigate(-1)}/>
          <Title level={3} style={{ margin: 0 }}>
            Reportar Incidencia
          </Title>
        </div>
        <Divider />
        <Typography.Text type="secondary" style={{ fontSize: 14 }}>
          Tu reporte es confidencial. Por favor, describe claramente la incidencia.
        </Typography.Text>
      </div>

      {/* Formulario */}
      <Form layout="vertical" form={form} onFinish={onFinish}>
        {/* Tipo de incidente */}
        <Form.Item
          label="Tipo de incidencia"
          name="tipo_incidente"
          rules={[{ required: true, message: "Selecciona un tipo de incidencia" }]}
        >
          <Select
            placeholder="Selecciona un tipo"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {tipos.map((t) => (
              <Option key={t} value={t}>
                {t}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Descripción */}
        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[{ required: true, message: "Describe la incidencia" }]}
        >
          <TextArea
            rows={4}
            placeholder="Describe detalladamente lo ocurrido..."
            maxLength={3000}
            style={{ resize: "none" }}
          />
        </Form.Item>

        {/* Ubicación */}
        <Form.Item label="Ubicación" name="ubicacion" rules={[{ required: true, message: "Indica la ubicación en el campus" }]}>
          <Input placeholder="Ej. Pasillo principal, baño del segundo piso, etc." />
        </Form.Item>

        {/* Fecha y hora (opcional) */}
        {/* Fecha y hora (required) */}
<Form.Item
  label="Fecha del incidente"
  name="fecha_hora"
  rules={[{ required: true, message: "Selecciona la fecha del incidente" }]}
>
  <DatePicker
    style={{ width: "100%" }}
    placeholder="Selecciona la fecha del incidente"
  />
</Form.Item>



        {/* Foto */}
 <Form.Item label="Evidencia fotográfica (opcional)">
  {/* Input oculto que abre la cámara */}
 <input
  type="file"
  accept="image/*"
  capture="environment"
  style={{ display: "none" }}
  id="cameraInput"
  onChange={(e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        message.error("Solo se permiten archivos de imagen.");
        return;
      }
      setFileList([{ originFileObj: file, uid: '-1', name: file.name }]);
    }
  }}
/>


<Upload
  beforeUpload={(file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Solo se permiten archivos de imagen.");
    }
    return isImage ? true : Upload.LIST_IGNORE; // Ignora archivos no válidos
  }}
  fileList={fileList}
  onChange={({ fileList }) => setFileList(fileList.slice(-1))} // Solo 1 foto
  listType="picture"
  accept="image/*"
  maxCount={1} // Solo 1 imagen
  style={{ width: "100%" }}
>
  <Button style={{ width: "100%" }} icon={<UploadOutlined />}>Subir desde galería</Button>
</Upload>


  <Button
    icon={<CameraOutlined />}
    type="dashed"
    style={{ width: "100%", marginTop: 8 }}
    onClick={() => document.getElementById("cameraInput").click()}
  >
    Tomar foto con cámara
  </Button>
</Form.Item>



        {/* Botón enviar */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={submitting}>
            Enviar reporte
          </Button>
        </Form.Item>
      </Form>

      {/* Animación de éxito */}
      {showAnimation && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#4caf50",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            animation: "popIn 0.5s ease forwards",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "50%",
              width: 120,
              height: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 60,
              color: "#4caf50",
              animation: "scaleBounce 0.5s ease forwards",
            }}
          >
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

export default FormularioReports;
