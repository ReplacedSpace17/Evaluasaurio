// EstadisticasVisitas.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Card, Row, Col, Typography, Spin, Space } from "antd";
import { UserOutlined, BookOutlined, StarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import backend from "../config/backend";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const { Title: AntTitle } = Typography;

const EstadisticasVisitas = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${backend}/admin/statistics`)
      .then(res => setStats(res.data))
      .catch(err => console.error("Error cargando estadísticas:", err));
  }, []);

  if (!stats) return <div style={{ textAlign: "center", marginTop: "50px" }}><Spin size="large" /></div>;

  const days = stats.avg_session_duration_per_day.map(d => d.day).reverse();

  const avgDurationData = {
    labels: days,
    datasets: [
      {
        label: "Duración promedio (segundos)",
        data: stats.avg_session_duration_per_day.map(d => parseFloat(d.avg_duration)).reverse(),
        borderColor: "#1890ff",
        backgroundColor: "rgba(24, 144, 255, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const uniqueVisitsData = {
    labels: stats.unique_visits_per_day.map(d => d.day).reverse(),
    datasets: [
      {
        label: "Visitas únicas",
        data: stats.unique_visits_per_day.map(d => d.unique_visits).reverse(),
        backgroundColor: "#52c41a",
      },
    ],
  };

  const dailyCalificationsData = {
    labels: stats.daily_califications.map(d => d.day).reverse(),
    datasets: [
      {
        label: "Promedio calificación",
        data: stats.daily_califications.map(d => parseFloat(d.avg_score)).reverse(),
        backgroundColor: "#faad14",
      },
      {
        label: "Total calificaciones",
        data: stats.daily_califications.map(d => d.total_scores).reverse(),
        backgroundColor: "#f5222d",
      },
    ],
  };

  return (
    <div style={{ padding: "40px 20px", backgroundColor: "#f5f5f5", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "1200px" }}>
        <AntTitle level={2} style={{ marginBottom: "30px", textAlign: "center" }}>Estadísticas del Sistema</AntTitle>

        <Row gutter={[20, 20]} justify="center">
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Space align="center">
                <StarOutlined style={{ fontSize: "32px", color: "#faad14" }} />
                <div>
                  <h3>Total calificaciones</h3>
                  <h2>{stats.total_califications}</h2>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Space align="center">
                <UserOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
                <div>
                  <h3>Total maestros</h3>
                  <h2>{stats.total_teachers}</h2>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Space align="center">
                <BookOutlined style={{ fontSize: "32px", color: "#52c41a" }} />
                <div>
                  <h3>Total materias</h3>
                  <h2>{stats.total_subjects}</h2>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Space align="center">
                <ClockCircleOutlined style={{ fontSize: "32px", color: "#f5222d" }} />
                <div>
                  <h3>Última calificación</h3>
                  <h2>{stats.last_calification_date}</h2>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[20, 20]} style={{ marginTop: "30px" }}>
          <Col xs={24} md={24}>
            <Card title="Duración promedio de sesiones por día" bordered={false}>
              <Line data={avgDurationData} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[20, 20]} style={{ marginTop: "30px" }}>
          <Col xs={24} md={12}>
            <Card title="Visitas únicas por día" bordered={false}>
              <Bar data={uniqueVisitsData} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Calificaciones diarias" bordered={false}>
              <Bar data={dailyCalificationsData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EstadisticasVisitas;
