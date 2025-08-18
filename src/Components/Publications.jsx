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
  Grid
} from "antd";
import backend from "../config/backend";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtersEnabled, setFiltersEnabled] = useState(true);
  const [scoreFilterEnabled, setScoreFilterEnabled] = useState(false);

  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterMateria, setFilterMateria] = useState("");
  const [filterDepartamento, setFilterDepartamento] = useState("");
  const [filterScore, setFilterScore] = useState(null);
  const [filterDates, setFilterDates] = useState([]);
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const url = backend + "/publications/teachers";

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
    }, 300); // pequeño delay para que se vea el loading
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

  const teachersList = [
    ...new Set(
      publications.map(
        (p) => `${p.nombre_docente} ${p.apellido_paterno} ${p.apellido_materno}`
      )
    )
  ];
  const materiasList = [...new Set(publications.map((p) => p.materia))];
  const departamentosList = [...new Set(publications.map((p) => p.departamento))];

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
          zIndex: 100
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
                  placeholder="Docente"
                  style={{ width: "100%" }}
                  value={filterTeacher || undefined}
                  onChange={setFilterTeacher}
                >
                  {teachersList.map((t) => (
                    <Option key={t} value={t}>
                      {t}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={12} sm={8}>
                <Select
                  size="small"
                  placeholder="Materia"
                  allowClear
                  style={{ width: "100%" }}
                  value={filterMateria || undefined}
                  onChange={setFilterMateria}
                >
                  {materiasList.map((m) => (
                    <Option key={m} value={m}>
                      {m}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={12} sm={8}>
                <Select
                  size="small"
                  placeholder="Departamento"
                  allowClear
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

              {/* Checkbox de Puntaje */}
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
          <List
            dataSource={filtered}
            itemLayout="horizontal"
            renderItem={(post) => (
              <List.Item style={{ padding: "8px 0" }} onClick={() => handleProfessorClick(post.id)} >
                <Card size="small" style={{ width: "100%" }}>
                  <Row gutter={[8, 8]}>
                    {!screens.xs && (
                      <Col xs={0} sm={4} md={3}>
                        <Avatar
                          size={48}
                          src={`https://i.pravatar.cc/150?u=${post.nombre_docente}`}
                        />
                      </Col>
                    )}
                    <Col xs={24} sm={20} md={21}>
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
                        <strong>Puntaje:</strong> {post.puntaje}
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
        )}
      </div>
    </div>
  );
};

export default Publications;
