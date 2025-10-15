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
} from "antd";
import backend from "../../../config/backend";
import { StarFilled } from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;
import { useNavigate } from "react-router-dom";


const Publications_Departamento = () => {
  const [publications, setPublications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    </div>
  );
};

export default Publications_Departamento;
