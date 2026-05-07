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
  Input,
  Modal,
  Form,
  Button,
  message
} from "antd";
import { FlagOutlined } from "@ant-design/icons";
import { ReportPub } from "../../../functions/ReportPub";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;
const { TextArea } = Input;

const PublicationByID_departaments = ({ ocultarFoto, publications }) => {
  console.log("🔍 Publications en PublicationByID_departaments:", publications);
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
  const [filterScore, setFilterScore] = useState(null);
  const [filterDates, setFilterDates] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");

  const screens = useBreakpoint();

 // 🔥 FUNCIÓN PARA ABRIR MODAL DE REPORTE - USANDO EL ID CORRECTO
const handleReportClick = (e, publication) => {
  e.stopPropagation();
  
  console.log("🔍 Publicación departamento individual:", publication);
  
  // ⚠️ USAR el id de la evaluación (no id_department)
  const targetId = publication.id; // Este es el id de department_evaluations
  
  if (!targetId) {
    console.error("❌ No se pudo encontrar el ID de la evaluación del departamento");
    message.error("Error: No se pudo identificar la evaluación");
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
      console.log("🔍 Publicación departamento individual antes de enviar:", selectedPublication);
      
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

  // Generar lista única de keywords desde los datos
  const keywordsList = [
    ...new Set(publications.flatMap((p) => p.keywords || [])),
  ];

  // Efecto de filtrado
  useEffect(() => {
    setLoading(true);
    let temp = [...publications];

    if (filtersEnabled) {
      // Filtrar por puntaje
      if (scoreFilterEnabled && filterScore !== null) {
        temp = temp.filter(
          (p) => p.score >= filterScore && p.score < filterScore + 1
        );
      }

      // Filtrar por rango de fechas
      if (filterDates && filterDates.length === 2) {
        const [start, end] = filterDates;
        const startDate = new Date(start);
        const endDate = new Date(end);
        temp = temp.filter((p) => {
          const date = new Date(p.fecha);
          return date >= startDate && date <= endDate;
        });
      }

      // Filtrar por palabra clave
      if (filterKeyword) {
        const keywordLower = filterKeyword.toLowerCase();
        temp = temp.filter((p) =>
          (p.keywords || []).some((kw) =>
            kw.toLowerCase().includes(keywordLower)
          )
        );
      }
    }

    // Simular carga y actualizar estado
    setTimeout(() => {
      setFiltered(temp);
      setLoading(false);
    }, 250);
  }, [filterScore, scoreFilterEnabled, filterDates, filterKeyword, publications, filtersEnabled]);

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
          zIndex: 100,
        }}
      >
        <Row gutter={[12, 12]} justify="center" align="middle">
          <Col xs={24} style={{ textAlign: "center" }}>
            <Checkbox
              checked={filtersEnabled}
              onChange={(e) => setFiltersEnabled(e.target.checked)}
            >
              {filtersEnabled ? "Desactivar filtros" : "Activar filtros"}
            </Checkbox>
          </Col>

          {filtersEnabled && (
            <>
              {/* Filtro por keyword */}
              <Col xs={24} sm={8}>
                <Select
                  size="small"
                  placeholder="Palabra clave"
                  allowClear
                  style={{ width: "100%" }}
                  value={filterKeyword || undefined}
                  onChange={setFilterKeyword}
                >
                  {keywordsList.map((kw) => (
                    <Option key={kw} value={kw}>
                      {kw}
                    </Option>
                  ))}
                </Select>
              </Col>

              {/* Filtro por puntaje */}
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

              {/* Filtro por fecha */}
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
      
      <h1 style={{
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
      }}
      >Feed del departamento</h1>
      
      {/* Lista */}
      <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Spin size="large" />
          </div>
        ) : filtered.length === 0 ? (
          <Card
            size="small"
            style={{
              textAlign: "center",
              padding: 24,
              background: "#fafafa",
              border: "1px dashed #ccc",
            }}
          >
            <p style={{ color: "#999" }}>No hay opiniones disponibles.</p>
          </Card>
        ) : (
          <List
            dataSource={filtered}
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

                      <h4 style={{ margin: 0 }}>Opinión anónima </h4>
                      <Rate disabled defaultValue={post.score} />
                      <p style={{ margin: "4px 0" }}>{post.opinion}</p>

                      {Array.isArray(post.keywords) && post.keywords.length > 0 && (
                        <div
                          style={{
                            marginBottom: 4,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 4,
                          }}
                        >
                          {post.keywords.map((kw, idx) => (
                            <Tag key={idx} color="volcano">
                              {kw}
                            </Tag>
                          ))}
                        </div>
                      )}

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
                    <div><strong>Calificación:</strong> {selectedPublication.score}/5</div>
                    <div><strong>Fecha de publicación:</strong> {new Date(selectedPublication.fecha).toLocaleString()}</div>
                    {selectedPublication.keywords && selectedPublication.keywords.length > 0 && (
                      <div><strong>Palabras clave:</strong> {selectedPublication.keywords.join(', ')}</div>
                    )}
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

export default PublicationByID_departaments;  