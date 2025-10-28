import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  theme,
  Typography,
  Avatar,
  Dropdown,
  Space,
  Badge
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LogoutOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined
} from '@ant-design/icons';
import backend from '../../config/backend';
import Solicitudes_admin from '../../Components/Admin/Solicitudes/Solicitudes.jsx';
import EstadisticasVisitas from '../Visitas.jsx';
import UserAdmin from '../../Components/Admin/UserAdmin/UserAdmin.jsx';
import UpdatePass from '../../Components/Admin/UpdatePass/UpdatePass.jsx';
import Docentes_admin from '../../Components/Admin/Docentes/Docentes_admin.jsx';
import Subjects_admin from '../../Components/Admin/Subjects/Subject_admin.jsx';
import { keyframes } from 'framer-motion';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const HomeAdmin = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [adminData, setAdminData] = useState(null);
  const [solicitudesNoAtendidas, setSolicitudesNoAtendidas] = useState(0);
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('adminToken');
    const storedAdminData = localStorage.getItem('adminData');

    if (!token || !storedAdminData) {
      navigate('/admin/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp < Date.now() / 1000;
      
      if (isExpired) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/admin/login');
      } else {
        setAdminData(JSON.parse(storedAdminData));
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      navigate('/admin/login');
    }
  }, [navigate]);

  // Obtener las solicitudes no atendidas
  useEffect(() => {
    const fetchSolicitudesNoAtendidas = async () => {
      try {
        const response = await fetch(`${backend}/request_revisions/countNewRequests`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        const data = await response.json();
        
        if (data.status === 'success') {
          setSolicitudesNoAtendidas(data.data.new_requests);
        }
      } catch (error) {
        console.error('Error al obtener las solicitudes no atendidas:', error);
      }
    };

    fetchSolicitudesNoAtendidas();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchSolicitudesNoAtendidas, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  // Menu items con badge para solicitudes
 const menuItems = [
  {
    key: '1',
    icon: <DashboardOutlined />,
    label: 'Inicio',
  },
  {
    key: '2',
    icon: <UserOutlined />,
    label: 'Mi perfil'
  },
  {
    key: '3',
    icon: <TeamOutlined />,
    label: 'Usuarios'
  },
  {
    key: '4',
    icon: <FileTextOutlined />,
    label: (
      <Badge 
        count={solicitudesNoAtendidas} 
        size="small" 
        offset={[10, 0]}
        style={{ 
          backgroundColor: '#ff4d4f',
          fontSize: '10px'
        }}
      >
        <span>Reportes</span>
      </Badge>
    ),
  },
  {
    key: '5',
    icon: <UserOutlined />,
    label: 'Docentes'
  },
  {
    key: '6',
    icon: <BookOutlined />,
    label: 'Materias'
  },
  {
    key: '7',
    icon: <BarChartOutlined />,
    label: 'Estadísticas',
  },
  {
    key: '8',
    icon: <LogoutOutlined />,
    label: 'Cerrar Sesión',
    danger: true,
  },
];

  const handleMenuClick = ({ key }) => {
    if (key === '8') {
      handleLogout();
      return;
    }
    setSelectedKey(key);
  };

  const userMenuItems = [
   
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar Sesión',
      danger: true,
      onClick: handleLogout,
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <h1>Bienvenido al Dashboard de Administración</h1>;
      case '2':
        return <UpdatePass id_user={adminData?.id} />;
      case '3':
        return <UserAdmin />;
      case '4':
        return <Solicitudes_admin id_admin={adminData?.id} />;
      case '5':
        return <Docentes_admin />;
      case '6':
        return <Subjects_admin />;
      case '7':
        return <EstadisticasVisitas />;
    
      default:
        return <h1>Bienvenido al Dashboard de Administración</h1>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', userSelect: 'none' }}>
      {/* Sidebar */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{ 
          padding: '16px', 
          textAlign: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            {collapsed ? 'EA' : 'Evaluasaurio'}
          </Title>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0, marginTop: '16px' }}
        />
      </Sider>

      {/* Layout principal */}
      <Layout style={{ 
        marginLeft: collapsed ? 80 : 200,
        transition: 'all 0.2s',
      }}>
        {/* Header */}
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Botón para colapsar sidebar */}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Notificación en el header */}
            {solicitudesNoAtendidas > 0 && (
              <Badge 
                count={solicitudesNoAtendidas} 
                size="small"
                style={{ 
                  backgroundColor: '#ff4d4f',
                }}
              >
                
              </Badge>
            )}
            
            <span style={{ fontSize: '14px', color: '#666' }}>
              {adminData?.email}
            </span>
            
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button type="text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#1890ff' }}
                />
                <span>Admin</span>
              </Button>
            </Dropdown>
          </div>
        </Header>

        {/* Contenido principal */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomeAdmin;