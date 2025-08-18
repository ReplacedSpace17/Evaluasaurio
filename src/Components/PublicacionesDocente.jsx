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
  Rate
} from "antd";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

const PublicationByID_docente = ({ocultarFoto, publications}) => {
  
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtersEnabled, setFiltersEnabled] = useState(true);
  const [scoreFilterEnabled, setScoreFilterEnabled] = useState(false);
  const [filterMateria, setFilterMateria] = useState("");
  const [filterScore, setFilterScore] = useState(null);
  const [filterDates, setFilterDates] = useState([]);

  const screens = useBreakpoint();



  // Filtros
  useEffect(() => {
    setLoading(true);
    let temp = [...publications];

    if (filtersEnabled) {
      if (filterMateria) {
        temp = temp.filter((p) => p.materia === filterMateria);
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
  }, [filterMateria, filterScore, scoreFilterEnabled, filterDates, publications, filtersEnabled]);

  const materiasList = [...new Set(publications.map((p) => p.materia))];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column",}}>
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
              onChange={(e) => setFiltersEnabled(e.target.checked)}
            >
              {filtersEnabled ? "Desactivar filtros" : "Activar filtros"}
            </Checkbox>
          </Col>

          {filtersEnabled && (
            <>
              <Col xs={24} sm={8}>
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
              <List.Item style={{ padding: "8px 0" }}>
                <Card size="small" style={{ width: "100%" }}>
                  <Row gutter={[8, 8]}>
                   {!ocultarFoto && !screens.xs && (
  <Col xs={0} sm={4} md={3}>
    <Avatar
      size={48}
      src={`https://i.pravatar.cc/150?u=${post.calificacion_id}`}
    />
  </Col>
)}

                    <Col xs={24} sm={20} md={21}>
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
        )}
      </div>
    </div>
  );
};

export default PublicationByID_docente;
