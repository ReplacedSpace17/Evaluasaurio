import React, { useEffect, useState } from "react";
import {
  List,
  Card,
  Avatar,
  Spin,
  Tag,
  Row,
  Col,
  DatePicker,
  Slider,
  Checkbox,
  Grid,
  Modal,
  Form,
  Input,
  Button,
  message
} from "antd";
import backend from "../config/backend";
import { useNavigate } from "react-router-dom";
import { StarFilled } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePagination } from "../hooks/usePagination";
import TeacherSelect from "./Selects/TeacherSelect";
import SubjectSelect from "./Selects/SubjectSelect";
import DepartamentSelect from "./Selects/DepartamentSelect";

const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;
const { TextArea } = Input;

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [form] = Form.useForm();

  const [filtersEnabled, setFiltersEnabled] = useState(false);
  const [scoreFilterEnabled, setScoreFilterEnabled] = useState(false);

  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterMateria, setFilterMateria] = useState("");
  const [filterDepartamento, setFilterDepartamento] = useState("");
  const [filterScore, setFilterScore] = useState(null);
  const [filterDates, setFilterDates] = useState([]);
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const url = backend + "/publications/teachers";
  const [successModalVisible, setSuccessModalVisible] = useState(false); // 🔥 NUEVO
const [reportResult, setReportResult] = useState(null); // 🔥 NUEVO
  
  const renderStars = (score) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarFilled
          key={i}
          style={{
            color: i <= score ? "#ffc107" : "#e4e5e9",
            marginRight: 2,
            fontSize: 16,
          }}
        />
      );
    }
    return stars;
  };

  // 🔥 FUNCIÓN PARA ABRIR MODAL DE REPORTE
  const handleReportClick = (e, publication) => {
    e.stopPropagation(); // Evita que se active el click del card
    setSelectedPublication(publication);
    setReportModalVisible(true);
  };

// 🔥 FUNCIÓN PARA ENVIAR REPORTE - CON MODAL DE CONFIRMACIÓN
const handleReportSubmit = async (values) => {
  if (!selectedPublication) return;

  setReportLoading(true);
  try {
    const result = await ReportPub(
      selectedPublication.id,
      1,
      values.complaint_type,
      values.description
    );

    if (result.status === "success") {
      // 🔥 GUARDAR RESULTADO Y MOSTRAR MODAL DE CONFIRMACIÓN
      setReportResult(result);
      setReportModalVisible(false);
      setSuccessModalVisible(true); // 🔥 MOSTRAR MODAL DE ÉXITO
      form.resetFields();
    } else {
      message.error(result.message || "Error al enviar el reporte");
    }
  } catch (error) {
    console.error("Error enviando reporte:", error);
    message.error("Error de conexión");
  } finally {
    setReportLoading(false);
  }
};
  const fetchData = () => {
    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPublications(data);
          setFiltered(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  useEffect(() => {
    setLoading(true);
    let temp = [...publications];

    if (filtersEnabled) {
      if (filterTeacher) {
        temp = temp.filter((p) =>
          `${p.nombre_docente} ${p.apellido_paterno} ${p.apellido_materno}`
            .toLowerCase()
            .includes(filterTeacher.toLowerCase())
        );
      }
      if (filterMateria) {
        temp = temp.filter((p) => p.materia === filterMateria);
      }
      if (filterDepartamento) {
        temp = temp.filter((p) => p.departamento === filterDepartamento);
      }
      if (scoreFilterEnabled && filterScore !== null) {
        temp = temp.filter(
          (p) => p.puntaje >= filterScore && p.puntaje < filterScore + 1
        );
      }
      if (filterDates && filterDates.length === 2) {
        const [start, end] = filterDates;
        const startDate = new Date(start);
        const endDate = new Date(end);
        temp = temp.filter((p) => {
          const date = new Date(p.fecha_evaluacion);
          return date >= startDate && date <= endDate;
        });
      }
    }

    setTimeout(() => {
      setFiltered(temp);
      setLoading(false);
    }, 300);
  }, [
    filterTeacher,
    filterMateria,
    filterDepartamento,
    filterScore,
    scoreFilterEnabled,
    filterDates,
    publications,
    filtersEnabled
  ]);

  useEffect(() => {
    setData([])
      changePath(
        `${url}?teacher=${filterTeacher ?? ""}`+
        `&subject=${filterMateria ?? ""}`+
        `&departament=${filterDepartamento ?? ""}`+
        `&score=${filterScore ?? ""}`+
        `&initDate=${filterDates[0]?.format("YYYY-MM-DD") ?? ""}`+
        `&endDate=${filterDates[1]?.format("YYYY-MM-DD") ?? ""}`
        )
  }, [filterTeacher, filterMateria, filterDepartamento, filterScore,filterDates])

  const handleProfessorClick = (id) => {
    navigate(`/teacher/${id}`);
  };


  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Filtros */}
      <div
        style={{
          padding: 8,
          background: "#fff",
          borderBottom: "1px solid #ddd",
          position: "sticky",
          borderRadius: "10px",
          top: 0,
          marginBottom: 8,
          zIndex: 100
        }}
      >
        <Row gutter={[6, 6]} align="middle">
          <Col xs={24}>
            <Checkbox
              checked={filtersEnabled}
              onChange={handleFilterChange}
            >
              {filtersEnabled ? "Desactivar filtros" : "Activar filtros"}
            </Checkbox>
          </Col>

          {filtersEnabled && (
            <>
              <Col xs={12} sm={8}>
                <TeacherSelect
                  size="small"
                  initFecth={false}
                  placeholder={"Maestro"}
                  value={filterTeacher || undefined}
                  onChange={setFilterTeacher}
                />
              </Col>
              <Col xs={12} sm={8}>
                <SubjectSelect
                  onChange={setFilterMateria}
                  size="small"
                  initFecth={false}
                  placeholder={"Materia"}
                  value={filterMateria || undefined}
                />
              </Col>
              <Col xs={12} sm={8}>
                <DepartamentSelect
                  onChange={setFilterDepartamento}
                  size="small"
                  initFecth={false}
                  placeholder={"Departamento"}
                  value={filterDepartamento || undefined}
                />
              </Col>

              <Col xs={24} sm={12}>
                <Checkbox
                  checked={scoreFilterEnabled}
                  onChange={(e) => {
                    setScoreFilterEnabled(e.target.checked);
                    if (!e.target.checked) setFilterScore(null);
                  }}
                >
                  Filtrar por puntaje
                </Checkbox>
                {scoreFilterEnabled && (
                  <Slider
                    min={0}
                    max={5}
                    step={1}
                    marks={{ 0: "0", 5: "5" }}
                    value={filterScore}
                    onChange={setFilterScore}
                    style={{ width: "80%", marginLeft: 8 }}
                  />
                )}
              </Col>

              <Col xs={24} sm={12}>
                <RangePicker
                  size="small"
                  style={{ width: "100%" }}
                  value={filterDates && filterDates.length ? filterDates : null}
                  onChange={(dates) => setFilterDates(dates || [])}
                  allowClear
                  placeholder={["Fecha de inicio", "Fecha final"]}
                />
              </Col>
            </>
          )}
        </Row>
      </div>

      {/* Lista */}
      <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <> 
            <h3 style={{ margin: "8px 0", color: "#333" }}>Calificaciones recientes</h3>
            <List
              dataSource={filtered}
              itemLayout="horizontal"
              renderItem={(post) => (
                <List.Item style={{ padding: "8px 0" }}>
                  <Card 
                    size="small" 
                    style={{ width: "100%" }}
                    onClick={() => handleProfessorClick(post.id)}
                  >
                    <Row gutter={[8, 8]}>
                      {!screens.xs && (
                        <Col xs={0} sm={4} md={3}>
                          <Avatar size={40}>?</Avatar>
                        </Col>
                      )}
                      <Col xs={24} sm={20} md={21}>
                        {/* 🔥 ICONO DE REPORTE - Posicionado en esquina superior derecha */}
                        <div 
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            cursor: "pointer",
                            padding: 4,
                            borderRadius: 4,
                            backgroundColor: "rgba(255,255,255,0.8)"
                          }}
                          onClick={(e) => handleReportClick(e, post)}
                          title="Reportar contenido"
                        >
                          <FlagOutlined style={{ color: "#ff4d4f", fontSize: 16 }} />
                        </div>

                        <h4 style={{ margin: 0, wordBreak: "break-word" }}>
                          {post.nombre_docente} {post.apellido_paterno}{" "}
                          {post.apellido_materno}
                        </h4>
                        <div
                          style={{
                            marginBottom: 4,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 4
                          }}
                        >
                          <Tag color="blue">{post.departamento}</Tag>
                          <Tag color="green">{post.materia}</Tag>
                        </div>
                        <p style={{ margin: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", margin: "4px 0" }}>
                            {renderStars(post.puntaje)}
                            <span style={{ marginLeft: 6, fontSize: "0.85em", color: "#555" }}>
                              {Number(post.puntaje).toFixed(1)}
                            </span>
                          </div>
                        </p>
                        <p style={{ margin: "4px 0" }}>{post.opinion}</p>
                        <p style={{ fontSize: "0.75em", color: "#888", margin: 0 }}>
                          {new Date(post.fecha_evaluacion).toLocaleString()}
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </>
        )}
      </div>

     {/* 🔥 MODAL DE REPORTE */}
<Modal
  title="Reportar Contenido"
  open={reportModalVisible}
  centered
  onCancel={() => {
    setReportModalVisible(false);
    form.resetFields();
  }}
  footer={null}
  width={400}
>
  <Form
    form={form}
    layout="vertical"
    onFinish={handleReportSubmit}
  >
    <Form.Item
      name="complaint_type"
      label="Motivo del reporte"
      rules={[{ required: true, message: "Selecciona un motivo" }]}
    >
      <Select placeholder="Selecciona el motivo">
        <Option value={1}>Difamación</Option>
        <Option value={2}>Acoso</Option>
        <Option value={3}>Incitación a la violencia</Option>
        <Option value={4}>Información falsa</Option>
        <Option value={5}>Spam</Option>
        <Option value={6}>Otro</Option>
      </Select>
    </Form.Item>

    <Form.Item
      name="description"
      label="Explicación"
      rules={[{ required: true, message: "Describe el problema" }]}
    >
      <TextArea 
        rows={4} 
        placeholder="Explica por qué quieres reportar este contenido..."
        maxLength={500}
        showCount
      />
    </Form.Item>

    <Form.Item>
      <Button 
        type="primary" 
        htmlType="submit" 
        loading={reportLoading}
        style={{ width: "100%" }}
      >
        Enviar Reporte
      </Button>
    </Form.Item>
  </Form>
</Modal>

{/* 🔥 MODAL DE CONFIRMACIÓN COMPLETO */}
<Modal
  title="Reporte Enviado Exitosamente"
  open={successModalVisible}
  onCancel={() => setSuccessModalVisible(false)}
  footer={[
    <Button 
      key="close" 
      type="primary" 
      onClick={() => setSuccessModalVisible(false)}
    >
      Cerrar
    </Button>
  ]}
  width={500}
  centered
>
  <div style={{ padding: '20px 0' }}>
    <div style={{ textAlign: 'center', marginBottom: 20 }}>
      <span style={{ fontSize: '48px' }}>✅</span>
    </div>
    
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <strong>Número de Reporte:</strong>
        <div style={{ 
          background: '#f0f0f0', 
          padding: '8px', 
          borderRadius: '4px',
          marginTop: '4px'
        }}>
          #{reportResult?.request_id}
        </div>
      </Col>
      
      <Col span={12}>
        <strong>Fecha y Hora:</strong>
        <div style={{ 
          background: '#f0f0f0', 
          padding: '8px', 
          borderRadius: '4px',
          marginTop: '4px'
        }}>
          {reportResult?.created_at}
        </div>
      </Col>
      
      <Col span={24}>
        <strong>Contenido Reportado:</strong>
        <div style={{ 
          background: '#f0f8ff', 
          padding: '12px', 
          borderRadius: '4px',
          marginTop: '4px',
          border: '1px solid #d6e4ff'
        }}>
          {selectedPublication && (
            <>
              <div><strong>Docente:</strong> {selectedPublication.nombre_docente} {selectedPublication.apellido_paterno} {selectedPublication.apellido_materno}</div>
              <div><strong>Departamento:</strong> {selectedPublication.departamento}</div>
              <div><strong>Materia:</strong> {selectedPublication.materia}</div>
            </>
          )}
        </div>
      </Col>
      
      <Col span={24}>
        <strong>Proceso de Revisión:</strong>
        <div style={{ 
          background: '#fff7e6', 
          padding: '12px', 
          borderRadius: '4px',
          marginTop: '4px',
          border: '1px solid #ffd591'
        }}>
          <p style={{ margin: 0 }}>
            ✅ <strong>Reporte registrado</strong> - Nuestro equipo revisará el contenido en un plazo máximo de <strong>96 horas</strong>.
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
            Puedes consultar el estado de tu reporte en cualquier momento.
          </p>
        </div>
      </Col>
    </Row>
  </div>
</Modal>
    </div>
  );
};

export default Publications;