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
  Rate,
  Modal,
  Form,
  Input,
  Button,
  message
} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import SubjectSelect from "./Selects/SubjectSelect";
import { usePagination } from "../hooks/usePagination";

const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;
const { TextArea } = Input;

const PublicationByID_docente = ({ ocultarFoto, publications }) => {
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 ESTADOS PARA REPORTES
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [reportResult, setReportResult] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [form] = Form.useForm();

  const [filtersEnabled, setFiltersEnabled] = useState(false);
  const [scoreFilterEnabled, setScoreFilterEnabled] = useState(false);
  const [filterMateria, setFilterMateria] = useState("");
  const [filterScore, setFilterScore] = useState(null);
  const [filterDates, setFilterDates] = useState([]);

  const screens = useBreakpoint();

  // 🔥 FUNCIÓN PARA ABRIR MODAL DE REPORTE
  const handleReportClick = (e, publication) => {
    e.stopPropagation();
    setSelectedPublication(publication);
    setReportModalVisible(true);
  };

// 🔥 FUNCIÓN PARA ENVIAR REPORTE - CON MEJOR DEBUG
const handleReportSubmit = async (values) => {
  if (!selectedPublication) return;

  setReportLoading(true);
  try {
    console.log("📝 Datos del formulario:", values);
    console.log("📄 Publicación seleccionada:", selectedPublication);

    const result = await ReportPub(
      selectedPublication.calificacion_id,
      1, // publication_type = docente
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
    
    // 🔥 MOSTRAR ERROR ESPECÍFICO DEL BACKEND
    if (error.response && error.response.data) {
      message.error(error.response.data.message || "Error del servidor");
    } else {
      message.error("Error de conexión");
    }
  } finally {
    setReportLoading(false);
  }
};
  // Filtros
  useEffect(() => {
    setPublications([])
    changePathPublications(
      basePath+
      `?subject=${filterMateria ?? ""}`+
      `&score=${filterScore ?? ""}`+
      `&initDate=${filterDates[0]?.format("YYYY-MM-DD") ?? ""}`+
      `&endDate=${filterDates[1]?.format("YYYY-MM-DD") ?? ""}`
    )
  }, [filterMateria, filterScore, scoreFilterEnabled, filterDates, filtersEnabled]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Filtros */}
      <Card
        size="small"
        style={{
          borderRadius: "10px",
          marginBottom: 8,
          position: "sticky",
          top: 0,
          zIndex: 100
        }}
      >
        <Row gutter={[12, 12]} justify="center" align="middle">
          <Col xs={24} style={{ textAlign: "center" }}>
            <Checkbox
              checked={filtersEnabled}
              onChange={handleFilterChange}
            >
              {filtersEnabled ? "Desactivar filtros" : "Activar filtros"}
            </Checkbox>
          </Col>

          {filtersEnabled && (
            <>
              <Col xs={24} sm={8}>
                <SubjectSelect
                  placeholder={"Materia"}
                  onChange={setFilterMateria}
                  value={filterMateria}
                />
              </Col>

              <Col xs={24} sm={8} style={{ textAlign: "center" }}>
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
                    style={{ width: "90%", margin: "8px auto" }}
                  />
                )}
              </Col>

              <Col xs={24} sm={8}>
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
      </Card>

      {/* Lista */}
      <div id="publicationsTeacherConatiner" style={{ flex: 1, overflowY: "auto", padding: 8 }}>
        <InfiniteScroll
            dataLength={publications.length}
            next={handleNextPage}
            hasMore={hasMorePublications}
            loader={<Spin size="small" />}
            endMessage={<span>No hay más publicaciones</span>}
            scrollableTarget={"publicationsTeacherConatiner"}
          >
          <List
            dataSource={publications}
            itemLayout="horizontal"
            renderItem={(post) => (
              <List.Item style={{ padding: "8px 0" }}>
                <Card size="small" style={{ width: "100%" }}>
                  <Row gutter={[8, 8]}>
                    {!ocultarFoto && !screens.xs && (
                      <Col xs={0} sm={4} md={3}>
                        <Avatar size={40}>?</Avatar>
                      </Col>
                    )}

                    <Col xs={24} sm={20} md={21}>
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

                      <h4 style={{ margin: 0, wordBreak: "break-word" }}>
                        Opinión anónima
                      </h4>
                      <div style={{ marginBottom: 4, display: "flex", flexWrap: "wrap", gap: 4 }}>
                        <Tag color="green">{post.materia}</Tag>
                      </div>
                      <p style={{ margin: "4px 0" }}>
                        <Rate disabled defaultValue={post.score} />
                      </p>
                      <p style={{ margin: "4px 0" }}>{post.opinion}</p>
                      {Array.isArray(post.keywords) && post.keywords.length > 0 && (
                        <div style={{ marginBottom: 4, display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {post.keywords.map((kw, idx) => (
                            <Tag key={idx} color="volcano">{kw}</Tag>
                          ))}
                        </div>
                      )}
                      <p style={{ fontSize: "0.75em", color: "#888", margin: 0 }}>
                        {new Date(post.fecha).toLocaleString()}
                      </p>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        </InfiniteScroll>
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
                    <div><strong>Materia:</strong> {selectedPublication.materia}</div>
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

export default PublicationByID_docente;