import React, { useEffect, useState } from "react";
import {
  List,
  Card,
  Avatar,
  Spin,
  Tag,
  Row,
  Col,
  Select,
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
import backend from "../../../config/backend";
import { StarFilled, FlagOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ReportPub } from "../../../functions/ReportPub";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;
const { TextArea } = Input;

const Publications_Departamento = () => {
  const [publications, setPublications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔥 ESTADOS PARA REPORTES
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [reportResult, setReportResult] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [form] = Form.useForm();

  const [filtersEnabled, setFiltersEnabled] = useState(false);
  const [scoreFilterEnabled, setScoreFilterEnabled] = useState(false);

  const [filterDepartamento, setFilterDepartamento] = useState("");
  const [filterJefatura, setFilterJefatura] = useState("");
  const [filterScore, setFilterScore] = useState(null);
  const [filterDates, setFilterDates] = useState([]);
  const screens = useBreakpoint();

  const url = backend + "/departamentos/opiniones";

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
    e.stopPropagation();
    
    console.log("🔍 Publicación departamento:", publication);
    
    // ⚠️ USAR id SI EXISTE, SINO id_department
    const targetId = publication.id || publication.id_department;
    
    if (!targetId) {
      console.error("❌ No se pudo encontrar el ID de la publicación del departamento");
      message.error("Error: No se pudo identificar la publicación");
      return;
    }
    
    setSelectedPublication({
      ...publication,
      id: targetId
    });
    setReportModalVisible(true);
  };

  // 🔥 FUNCIÓN PARA ENVIAR REPORTE
  const handleReportSubmit = async (values) => {
    if (!selectedPublication) return;

    setReportLoading(true);
    try {
      console.log("🔍 Publicación departamento antes de enviar:", selectedPublication);
      
      const targetId = selectedPublication.id;
      
      if (!targetId) {
        throw new Error("No se pudo obtener el ID de la publicación del departamento");
      }

      const result = await ReportPub(
        targetId,
        2, // 🔥 publication_type = 2 para departamentos
        values.complaint_type,
        values.description
      );

      if (result.status === "success") {
        setReportResult(result);
        setReportModalVisible(false);
        setSuccessModalVisible(true);
        form.resetFields();
      } else {
        message.error(result.message || "Error al enviar el reporte");
      }
    } catch (error) {
      console.error("❌ Error completo en handleReportSubmit:", error);
      
      if (error.response && error.response.data) {
        message.error(error.response.data.message || "Error del servidor");
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error("Error de conexión");
      }
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
      if (filterDepartamento) {
        temp = temp.filter((p) =>
          p.departamento.toLowerCase().includes(filterDepartamento.toLowerCase())
        );
      }
      if (filterJefatura) {
        temp = temp.filter((p) =>
          p.jefatura.toLowerCase().includes(filterJefatura.toLowerCase())
        );
      }
      if (scoreFilterEnabled && filterScore !== null) {
        temp = temp.filter(
          (p) => p.score >= filterScore && p.score < filterScore + 1
        );
      }
      if (filterDates && filterDates.length === 2) {
        const [start, end] = filterDates;
        const startDate = new Date(start);
        const endDate = new Date(end);
        temp = temp.filter((p) => {
          const date = new Date(p.fecha);
          return date >= startDate && date <= endDate;
        });
      }
    }

    setTimeout(() => {
      setFiltered(temp);
      setLoading(false);
    }, 300);
  }, [
    filterDepartamento,
    filterJefatura,
    filterScore,
    scoreFilterEnabled,
    filterDates,
    publications,
    filtersEnabled,
  ]);

  const departamentosList = [...new Set(publications.map((p) => p.departamento))];
  const jefaturasList = [...new Set(publications.map((p) => p.jefatura))];

  const handleDepartamentClick = (id) => {
    navigate(`/departament/${id}`);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
          zIndex: 100,
        }}
      >
        <Row gutter={[6, 6]} align="middle">
          <Col xs={24}>
            <Checkbox
              checked={filtersEnabled}
              onChange={(e) => setFiltersEnabled(e.target.checked)}
            >
              {filtersEnabled ? "Desactivar filtros" : "Activar filtros"}
            </Checkbox>
          </Col>

          {filtersEnabled && (
            <>
              <Col xs={12} sm={8}>
                <Select
                  size="small"
                  showSearch
                  allowClear
                  placeholder="Departamento"
                  style={{ width: "100%" }}
                  value={filterDepartamento || undefined}
                  onChange={setFilterDepartamento}
                >
                  {departamentosList.map((d) => (
                    <Option key={d} value={d}>
                      {d}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={12} sm={8}>
                <Select
                  size="small"
                  showSearch
                  allowClear
                  placeholder="Jefatura"
                  style={{ width: "100%" }}
                  value={filterJefatura || undefined}
                  onChange={setFilterJefatura}
                >
                  {jefaturasList.map((j) => (
                    <Option key={j} value={j}>
                      {j}
                    </Option>
                  ))}
                </Select>
              </Col>

              {/* Filtro de puntaje */}
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
                    step={0.5}
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
            <h3 style={{ margin: "8px 0", color: "#333" }}>
              Opiniones recientes de departamentos
            </h3>
            <List
              dataSource={filtered}
              itemLayout="horizontal"
              renderItem={(post) => (
                <List.Item style={{ padding: "8px 0" }} onClick={() => handleDepartamentClick(post.id_department)} >
                  <Card size="small" style={{ width: "100%" }}>
                    <Row gutter={[8, 8]}>
                      {!screens.xs && (
                        <Col xs={0} sm={3}>
                          <Avatar size={40}>{post.departamento.charAt(0)}</Avatar>
                        </Col>
                      )}
                      <Col xs={24} sm={21}>
                        {/* 🔥 ICONO DE REPORTE */}
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

                        <h4 style={{ margin: 0, wordBreak: "break-word", fontWeight: "bold" }}>
                          {post.departamento}
                        </h4>
                        <div
                          style={{
                            marginBottom: 4,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 4,
                          }}
                        >
                          <Tag color="blue">{post.jefatura}</Tag>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "4px 0",
                          }}
                        >
                          {renderStars(post.score)}
                          <span
                            style={{
                              marginLeft: 6,
                              fontSize: "0.85em",
                              color: "#555",
                            }}
                          >
                            {Number(post.score).toFixed(1)}
                          </span>
                        </div>

                        <p style={{ margin: "4px 0" }}>{post.opinion}</p>

                        <div style={{ marginBottom: 6 }}>
                          {post.keywords?.map((kw, i) => (
                            <Tag key={i} color="purple">
                              {kw}
                            </Tag>
                          ))}
                        </div>

                        <p
                          style={{
                            fontSize: "0.75em",
                            color: "#888",
                            margin: 0,
                          }}
                        >
                          {new Date(post.fecha).toLocaleString()}
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
        title="✅ Reporte Enviado Exitosamente"
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
                    <div><strong>Departamento:</strong> {selectedPublication.departamento}</div>
                    <div><strong>Jefatura:</strong> {selectedPublication.jefatura}</div>
                    <div><strong>Calificación:</strong> {selectedPublication.score}/5</div>
                    <div><strong>Fecha de publicación:</strong> {new Date(selectedPublication.fecha).toLocaleString()}</div>
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

export default Publications_Departamento;