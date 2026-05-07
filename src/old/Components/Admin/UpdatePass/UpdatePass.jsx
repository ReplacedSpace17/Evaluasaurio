import React, { useState } from 'react';
import { Form, Input, Button, Card, Space, Typography, Divider } from 'antd';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone, KeyOutlined } from '@ant-design/icons';
import backend from "../../../config/backend";
import axios from 'axios';
import Swal from 'sweetalert2';

const { Title, Text } = Typography;

const UpdatePass = ({ id_user, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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
      if (!value || getFieldValue('new_password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Las contraseñas no coinciden'));
    },
  });

  // Enviar formulario
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Mostrar loading
      Swal.fire({
        title: 'Actualizando contraseña...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Usar el endpoint específico para actualizar contraseña por admin
      const endpoint = `${backend}/admin/${id_user}/update-password`;

      const requestData = {
        new_password: values.new_password
      };

      const response = await axios.put(endpoint, requestData);

      if (response.data.status === 'success') {
        Swal.close();
        showSuccessAlert('¡Éxito!', 'Contraseña actualizada correctamente');
        form.resetFields();
        
        // Ejecutar callback de éxito si existe
        if (onSuccess) {
          onSuccess();
        }
      } else {
        Swal.close();
        showErrorAlert('Error', response.data.message || 'Error al actualizar la contraseña');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Swal.close();
      
      if (error.response && error.response.data) {
        showErrorAlert('Error', error.response.data.message || 'Error al actualizar la contraseña');
      } else {
        showErrorAlert('Error', 'Error de conexión al actualizar la contraseña');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <Card 
        style={{ 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f0f0f0'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Space direction="vertical" size="small">
            <KeyOutlined style={{ fontSize: 32, color: '#1890ff' }} />
            <Title level={3} style={{ margin: 0 }}>
              Actualizar Contraseña
            </Title>
            <Text type="secondary">
              ID de usuario: {id_user}
            </Text>
          </Space>
        </div>

        <Divider />

        {/* Formulario - SIN campo de contraseña actual */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          {/* Solo campos para nueva contraseña */}
          <Form.Item
            label="Nueva Contraseña"
            name="new_password"
            rules={[
              { required: true, message: 'Por favor ingresa la nueva contraseña' },
              { validator: validatePassword }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Ingresa la nueva contraseña"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            label="Confirmar Nueva Contraseña"
            name="confirm_password"
            dependencies={['new_password']}
            rules={[
              { required: true, message: 'Por favor confirma la nueva contraseña' },
              validateConfirmPassword
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Confirma la nueva contraseña"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          {/* Botones */}
          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              {onCancel && (
                <Button onClick={onCancel} disabled={loading}>
                  Cancelar
                </Button>
              )}
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{ minWidth: 120 }}
              >
                Actualizar Contraseña
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {/* Información de requisitos de contraseña */}
        <div style={{ 
          marginTop: 24, 
          padding: 16, 
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: 6
        }}>
          <Title level={5} style={{ marginBottom: 12, fontSize: 14, color: '#389e0d' }}>
            Requisitos de la nueva contraseña:
          </Title>
          <ul style={{ 
            margin: 0, 
            paddingLeft: 16, 
            fontSize: 12,
            color: '#389e0d'
          }}>
            <li>Mínimo 8 caracteres</li>
            <li>Al menos una letra mayúscula (A-Z)</li>
            <li>Al menos una letra minúscula (a-z)</li>
            <li>Al menos un número (0-9)</li>
            <li>Al menos un carácter especial (!@#$%^&* etc.)</li>
          </ul>
        </div>

        {/* Nota informativa actualizada */}
        <div style={{ 
          marginTop: 16, 
          padding: 12, 
          backgroundColor: '#e6f7ff',
          border: '1px solid #91d5ff',
          borderRadius: 6
        }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <strong>Nota:</strong> Esta acción actualizará la contraseña del usuario administrador con ID: {id_user}.
            Esta operación es realizada por un super administrador y no requiere la contraseña actual del usuario.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default UpdatePass;