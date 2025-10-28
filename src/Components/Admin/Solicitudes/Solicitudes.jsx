import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Button,
  Modal,
  Space,
  Typography,
  Card,
  Select,
  Form,
  Input,
  message,
  Popconfirm,
  Tooltip,
  Divider,
  Badge
} from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import backend from '../../../config/backend';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Solicitudes_admin = ({ id_admin }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Estados para los ENUMs
  const statusOptions = [
    { value: 'recibido', label: 'Recibido', color: 'blue' },
    { value: 'en_revisión', label: 'En Revisión', color: 'orange' },
    { value: 'resuelto', label: 'Resuelto', color: 'green' },
    { value: 'rechazado', label: 'Rechazado', color: 'red' }
  ];

  const resolutionOptions = [
    { value: 'contenido_eliminado', label: 'Contenido Eliminado', color: 'red' },
    { value: 'contenido_modificado', label: 'Contenido Modificado', color: 'orange' },
    { value: 'sin_cambios', label: 'Sin Cambios', color: 'green' },
    { value: 'usuario_suspendido', label: 'Usuario Suspendido', color: 'purple' }
  ];

  // Obtener solicitudes
  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backend}/request_revisions/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      setSolicitudes(data);
    } catch (error) {
      console.error('Error al obtener las solicitudes:', error);
      message.error('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  // Mostrar modal de detalles
  const showDetailsModal = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setModalVisible(true);
  };

  // Mostrar modal de edición
  const showEditModal = (solicitud) => {
    setSelectedSolicitud(solicitud);
    form.setFieldsValue({
      status: solicitud.status,
      resolution_action: solicitud.resolution_action,
      admin_notes: solicitud.admin_notes
    });
    setEditModalVisible(true);
  };

  // Función para obtener la hora actual en CDMX
  const getCDMXDateTime = () => {
    const now = new Date();
    const offset = -6; // CDMX normalmente es UTC-6
    const cdmxDate = new Date(now.getTime() + (offset * 60 * 60 * 1000));
    return cdmxDate.toISOString().slice(0, 19).replace('T', ' ');
  };

  // Actualizar solicitud
  const handleUpdate = async (values) => {
    try {
      // Agregar la fecha/hora CDMX al payload
      const payload = {
        ...values,
        resolved_at: getCDMXDateTime()
      };

      const response = await fetch(`${backend}/request_revisions/${selectedSolicitud.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.status === 'success') {
        message.success('Solicitud actualizada correctamente');
        setEditModalVisible(false);
        fetchSolicitudes(); // Recargar datos
      } else {
        message.error(data.message || 'Error al actualizar la solicitud');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      message.error('Error al actualizar la solicitud');
    }
  };

  // Eliminar contenido reportado
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${backend}/request_revisions/${id}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();

      if (data.status === 'success') {
        message.success('Contenido reportado eliminado correctamente');
        fetchSolicitudes(); // Recargar datos
      } else {
        message.error(data.message || 'Error al eliminar el contenido');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      message.error('Error al eliminar el contenido');
    }
  };

  // Eliminar solo la solicitud
  const handleDeleteOnly = async (id) => {
    try {
      const response = await fetch(`${backend}/request_revisions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();

      if (data.status === 'success') {
        message.success('Solicitud eliminada correctamente');
        fetchSolicitudes(); // Recargar datos
      } else {
        message.error(data.message || 'Error al eliminar la solicitud');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      message.error('Error al eliminar la solicitud');
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Tipo de Publicación',
      dataIndex: 'publication_type',
      key: 'publication_type',
      width: 120,
      render: (type) => (
        <Tag color={type === 'docente' ? 'blue' : type === 'departamento' ? 'green' : 'orange'}>
          {type === 'docente' ? 'Docente' : type === 'departamento' ? 'Departamento' : 'Reporte'}
        </Tag>
      ),
    },
    {
      title: 'Tipo de Queja',
      dataIndex: 'complaint_type',
      key: 'complaint_type',
      width: 140,
      render: (type) => <Tag color="purple">{type}</Tag>,
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status, record) => {
        const option = statusOptions.find(opt => opt.value === status);
        return (
          <div>
            <Tag color={option?.color}>{option?.label}</Tag>
            {status === 'recibido' && (
              <Badge 
                dot 
                style={{ 
                  backgroundColor: '#ff4d4f',
                  marginLeft: 8
                }} 
              />
            )}
          </div>
        );
      },
      filters: statusOptions.map(opt => ({ text: opt.label, value: opt.value })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Acción de Resolución',
      dataIndex: 'resolution_action',
      key: 'resolution_action',
      width: 160,
      render: (action) => {
        if (!action) return <Text type="secondary">-</Text>;
        const option = resolutionOptions.find(opt => opt.value === action);
        return (
          <Tag color={option?.color || 'default'}>
            {option?.label || action}
          </Tag>
        );
      },
      filters: resolutionOptions.map(opt => ({ text: opt.label, value: opt.value })),
      onFilter: (value, record) => record.resolution_action === value,
    },
    {
      title: 'Fecha de Creación',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (date) => new Date(date).toLocaleDateString('es-MX'),
    },
    {
      title: 'Fecha de Resolución',
      dataIndex: 'resolved_at',
      key: 'resolved_at',
      width: 150,
      sorter: (a, b) => new Date(a.resolved_at || 0) - new Date(b.resolved_at || 0),
      render: (date) => date ? new Date(date).toLocaleDateString('es-MX') : <Text type="secondary">-</Text>,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver detalles">
            <Button 
              type="primary" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => showDetailsModal(record)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="¿Eliminar solicitud?"
            description="¿Estás seguro de que quieres eliminar esta solicitud?"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDeleteOnly(record.id)}
            okText="Sí, eliminar"
            cancelText="Cancelar"
          >
            <Tooltip title="Eliminar solicitud">
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Renderizar contenido del modal de detalles
  const renderContentData = (contentData, publicationType) => {
    if (!contentData) return <Text type="secondary">No hay información disponible</Text>;

    switch (publicationType) {
      case 'docente':
        return (
          <div>
            <p><strong>Profesor:</strong> {contentData.teacher_name} {contentData.apellido_paterno} {contentData.apellido_materno}</p>
            <p><strong>Departamento:</strong> {contentData.department_name}</p>
            <p><strong>Materia:</strong> {contentData.subject_name}</p>
            <p><strong>Calificación:</strong> {contentData.score}/5.0</p>
            <p><strong>Opinión:</strong> {contentData.opinion}</p>
            <p><strong>Palabras clave:</strong> {contentData.keywords}</p>
          </div>
        );
      
      case 'departamento':
        return (
          <div>
            <p><strong>Departamento:</strong> {contentData.department_name}</p>
            <p><strong>Calificación:</strong> {contentData.score}/5.0</p>
            <p><strong>Opinión:</strong> {contentData.opinion}</p>
            <p><strong>Palabra clave:</strong> {contentData.keyword}</p>
          </div>
        );
      
      case 'reporte_incidencia':
  return (
    <div>
      <p><strong>Tipo de incidente:</strong> {contentData.tipo_incidente}</p>
      <p><strong>Descripción:</strong> {contentData.descripcion}</p>
      <p><strong>Ubicación:</strong> {contentData.ubicacion}</p>
      {contentData.foto && (
        <div>
          <p><strong>Foto:</strong></p>
          <img 
            src={`${backend}/public/uploads/reports/${contentData.foto}`} 
            width={200} 
            alt="Foto del reporte" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              borderRadius: '8px',
              border: '1px solid #d9d9d9'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
            {contentData.foto}
          </Text>
        </div>
      )}
    </div>
  );
      
      default:
        return <Text type="secondary">Tipo de publicación no reconocido</Text>;
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', padding: '0' }}>
      <Card 
        title={<Title level={2}>Gestión de Solicitudes</Title>}
        style={{ width: '100%', height: '100%' }}
        bodyStyle={{ padding: 0, height: 'calc(100% - 64px)' }}
      >
        <div style={{ padding: '24px', height: '100%' }}>
          <Table
            columns={columns}
            dataSource={solicitudes}
            loading={loading}
            rowKey="id"
            scroll={{ x: 1200, y: 'calc(100vh - 200px)' }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} de ${total} solicitudes`
            }}
            size="middle"
            // Estilo para resaltar filas con estado "recibido"
            rowClassName={(record) => record.status === 'recibido' ? 'highlight-row' : ''}
          />
        </div>
      </Card>

      {/* Modal de Detalles */}
      <Modal
        title="Detalles de la Solicitud"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Cerrar
          </Button>,
          <Popconfirm
            key="delete"
            title="¿Eliminar contenido?"
            description="¿Estás seguro de que quieres eliminar el contenido reportado? Esta acción no se puede deshacer."
            onConfirm={() => {
              handleDelete(selectedSolicitud?.id);
              setModalVisible(false);
            }}
            okText="Sí, eliminar"
            cancelText="Cancelar"
          >
            <Button danger icon={<DeleteOutlined />}>
              Eliminar Contenido
            </Button>
          </Popconfirm>
        ]}
        width={700}
      >
        {selectedSolicitud && (
          <div>
            <Divider orientation="left">Información de la Solicitud</Divider>
            <p><strong>ID:</strong> {selectedSolicitud.id}</p>
            <p><strong>Tipo de Publicación:</strong> {selectedSolicitud.publication_type}</p>
            <p><strong>Tipo de Queja:</strong> {selectedSolicitud.complaint_type}</p>
            <p><strong>Descripción:</strong> {selectedSolicitud.description}</p>
            <p><strong>Estado:</strong> 
              <Tag style={{ marginLeft: 8 }} color={
                statusOptions.find(opt => opt.value === selectedSolicitud.status)?.color
              }>
                {statusOptions.find(opt => opt.value === selectedSolicitud.status)?.label}
              </Tag>
            </p>
            <p><strong>Acción de Resolución:</strong> 
              {selectedSolicitud.resolution_action ? (
                <Tag style={{ marginLeft: 8 }} color={
                  resolutionOptions.find(opt => opt.value === selectedSolicitud.resolution_action)?.color
                }>
                  {resolutionOptions.find(opt => opt.value === selectedSolicitud.resolution_action)?.label}
                </Tag>
              ) : (
                <Text type="secondary" style={{ marginLeft: 8 }}>-</Text>
              )}
            </p>
            <p><strong>Fecha de Creación:</strong> {new Date(selectedSolicitud.created_at).toLocaleString('es-MX')}</p>
            <p><strong>Fecha de Resolución:</strong> 
              {selectedSolicitud.resolved_at ? 
                new Date(selectedSolicitud.resolved_at).toLocaleString('es-MX') : 
                <Text type="secondary">-</Text>
              }
            </p>
            {selectedSolicitud.admin_notes && (
              <p><strong>Notas del Administrador:</strong> {selectedSolicitud.admin_notes}</p>
            )}
            
            <Divider orientation="left">Contenido Reportado</Divider>
            {renderContentData(selectedSolicitud.content_data, selectedSolicitud.publication_type)}
          </div>
        )}
      </Modal>

      {/* Modal de Edición */}
      <Modal
        title="Editar Solicitud"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="status"
            label="Estado"
            rules={[{ required: true, message: 'Selecciona un estado' }]}
          >
            <Select placeholder="Selecciona el estado">
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="resolution_action"
            label="Acción de Resolución"
            rules={[{ required: true, message: 'Selecciona una acción' }]}
          >
            <Select placeholder="Selecciona la acción">
              {resolutionOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="admin_notes"
            label="Notas del Administrador"
          >
            <TextArea
              rows={4}
              placeholder="Agrega notas adicionales..."
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Actualizar
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Estilos CSS para resaltar filas */}
      <style jsx>{`
        :global(.highlight-row) {
          background-color: #f0f8ff !important;
          border-left: 3px solid #1890ff;
        }
        :global(.highlight-row:hover) {
          background-color: #e6f7ff !important;
        }
      `}</style>
    </div>
  );
};

export default Solicitudes_admin;