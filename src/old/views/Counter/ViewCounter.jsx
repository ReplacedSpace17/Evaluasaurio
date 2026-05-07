import backend from "../../config/backend";
import { useEffect, useState } from "react";
import { Layout, Card, Typography, Space, Button } from "antd";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Content } = Layout;

const ViewCounter = () => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTotal = async () => {
    setLoading(true);
    try {
      const res = await fetch(backend + '/califications/count');
      const data = await res.json();
      setTotal(data.publications);
    } catch (error) {
      console.error("Error fetching total publications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotal(); // obtener al cargar
    const interval = setInterval(fetchTotal, 3000); // actualizar cada 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card
          style={{ width: 350, textAlign: "center", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <EyeOutlined style={{ fontSize: 48, color: "#1890ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              {total}
            </Title>
            <Text type="secondary">Total de calificaciones en tiempo real</Text>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              loading={loading}
              onClick={fetchTotal}
            >
              Actualizar
            </Button>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default ViewCounter;
