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
} from "antd";
import { FilterOutlined, DownOutlined, PlusOutlined, HomeOutlined } from "@ant-design/icons";
import backend from "../../config/backend";
import { useNavigate } from "react-router-dom";

const { useBreakpoint } = Grid;
const { RangePicker } = DatePicker;

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
  const screens = useBreakpoint();
  const navigate = useNavigate();

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
                            src={`${backend}/uploads/reports/${report.foto}`}
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

    </div>
  );
};

export default FeedReports;
