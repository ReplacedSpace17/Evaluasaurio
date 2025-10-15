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
  Input
} from "antd";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

const PublicationByID_departaments = ({ ocultarFoto, publications }) => {
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtersEnabled, setFiltersEnabled] = useState(false);
  const [scoreFilterEnabled, setScoreFilterEnabled] = useState(false);
  const [filterScore, setFilterScore] = useState(null);
  const [filterDates, setFilterDates] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");

  const screens = useBreakpoint();

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
                      <h4 style={{ margin: 0 }}>Opinión anónima</h4>
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
    </div>
  );
};

export default PublicationByID_departaments;
