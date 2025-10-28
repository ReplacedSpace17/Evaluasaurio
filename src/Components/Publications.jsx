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
  Grid
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

const Publications = () => {
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

  //Hook para la paginacion
  const {data : publications, setData, nextPage, hasMore, changePath} = usePagination(url);

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
  
  const handleFilterChange = (e) => {
    if(!e.target.checked){
      //Limpiamos los filtros para volver hacer fetch limpio
      setFilterTeacher("")
      setFilterMateria("")
      setFilterDepartamento("")
      setFilterScore("")
      setFilterDates([])
    }

    setFiltersEnabled(e.target.checked)
  }

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
      <div id="listPublicationsContainer" style={{ flex: 1, overflowY: "auto", padding: 8 }}>
        <h3 style={{ margin: "8px 0", color: "#333" }}>Calificaciones recientes</h3>
          <InfiniteScroll
            dataLength={publications.length}
            next={nextPage}
            hasMore={hasMore}
            loader={<Spin size="small" />}
            endMessage={<span>No hay más publicaciones</span>}
            scrollableTarget="listPublicationsContainer"
          >
          <List
            dataSource={publications}
            itemLayout="horizontal"
            
            renderItem={(post) => (
              <List.Item style={{ padding: "8px 0" }} onClick={() => handleProfessorClick(post.id)} >
                <Card size="small" style={{ width: "100%" }}>
                  <Row gutter={[8, 8]}>
                    {!screens.xs && (
                      <Col xs={0} sm={4} md={3}>
                        <Avatar
                          size={40}
                        
                        >?</Avatar>
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
          </InfiniteScroll>
      </div>
    </div>
  );
};

export default Publications;
