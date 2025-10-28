import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backend from '../../config/backend.js';
import {
  Card,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Divider,
  Space,
  Alert,
  Layout,
  Row,
  Col,
  Modal,
  message
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  SafetyCertificateOutlined,
  UserAddOutlined
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;
const { Content } = Layout;

const LoginAdmin = () => {
  const [form] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingFirst, setCheckingFirst] = useState(false);
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  
  const navigate = useNavigate();

  // Verificar si es el primer administrador al cargar el componente
  useEffect(() => {
    checkIfFirstAdmin();
  }, []);

  const checkIfFirstAdmin = async () => {
    setCheckingFirst(true);
    try {
        console.log('url', `${backend}/admin/is-first`);
      const response = await fetch(`${backend}/admin/is-first`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setIsFirstAdmin(data.data.is_first);
      }
    } catch (error) {
      console.error('Error verificando estado:', error);
      message.error('Error al verificar el estado del sistema');
    } finally {
      setCheckingFirst(false);
    }
  };

  const handleNewUserClick = () => {
    if (isFirstAdmin) {
      setRegisterModalVisible(true);
    } else {
      message.warning('Ya existen administradores registrados. Contacta al administrador principal.');
    }
  };

  const handleRegister = async (values) => {
    setRegisterLoading(true);
    try {
      const response = await fetch(`${backend}/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        message.success('¡Administrador creado exitosamente! Ahora puedes iniciar sesión.');
        setRegisterModalVisible(false);
        registerForm.resetFields();
        setIsFirstAdmin(false); // Ya no es el primero
      } else {
        message.error(data.message || 'Error al crear el administrador');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      message.error('Error de conexión al crear administrador');
    } finally {
      setRegisterLoading(false);
    }
  };

  const onFinish = async (values) => {
  setLoading(true);
  setError('');
  
  try {
    const response = await fetch(`${backend}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password
      }),
    });

    const data = await response.json();

    if (data.status === 'success') {
      message.success('¡Login exitoso!');
      
      // GUARDAR TOKEN Y DATOS (AGREGADO)
      localStorage.setItem('adminToken', data.data.token);
      localStorage.setItem('adminData', JSON.stringify({
        id: data.data.id,
        email: data.data.email,
        active: data.data.active
      }));
      
      // Redirigir al dashboard
      navigate('/admin');
    } else {
      setError(data.message || 'Credenciales incorrectas');
    }
  } catch (err) {
    setError('Error de conexión. Por favor, intenta nuevamente.');
  } finally {
    setLoading(false);
  }
};

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Por favor ingresa la contraseña'));
    }
    
    if (value.length < 8) {
      return Promise.reject(new Error('La contraseña debe tener al menos 8 caracteres'));
    }
    
    if (!/(?=.*[a-z])/.test(value)) {
      return Promise.reject(new Error('Debe contener al menos una letra minúscula'));
    }
    
    if (!/(?=.*[A-Z])/.test(value)) {
      return Promise.reject(new Error('Debe contener al menos una letra mayúscula'));
    }
    
    if (!/(?=.*\d)/.test(value)) {
      return Promise.reject(new Error('Debe contener al menos un número'));
    }
    
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value)) {
      return Promise.reject(new Error('Debe contener al menos un carácter especial'));
    }
    
    return Promise.resolve();
  };

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 20
    }}>
      <Content style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <Row justify="center" style={{ width: '100%' }}>
          <Col xs={24} sm={20} md={12} lg={8} xl={6}>
            {/* Tarjeta de Login */}
            <Card
              style={{
                borderRadius: 16,
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: 'none',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)'
              }}
              bodyStyle={{ padding: 40 }}
            >
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ 
                  marginBottom: 16,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16
                  }}>
                    <SafetyCertificateOutlined style={{ fontSize: 28, color: 'white' }} />
                  </div>
                </div>
                <Title level={2} style={{ 
                  margin: 0, 
                  color: '#2D3748',
                  fontWeight: 600
                }}>
                  Evaluasaurio Admin
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  Acceso exclusivo para administradores
                </Text>
                
                {/* Indicador de primer administrador */}
                {checkingFirst && (
                  <Alert
                    message="Verificando estado del sistema..."
                    type="info"
                    showIcon
                    style={{ marginTop: 16, borderRadius: 8 }}
                  />
                )}
                
                {isFirstAdmin && !checkingFirst && (
                  <Alert
                    message="¡Bienvenido! Eres el primer administrador."
                    description="Regístrate para configurar el sistema."
                    type="success"
                    showIcon
                    style={{ marginTop: 16, borderRadius: 8 }}
                  />
                )}
              </div>

              {/* Mensaje de error */}
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  style={{ marginBottom: 24, borderRadius: 8 }}
                />
              )}

              {/* Formulario de Login */}
              <Form
                form={form}
                name="login"
                onFinish={onFinish}
                layout="vertical"
                requiredMark={false}
                size="large"
              >
                <Form.Item
                  name="email"
                  label="Correo electrónico"
                  rules={[
                    { 
                      required: true, 
                      message: 'Por favor ingresa tu correo electrónico' 
                    },
                    { 
                      type: 'email',
                      message: 'Ingresa un correo electrónico válido'
                    }
                  ]}
                  style={{ marginBottom: 20 }}
                >
                  <Input
                    prefix={<MailOutlined style={{ color: '#A0AEC0' }} />}
                    placeholder="admin@institucion.edu.mx"
                    style={{
                      borderRadius: 8,
                      padding: '12px 16px',
                      fontSize: 16
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Contraseña"
                  rules={[
                    { 
                      required: true, 
                      message: 'Por favor ingresa tu contraseña' 
                    }
                  ]}
                  style={{ marginBottom: 20 }}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: '#A0AEC0' }} />}
                    placeholder="••••••••"
                    iconRender={(visible) => 
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    style={{
                      borderRadius: 8,
                      padding: '12px 16px',
                      fontSize: 16
                    }}
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 24 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox style={{ fontSize: 14 }}>
                        Recordar sesión
                      </Checkbox>
                    </Form.Item>
                  </div>
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    style={{
                      height: 48,
                      borderRadius: 8,
                      fontSize: 16,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </Form.Item>
              </Form>

              {/* Footer */}
              <Divider style={{ margin: '24px 0' }}>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Acceso Seguro
                </Text>
              </Divider>
              
              <div style={{ textAlign: 'center' }}>
                <Space direction="vertical" size="small">
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ¿Primera vez en el sistema?
                  </Text>
                  <Space size="middle">
                    <Link 
                      onClick={handleNewUserClick} 
                      style={{ fontSize: 12 }}
                      disabled={checkingFirst}
                    >
                      <UserAddOutlined /> Nuevo administrador
                    </Link>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      •
                    </Text>
                    <Link onClick={() => { navigate("/privacy-policy") }} style={{ fontSize: 12 }}>
                      Política de privacidad
                    </Link>
                  </Space>
                </Space>
              </div>
            </Card>

            {/* Información adicional */}
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                © 2025 Singularity MX. Todos los derechos reservados.
              </Text>
            </div>
          </Col>
        </Row>
      </Content>

      {/* Modal de Registro para Primer Administrador */}
      <Modal
        title={
          <Space>
            <UserAddOutlined />
            <span>Crear Primer Administrador</span>
          </Space>
        }
        open={registerModalVisible}
        onCancel={() => setRegisterModalVisible(false)}
        footer={null}
        width={400}
        centered
        maskClosable={false}
      >
        <Alert
          message="Configuración inicial"
          description="Estás creando el primer administrador del sistema. Esta cuenta tendrá acceso completo."
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />
        
        <Form
          form={registerForm}
          name="register"
          onFinish={handleRegister}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Correo electrónico"
            rules={[
              { 
                required: true, 
                message: 'Por favor ingresa tu correo electrónico' 
              },
              { 
                type: 'email',
                message: 'Ingresa un correo electrónico válido'
              }
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#A0AEC0' }} />}
              placeholder="admin@institucion.edu.mx"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              { 
                validator: validatePassword
              }
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#A0AEC0' }} />}
              placeholder="Contraseña segura"
              iconRender={(visible) => 
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmar contraseña"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Por favor confirma tu contraseña',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden'));
                },
              }),
            ]}
            style={{ marginBottom: 24 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#A0AEC0' }} />}
              placeholder="Repite tu contraseña"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={registerLoading}
              block
              size="large"
              style={{
                background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                border: 'none',
                fontWeight: 600
              }}
            >
              {registerLoading ? 'Creando administrador...' : 'Crear Administrador'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default LoginAdmin;