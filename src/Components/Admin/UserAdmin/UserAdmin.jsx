import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Modal, Card, Row, Col, 
  Form, Input, Typography 
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, ExclamationCircleOutlined,
  MailOutlined, LockOutlined 
} from '@ant-design/icons';
import backend from '../../../config/backend';
import axios from 'axios';
import Swal from 'sweetalert2';

const { confirm } = Modal;
const { Title } = Typography;

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Email',
      dataIndex: 'correo',
      key: 'email',
      sorter: (a, b) => a.correo.localeCompare(b.correo),
    },
    {
      title: 'Estado',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      render: (active) => (
        <span style={{ color: active ? '#52c41a' : '#ff4d4f' }}>
          {active ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      title: 'Fecha Creación',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            disabled={!record.active}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  // Mostrar SweetAlert de éxito
  const showSuccessAlert = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonColor: '#1890ff',
      confirmButtonText: 'Aceptar',
      timer: 3000,
      timerProgressBar: true,
    });
  };

  // Mostrar SweetAlert de error
  const showErrorAlert = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#ff4d4f',
      confirmButtonText: 'Aceptar',
    });
  };

  // Mostrar SweetAlert de confirmación
  const showConfirmAlert = (title, text, confirmButtonText = 'Sí, eliminar') => {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4f',
      cancelButtonColor: '#8c8c8c',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });
  };

  // Cargar usuarios administradores
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backend}/admin/emails`);
      console.log('Fetched users:', response.data);

      if (response.data.status === 'success') {
        setUsers(response.data.data.admins || []);
      } else {
        showErrorAlert('Error', 'Error al cargar los usuarios');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showErrorAlert('Error', 'Error al cargar los usuarios administradores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Abrir modal para agregar usuario
  const handleAddUser = () => {
    setIsAddModalVisible(true);
  };

  // Cerrar modal
  const handleCancel = () => {
    setIsAddModalVisible(false);
    form.resetFields();
  };

  // Enviar formulario para crear usuario
  const handleSubmit = async (values) => {
    try {
      // Mostrar loading
      Swal.fire({
        title: 'Creando usuario...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await axios.post(`${backend}/admin/register`, {
        email: values.email,
        password: values.password
      });

      if (response.data.status === 'success') {
        Swal.close();
        showSuccessAlert('¡Éxito!', 'Usuario creado exitosamente');
        setIsAddModalVisible(false);
        form.resetFields();
        loadUsers(); // Recargar la lista de usuarios
      } else {
        Swal.close();
        showErrorAlert('Error', response.data.message || 'Error al crear el usuario');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      Swal.close();
      
      if (error.response && error.response.data) {
        showErrorAlert('Error', error.response.data.message || 'Error al crear el usuario');
      } else {
        showErrorAlert('Error', 'Error de conexión al crear el usuario');
      }
    }
  };

  // Validar contraseña
  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Por favor ingresa la contraseña'));
    }

    if (value.length < 8) {
      return Promise.reject(new Error('La contraseña debe tener al menos 8 caracteres'));
    }

    if (!/(?=.*[a-z])/.test(value)) {
      return Promise.reject(new Error('La contraseña debe contener al menos una letra minúscula'));
    }

    if (!/(?=.*[A-Z])/.test(value)) {
      return Promise.reject(new Error('La contraseña debe contener al menos una letra mayúscula'));
    }

    if (!/(?=.*[0-9])/.test(value)) {
      return Promise.reject(new Error('La contraseña debe contener al menos un número'));
    }

    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value)) {
      return Promise.reject(new Error('La contraseña debe contener al menos un carácter especial'));
    }

    return Promise.resolve();
  };

  // Confirmar contraseña
  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Las contraseñas no coinciden'));
    },
  });

  // Manejar eliminación individual
  const handleDelete = (user) => {
    showConfirmAlert(
      '¿Eliminar usuario?',
      `El usuario ${user.correo} será eliminado permanentemente. Esta acción no se puede deshacer.`,
      'Sí, eliminar'
    ).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUser(user.id);
      }
    });
  };

  // Manejar eliminación múltiple
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      showErrorAlert('Advertencia', 'Por favor selecciona al menos un usuario');
      return;
    }

    showConfirmAlert(
      '¿Eliminar usuarios seleccionados?',
      `Se eliminarán ${selectedRowKeys.length} usuario(s) permanentemente. Esta acción no se puede deshacer.`,
      `Sí, eliminar ${selectedRowKeys.length} usuario(s)`
    ).then(async (result) => {
      if (result.isConfirmed) {
        await deleteMultipleUsers(selectedRowKeys);
      }
    });
  };

  // Función para eliminar usuario (individual) - CORREGIDA
  const deleteUser = async (userId) => {
    try {
      // Mostrar loading
      Swal.fire({
        title: 'Eliminando usuario...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // CORRECCIÓN: Usar el endpoint correcto /admin/{id}/delete
      const response = await axios.delete(`${backend}/admin/${userId}/delete`);
      
      if (response.data.status === 'success') {
        Swal.close();
        showSuccessAlert('¡Eliminado!', 'Usuario eliminado correctamente');
        loadUsers();
        setSelectedRowKeys([]);
      } else {
        Swal.close();
        showErrorAlert('Error', response.data.message || 'Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.close();
      
      if (error.response && error.response.data) {
        showErrorAlert('Error', error.response.data.message || 'Error al eliminar el usuario');
      } else {
        showErrorAlert('Error', 'Error al eliminar el usuario');
      }
    }
  };

  // Función para eliminar múltiples usuarios - ACTUALIZADA
  const deleteMultipleUsers = async (userIds) => {
    try {
      // Mostrar loading
      Swal.fire({
        title: 'Eliminando usuarios...',
        text: `Eliminando ${userIds.length} usuario(s)`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Eliminar usuarios uno por uno usando el endpoint correcto
      const deletePromises = userIds.map(userId => 
        axios.delete(`${backend}/admin/${userId}/delete`)
      );

      // Esperar a que todas las eliminaciones se completen
      const results = await Promise.allSettled(deletePromises);
      
      // Contar eliminaciones exitosas
      const successfulDeletes = results.filter(result => 
        result.status === 'fulfilled' && result.value.data.status === 'success'
      ).length;

      const failedDeletes = userIds.length - successfulDeletes;

      Swal.close();

      if (failedDeletes === 0) {
        showSuccessAlert('¡Eliminados!', `${successfulDeletes} usuario(s) eliminados correctamente`);
      } else if (successfulDeletes > 0) {
        showSuccessAlert('Eliminación parcial', 
          `${successfulDeletes} usuario(s) eliminados, ${failedDeletes} fallaron`);
      } else {
        showErrorAlert('Error', 'No se pudo eliminar ningún usuario');
      }

      loadUsers();
      setSelectedRowKeys([]);

    } catch (error) {
      console.error('Error deleting users:', error);
      Swal.close();
      showErrorAlert('Error', 'Error al eliminar los usuarios');
    }
  };

  // Manejar selección de filas
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div style={{ width: '100%', height: '100vh', padding: '24px' }}>
      <Card 
        style={{ width: '100%', height: '100%' }}
        styles={{
          body: { 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column' 
          }
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                Administrar Usuarios
              </h1>
              <p style={{ margin: '4px 0 0 0', color: '#666' }}>
                Gestión de usuarios administradores del sistema
              </p>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddUser}
                >
                  Agregar Usuario
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Toolbar con selección múltiple */}
        {hasSelected && (
          <div style={{ marginBottom: 16, padding: '12px', background: '#f0f8ff', borderRadius: '6px' }}>
            <Space>
              <span style={{ fontWeight: 500 }}>
                {hasSelected ? `Seleccionados: ${selectedRowKeys.length}` : ''}
              </span>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleBatchDelete}
                disabled={!hasSelected}
              >
                Eliminar Seleccionados
              </Button>
            </Space>
          </div>
        )}

        {/* Tabla */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            rowSelection={rowSelection}
            scroll={{ y: 'calc(100vh - 250px)' }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} de ${total} usuarios`,
            }}
            style={{ height: '100%' }}
            size="middle"
          />
        </div>
      </Card>

      {/* Modal para agregar usuario */}
      <Modal
        title={
          <Space>
            <PlusOutlined />
            <span>Agregar Nuevo Usuario Administrador</span>
          </Space>
        }
        open={isAddModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={500}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa el email' },
              { type: 'email', message: 'Por favor ingresa un email válido' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="ejemplo@correo.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: 'Por favor ingresa la contraseña' },
              { validator: validatePassword }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Ingresa la contraseña"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Confirmar Contraseña"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Por favor confirma la contraseña' },
              validateConfirmPassword
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirma la contraseña"
              size="large"
            />
          </Form.Item>

          <div style={{ 
            marginTop: 24, 
            textAlign: 'right',
            borderTop: '1px solid #f0f0f0',
            paddingTop: 16
          }}>
            <Space>
              <Button onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Crear Usuario
              </Button>
            </Space>
          </div>
        </Form>

        {/* Información de requisitos de contraseña */}
        <div style={{ 
          marginTop: 16, 
          padding: 12, 
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: 6
        }}>
          <Title level={5} style={{ marginBottom: 8, fontSize: 14 }}>
            Requisitos de contraseña:
          </Title>
          <ul style={{ 
            margin: 0, 
            paddingLeft: 16, 
            fontSize: 12,
            color: '#666'
          }}>
            <li>Mínimo 8 caracteres</li>
            <li>Al menos una letra mayúscula</li>
            <li>Al menos una letra minúscula</li>
            <li>Al menos un número</li>
            <li>Al menos un carácter especial</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default UserAdmin;