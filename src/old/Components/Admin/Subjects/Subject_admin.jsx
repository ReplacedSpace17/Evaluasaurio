import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Card, Row, Col, Tag, message, 
  Modal, Form, Input, Select, Tabs, Badge
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, BookOutlined, ClockCircleOutlined,
  CheckCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import backend from "../../../config/backend";
import axios from 'axios';
import Swal from 'sweetalert2';

const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

const Subjects_admin = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [subjectRequests, setSubjectRequests] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [approvingRequest, setApprovingRequest] = useState(null);
  const [form] = Form.useForm();
  const [approveForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('1');

  // Columnas de la tabla de materias
  const subjectColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Fecha de Registro',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  // Columnas de la tabla de solicitudes
  const requestColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
      render: (description) => description || '-',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const statusConfig = {
          pendiente: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Pendiente' },
          aprobado: { color: 'green', icon: <CheckCircleOutlined />, text: 'Aprobado' },
          rechazado: { color: 'red', icon: <CloseCircleOutlined />, text: 'Rechazado' }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Fecha Solicitud',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleApproveRequest(record)}
            disabled={record.status !== 'pendiente'}
          >
            Aprobar
          </Button>
          <Button 
            danger 
            size="small"
            onClick={() => handleRejectRequest(record)}
            disabled={record.status !== 'pendiente'}
          >
            Rechazar
          </Button>
        </Space>
      ),
    },
  ];

  // Cargar materias
  const loadSubjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backend}/subjects`);
      if (response.data) {
        const subjectsData = response.data || [];
        setSubjects(subjectsData);
        setFilteredSubjects(subjectsData);
      } else {
        message.error('Error al cargar las materias');
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      message.error('Error al cargar las materias');
    } finally {
      setLoading(false);
    }
  };

  // Cargar solicitudes de materias
  const loadSubjectRequests = async () => {
    setLoadingRequests(true);
    try {
      const response = await axios.get(`${backend}/subject_requests`);
      if (response.data) {
        setSubjectRequests(response.data || []);
        const pending = response.data.filter(req => req.status === 'pendiente').length;
        setPendingCount(pending);
      } else {
        message.error('Error al cargar las solicitudes');
      }
    } catch (error) {
      console.error('Error loading subject requests:', error);
      message.error('Error al cargar las solicitudes');
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (activeTab === '1') {
      loadSubjects();
    } else if (activeTab === '2') {
      loadSubjectRequests();
    }
  }, [activeTab]);

  // Buscar materias
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredSubjects(subjects);
      return;
    }

    const filtered = subjects.filter(subject => 
      subject.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSubjects(filtered);
  };

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
  const showConfirmAlert = (title, text) => {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4f',
      cancelButtonColor: '#8c8c8c',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
  };

  // Abrir modal para agregar/editar
  const showModal = (subject = null) => {
    setEditingSubject(subject);
    setIsModalVisible(true);
    
    if (subject) {
      form.setFieldsValue({
        name: subject.name,
      });
    } else {
      form.resetFields();
    }
  };

  // Cerrar modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingSubject(null);
    form.resetFields();
  };

  // Cerrar modal de aprobación
  const handleCancelApprove = () => {
    setIsApproveModalVisible(false);
    setApprovingRequest(null);
    approveForm.resetFields();
  };

  // Enviar formulario
// Enviar formulario - ACTUALIZADO
const handleSubmit = async (values) => {
  try {
    if (!values.name) {
      showErrorAlert('Error', 'El nombre es obligatorio');
      return;
    }

    Swal.fire({
      title: editingSubject ? 'Actualizando materia...' : 'Creando materia...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const subjectData = {
      name: values.name.trim()
    };

    let response;
    
    if (editingSubject) {
      // Actualizar materia existente
      response = await axios.put(`${backend}/subjects/${editingSubject.id}`, subjectData);
    } else {
      // Crear nueva materia
      response = await axios.post(`${backend}/subjects`, subjectData);
    }

    if (response.data) {
      Swal.close();
      showSuccessAlert('¡Éxito!', editingSubject ? 'Materia actualizada correctamente' : 'Materia creada correctamente');
      handleCancel();
      loadSubjects();
    } else {
      Swal.close();
      showErrorAlert('Error', response.data.error || `Error al ${editingSubject ? 'actualizar' : 'crear'} la materia`);
    }
    
  } catch (error) {
    console.error('Error saving subject:', error);
    Swal.close();
    
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.error || 'Error al guardar la materia';
      showErrorAlert('Error', errorMessage);
    } else {
      showErrorAlert('Error', 'Error de conexión al guardar la materia');
    }
  }
};

  // Aprobar solicitud - Abrir modal
  const handleApproveRequest = (request) => {
    setApprovingRequest(request);
    setIsApproveModalVisible(true);
    
    approveForm.setFieldsValue({
      name: request.name,
      description: request.description || ''
    });
  };

// Enviar aprobación de solicitud - ACTUALIZADO
const handleApproveSubmit = async (values) => {
  try {
    if (!values.name) {
      showErrorAlert('Error', 'El nombre es obligatorio');
      return;
    }

    Swal.fire({
      title: 'Aprobando solicitud...',
      text: 'Creando materia y actualizando solicitud',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // 1. Crear la materia
    const subjectData = {
      name: values.name.trim()
    };

    const subjectResponse = await axios.post(`${backend}/subjects`, subjectData);

    if (subjectResponse.data) {
      // 2. Actualizar el estado de la solicitud a "aprobado"
      const approveResponse = await axios.post(`${backend}/subject_requests/${approvingRequest.id}/approve`);
      
      if (approveResponse.data) {
        Swal.close();
        showSuccessAlert('¡Éxito!', 'Solicitud aprobada y materia creada correctamente');
        handleCancelApprove();
        loadSubjectRequests();
        
        // Si estamos en la pestaña de materias, recargar también
        if (activeTab === '1') {
          loadSubjects();
        }
      } else {
        Swal.close();
        showErrorAlert('Error', 'Materia creada pero error al actualizar la solicitud');
      }
    } else {
      Swal.close();
      showErrorAlert('Error', subjectResponse.data.error || 'Error al crear la materia');
    }
  } catch (error) {
    console.error('Error approving request:', error);
    Swal.close();
    
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.error || 'Error al aprobar la solicitud';
      showErrorAlert('Error', errorMessage);
    } else {
      showErrorAlert('Error', 'Error de conexión al aprobar la solicitud');
    }
  }
};

// Rechazar solicitud - ACTUALIZADO
const handleRejectRequest = (request) => {
  Swal.fire({
    title: '¿Rechazar solicitud?',
    text: `¿Estás seguro de rechazar la solicitud de "${request.name}"? Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ff4d4f',
    cancelButtonColor: '#8c8c8c',
    confirmButtonText: 'Sí, rechazar',
    cancelButtonText: 'Cancelar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Rechazando solicitud...',
          text: 'Por favor espere',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Llamar al endpoint para rechazar la solicitud
        const response = await axios.post(`${backend}/subject_requests/${request.id}/reject`);
        
        if (response.data) {
          Swal.close();
          showSuccessAlert('Rechazada', `Solicitud de "${request.name}" rechazada correctamente`);
          loadSubjectRequests();
        } else {
          throw new Error('Error en la respuesta del servidor');
        }
      } catch (error) {
        console.error('Error rejecting request:', error);
        Swal.close();
        
        if (error.response && error.response.data) {
          const errorMessage = error.response.data.error || 'Error al rechazar la solicitud';
          showErrorAlert('Error', errorMessage);
        } else {
          showErrorAlert('Error', 'Error de conexión al rechazar la solicitud');
        }
      }
    }
  });
};

  // Handlers para acciones de materias
  const handleAddSubject = () => {
    showModal();
  };

  const handleEdit = (subject) => {
    showModal(subject);
  };

  const handleDelete = (subject) => {
    showConfirmAlert(
      '¿Eliminar materia?',
      `¿Estás seguro de eliminar la materia "${subject.name}"?`
    ).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: 'Eliminando materia...',
            text: 'Por favor espere',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          // TODO: Implementar eliminación de materia
          console.log('Eliminando materia:', subject.id);
          
          Swal.close();
          showSuccessAlert('Eliminada', 'Materia eliminada correctamente');
          loadSubjects();
        } catch (error) {
          Swal.close();
          showErrorAlert('Error', 'Error al eliminar la materia');
        }
      }
    });
  };

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Por favor selecciona al menos una materia');
      return;
    }

    showConfirmAlert(
      '¿Eliminar materias seleccionadas?',
      `Se eliminarán ${selectedRowKeys.length} materia(s) permanentemente.`
    ).then((result) => {
      if (result.isConfirmed) {
        // TODO: Implementar eliminación múltiple
        message.info(`Eliminando ${selectedRowKeys.length} materia(s)`);
        setSelectedRowKeys([]);
        loadSubjects();
      }
    });
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

  // Estadísticas
  const totalSubjects = filteredSubjects.length;

  return (
    <div style={{ width: '100%', height: '100%', padding: '15px' }}>
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
        <div style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                Administración de Materias
              </h1>
              <p style={{ margin: '4px 0 0 0', color: '#666' }}>
                Gestión de materias y solicitudes de registro
              </p>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddSubject}
                >
                  Agregar Materia
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Tabs */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {/* Tab de Materias Activas */}
          <TabPane tab="Materias Activas" key="1">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Barra de búsqueda y estadísticas */}
              <div style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                  <Col span={12}>
                    <Search
                      placeholder="Buscar por nombre de materia..."
                      allowClear
                      enterButton={<SearchOutlined />}
                      size="large"
                      onSearch={handleSearch}
                      onChange={(e) => handleSearch(e.target.value)}
                      value={searchText}
                    />
                  </Col>
                  <Col span={12}>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                      <Card size="small" style={{ width: 120 }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                            {totalSubjects}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>Total Materias</div>
                        </div>
                      </Card>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Toolbar con selección múltiple */}
              {hasSelected && (
                <div style={{ 
                  marginBottom: 16, 
                  padding: '12px', 
                  background: '#f0f8ff', 
                  borderRadius: '6px',
                  border: '1px solid #91d5ff'
                }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Space>
                        <span style={{ fontWeight: 500 }}>
                          {hasSelected ? `Seleccionados: ${selectedRowKeys.length}` : ''}
                        </span>
                      </Space>
                    </Col>
                    <Col>
                      <Space>
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={handleBatchDelete}
                        >
                          Eliminar Seleccionados
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </div>
              )}

              {/* Tabla de materias */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <Table
                  columns={subjectColumns}
                  dataSource={filteredSubjects}
                  rowKey="id"
                  loading={loading}
                  rowSelection={rowSelection}
                  scroll={{ y: 'calc(100vh - 450px)' }}
                  pagination={{
                    pageSize: 15,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                      `${range[0]}-${range[1]} de ${total} materias`,
                  }}
                  style={{ height: '100%' }}
                  size="middle"
                />
              </div>
            </div>
          </TabPane>

          {/* Tab de Solicitudes */}
          <TabPane 
            tab={
              <span>
                <Badge count={pendingCount} offset={[10, -5]} size="small">
                  Solicitudes
                </Badge>
              </span>
            } 
            key="2"
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Estadísticas de solicitudes */}
              <div style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <Card size="small">
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fa8c16' }}>
                          {pendingCount}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Pendientes</div>
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small">
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                          {subjectRequests.filter(r => r.status === 'aprobado').length}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Aprobados</div>
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small">
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4f' }}>
                          {subjectRequests.filter(r => r.status === 'rechazado').length}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Rechazados</div>
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small">
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                          {subjectRequests.length}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Total</div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* Tabla de solicitudes */}
              <div style={{ flex: 1, overflow: 'hidden', padding:16}}>
                <Table
                  columns={requestColumns}
                  dataSource={subjectRequests}
                  rowKey="id"
                  loading={loadingRequests}
                  scroll={{ y: 'calc(100vh - 550px)' }}
                  pagination={{
                    pageSize: 15,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                      `${range[0]}-${range[1]} de ${total} solicitudes`,
                  }}
                  style={{ height: '100%' }}
                  size="middle"
                />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal para agregar/editar materia */}
      <Modal
        title={
          <Space>
            <BookOutlined />
            <span>{editingSubject ? 'Editar Materia' : 'Agregar Nueva Materia'}</span>
          </Space>
        }
        open={isModalVisible}
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
          size="large"
        >
          <Form.Item
            label="Nombre de la Materia"
            name="name"
            rules={[
              { required: true, message: 'Por favor ingresa el nombre de la materia' },
              { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
            ]}
          >
            <Input placeholder="Nombre de la materia" />
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
                {editingSubject ? 'Actualizar Materia' : 'Crear Materia'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Modal para aprobar solicitud */}
      <Modal
        title={
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <span>Aprobar Solicitud de Materia</span>
          </Space>
        }
        open={isApproveModalVisible}
        onCancel={handleCancelApprove}
        footer={null}
        width={500}
        destroyOnClose
      >
        {approvingRequest && (
          <div>
            <div style={{ 
              marginBottom: 16, 
              padding: '12px', 
              backgroundColor: '#f6ffed',
              border: '1px solid #b7eb8f',
              borderRadius: '6px'
            }}>
              <strong>Datos de la solicitud:</strong>
              <div>Nombre: {approvingRequest.name}</div>
              <div>Descripción: {approvingRequest.description || 'No proporcionada'}</div>
            </div>

            <Form
              form={approveForm}
              layout="vertical"
              onFinish={handleApproveSubmit}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                label="Nombre de la Materia"
                name="name"
                rules={[
                  { required: true, message: 'Por favor ingresa el nombre de la materia' },
                  { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                ]}
              >
                <Input placeholder="Nombre de la materia" />
              </Form.Item>

              <Form.Item
                label="Descripción (Opcional)"
                name="description"
              >
                <Input.TextArea placeholder="Descripción de la materia" rows={3} />
              </Form.Item>

              <div style={{ 
                marginTop: 24, 
                textAlign: 'right',
                borderTop: '1px solid #f0f0f0',
                paddingTop: 16
              }}>
                <Space>
                  <Button onClick={handleCancelApprove}>
                    Cancelar
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Aprobar y Crear Materia
                  </Button>
                </Space>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Subjects_admin;