import React, { useEffect, useState } from "react";
import {
  List,
  Card,
  Avatar,
  Spin,
  Tag,
  Row,
  Col,
  Grid,
  Button,
  Dropdown,
  Menu,
  DatePicker,
  Modal,
  Form,
  Input,
  message,
  Select
} from "antd";
import { 
  FilterOutlined, 
  DownOutlined, 
  PlusOutlined, 
  HomeOutlined,
  FlagOutlined 
} from "@ant-design/icons";
import backend from "../../config/backend";
import { useNavigate } from "react-router-dom";
import { ReportPub } from "../../functions/ReportPub";

const { useBreakpoint } = Grid;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// Colores para categorías, se asignan dinámicamente si no hay un color fijo
const colorsPalette = ["#f5222d", "#52c41a", "#fa8c16", "#722ed1", "#1890ff", "#13c2c2"];

const FeedReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterDates, setFilterDates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryColors, setCategoryColors] = useState({});

  // 🔥 ESTADOS PARA REPORTES
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportResult, setReportResult] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [form] = Form.useForm();

  const screens = useBreakpoint();
  const navigate = useNavigate();

  // 🔥 FUNCIÓN PARA ABRIR MODAL DE REPORTE
  const handleReportClick = (e, report) => {
    e.stopPropagation();
    
    console.log("🔍 Reporte de incidencia:", report);
    
    const targetId = report.id;
    
    if (!targetId) {
      console.error("❌ No se pudo encontrar el ID del reporte de incidencia");
      message.error("Error: No se pudo identificar el reporte");
      return;
    }
    
    setSelectedReport({
      ...report,
      id: targetId
    });
    setReportModalVisible(true);
  };

  // 🔥 FUNCIÓN PARA ENVIAR REPORTE
  const handleReportSubmit = async (values) => {
    if (!selectedReport) return;

    setReportLoading(true);
    try {
      console.log("🔍 Reporte de incidencia antes de enviar:", selectedReport);
      
      const targetId = selectedReport.id;
      
      if (!targetId) {
        throw new Error("No se pudo obtener el ID del reporte de incidencia");
      }

      const result = await ReportPub(
        targetId,
        3, // 🔥 publication_type = 3 para reportes_incidencia
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

  const fetchReports = () => {
    setLoading(true);
    fetch(`${backend}/reports/all`)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setReports(data.data);
          setFilteredReports(data.data);
          const uniqueCategories = Array.from(
            new Set(data.data.map((r) => r.tipo_incidente))
          );
          setCategories(uniqueCategories);
          // Asignar colores a cada categoría
          const colorsMap = {};
          uniqueCategories.forEach((cat, i) => {
            colorsMap[cat] = colorsPalette[i % colorsPalette.length];
          });
          setCategoryColors(colorsMap);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filtrado
  useEffect(() => {
    let temp = [...reports];

    if (filterCategory) {
      temp = temp.filter((r) => r.tipo_incidente === filterCategory);
    }

    if (filterDates.length === 2) {
      const [start, end] = filterDates;
      temp = temp.filter((r) => {
        const date = new Date(r.fecha_hora);
        return date >= start && date <= end;
      });
    }

    setFilteredReports(temp);
  }, [filterCategory, filterDates, reports]);

  // Menu de categorías dinámico
  const categoryMenu = (
    <Menu
      onClick={(e) => setFilterCategory(e.key === "all" ? null : e.key)}
      items={[
        { key: "all", label: "Todas las categorías" },
        ...categories.map((cat) => ({ key: cat, label: cat })),
      ]}
    />
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#ffffffff", padding: 16,}}>
      {/* Cabecera fija */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          padding: 16,
          backgroundColor: "#fff",
          border: "1px solid #cacacaff",
          borderRadius: 8,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/reports/submit")}
        >
          Reportar
        </Button>
        <Button
          type="default"
          icon={<HomeOutlined />}
          onClick={() => navigate("/menu")}
        >
          Home
        </Button>

        <Dropdown overlay={categoryMenu} placement="bottomLeft">
          <Button icon={<FilterOutlined />}>
            {filterCategory || "Filtrar"} <DownOutlined />
          </Button>
        </Dropdown>

        <RangePicker
          onChange={(dates) => {
            if (dates) {
              setFilterDates([dates[0].toDate(), dates[1].toDate()]);
            } else {
              setFilterDates([]);
            }
          }}
          allowClear
        />
      </div>

      {/* Scroll de publicaciones */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: 0, scrollbarWidth: "none", }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <List
            dataSource={filteredReports}
            itemLayout="vertical"
            renderItem={(report) => (
              <List.Item style={{ marginBottom: 16 }}>
                <Card
                  size="small"
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    border: "1px solid #cacacaff",
                  }}
                >
                  <Row gutter={[12, 12]} align="middle">
                    {!screens.xs && (
                      <Col xs={0} sm={4} md={3}>
                        <Avatar
                          size={50}
                          style={{
                            backgroundColor: "#1890ff",
                            fontWeight: "bold",
                            fontSize: 20,
                          }}
                        >
                          R
                        </Avatar>
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
                        onClick={(e) => handleReportClick(e, report)}
                        title="Reportar contenido"
                      >
                        <FlagOutlined style={{ color: "#ff4d4f", fontSize: 16 }} />
                      </div>

                      <h4 style={{ margin: 0, wordBreak: "break-word", fontWeight: 600 }}>
                        Anónimo ha realizado un reporte
                      </h4>

                      <Tag color={categoryColors[report.tipo_incidente] || "#888"}>
                        {report.tipo_incidente}
                      </Tag>

                      <p style={{ margin: "4px 0", color: "#555" }}>
                        <strong>Ubicación:</strong> {report.ubicacion}
                      </p>

                      <p style={{ margin: "4px 0", color: "#333" }}>{report.descripcion}</p>

                      {report.foto && report.foto !== "none" && (
                        <div style={{ textAlign: "center", marginTop: 12 }}>
                          <img
                            src={`${backend}/public/uploads/reports/${report.foto}`}
                            alt="Evidencia"
                            style={{
                              maxWidth: "100%",
                              borderRadius: 8,
                              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                            }}
                          />
                        </div>
                      )}

                      <p
                        style={{
                          fontSize: "0.75em",
                          color: "#888",
                          marginTop: 8,
                          textAlign: "right",
                        }}
                      >
                        {new Date(report.fecha_hora).toLocaleString()}
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
                {selectedReport && (
                  <>
                    <div><strong>Tipo de incidente:</strong> {selectedReport.tipo_incidente}</div>
                    <div><strong>Ubicación:</strong> {selectedReport.ubicacion}</div>
                    <div><strong>Fecha de publicación:</strong> {new Date(selectedReport.fecha_hora).toLocaleString()}</div>
                    {selectedReport.foto && selectedReport.foto !== "none" && (
                      <div><strong>Incluye evidencia fotográfica</strong></div>
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

export default FeedReports;