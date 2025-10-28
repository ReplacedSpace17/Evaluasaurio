import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Card, Row, Col, Tag, message, 
  Modal, Form, Input, Select, Tabs, Badge
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, UserOutlined, ClockCircleOutlined,
  CheckCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import backend from "../../../config/backend";
import axios from 'axios';
import Swal from 'sweetalert2';

const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

const Docentes_admin = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [approvingRequest, setApprovingRequest] = useState(null);
  const [form] = Form.useForm();
  const [approveForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('1');

  // Columnas de la tabla de docentes
  const teacherColumns = [
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
      title: 'Apellido Paterno',
      dataIndex: 'apellido_paterno',
      key: 'apellido_paterno',
      sorter: (a, b) => a.apellido_paterno.localeCompare(b.apellido_paterno),
    },
    {
      title: 'Apellido Materno',
      dataIndex: 'apellido_materno',
      key: 'apellido_materno',
      sorter: (a, b) => a.apellido_materno.localeCompare(b.apellido_materno),
    },
    {
      title: 'Sexo',
      dataIndex: 'sexo',
      key: 'sexo',
      width: 100,
      render: (sexo) => (
        <Tag color={sexo === 'Masculino' ? 'blue' : 'pink'}>
          {sexo}
        </Tag>
      ),
    },
    {
      title: 'Departamento',
      dataIndex: 'department_name',
      key: 'department_name',
      sorter: (a, b) => a.department_name.localeCompare(b.department_name),
      render: (department_name) => (
        <Tag color="green">
          {department_name}
        </Tag>
      ),
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
      title: 'Apellido Paterno',
      dataIndex: 'apellido_paterno',
      key: 'apellido_paterno',
    },
    {
      title: 'Apellido Materno',
      dataIndex: 'apellido_materno',
      key: 'apellido_materno',
    },
    {
      title: 'Sexo',
      dataIndex: 'sexo',
      key: 'sexo',
      width: 80,
      render: (sexo) => (
        <Tag color={sexo === 'M' ? 'blue' : sexo === 'F' ? 'pink' : 'default'}>
          {sexo === 'M' ? 'Masculino' : sexo === 'F' ? 'Femenino' : sexo}
        </Tag>
      ),
    },
    {
      title: 'Departamento',
      dataIndex: 'department',
      key: 'department',
      render: (department) => (
        <Tag color="blue">
          {department}
        </Tag>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => email || '-',
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

  // Cargar docentes
  const loadTeachers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backend}/teachers`);
      if (response.data.status === 'success') {
        const teachersData = response.data.data || [];
        setTeachers(teachersData);
        setFilteredTeachers(teachersData);
      } else {
        message.error('Error al cargar los docentes');
      }
    } catch (error) {
      console.error('Error loading teachers:', error);
      message.error('Error al cargar los docentes');
    } finally {
      setLoading(false);
    }
  };

  // Cargar solicitudes de docentes
  const loadTeacherRequests = async () => {
    setLoadingRequests(true);
    try {
      const response = await axios.get(`${backend}/teacher_requests`);
      if (response.data) {
        setTeacherRequests(response.data.data || []);
        setPendingCount(response.data.pendiente_teacher || 0);
      } else {
        message.error('Error al cargar las solicitudes');
      }
    } catch (error) {
      console.error('Error loading teacher requests:', error);
      message.error('Error al cargar las solicitudes');
    } finally {
      setLoadingRequests(false);
    }
  };

  // Cargar departamentos
  const loadDepartments = async () => {
    try {
      const response = await axios.get(`${backend}/departments`);
      setDepartments(response.data || []);
    } catch (error) {
      console.error('Error loading departments:', error);
      message.error('Error al cargar los departamentos');
    }
  };

  useEffect(() => {
    if (activeTab === '1') {
      loadTeachers();
      loadDepartments();
    } else if (activeTab === '2') {
      loadTeacherRequests();
    }
  }, [activeTab]);

  // Buscar docentes
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredTeachers(teachers);
      return;
    }

    const filtered = teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(value.toLowerCase()) ||
      teacher.apellido_paterno.toLowerCase().includes(value.toLowerCase()) ||
      teacher.apellido_materno.toLowerCase().includes(value.toLowerCase()) ||
      `${teacher.name} ${teacher.apellido_paterno} ${teacher.apellido_materno}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredTeachers(filtered);
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
  const showModal = (teacher = null) => {
    setEditingTeacher(teacher);
    setIsModalVisible(true);
    
    if (teacher) {
      form.setFieldsValue({
        name: teacher.name,
        apellido_paterno: teacher.apellido_paterno,
        apellido_materno: teacher.apellido_materno,
        sexo: teacher.sexo,
        department_id: teacher.department_id
      });
    } else {
      form.resetFields();
    }
  };

  // Cerrar modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTeacher(null);
    form.resetFields();
  };

  // Cerrar modal de aprobación
  const handleCancelApprove = () => {
    setIsApproveModalVisible(false);
    setApprovingRequest(null);
    approveForm.resetFields();
  };

  // Enviar formulario
  const handleSubmit = async (values) => {
    try {
      if (!values.name || !values.apellido_paterno || !values.apellido_materno || !values.sexo || !values.department_id) {
        showErrorAlert('Error', 'Todos los campos son obligatorios');
        return;
      }

      Swal.fire({
        title: editingTeacher ? 'Actualizando docente...' : 'Creando docente...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const requestData = new URLSearchParams();
      requestData.append('name', values.name.trim());
      requestData.append('apellido_paterno', values.apellido_paterno.trim());
      requestData.append('apellido_materno', values.apellido_materno.trim());
      requestData.append('sexo', values.sexo);
      requestData.append('department_id', values.department_id);

      let response;
      
      if (editingTeacher) {
        response = await axios({
          method: 'PUT',
          url: `${backend}/teachers/${editingTeacher.id}`,
          data: requestData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      } else {
        response = await axios({
          method: 'POST',
          url: `${backend}/teachers`,
          data: requestData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      }
      
      if (response.data.message) {
        Swal.close();
        showSuccessAlert('¡Éxito!', editingTeacher ? 'Docente actualizado correctamente' : 'Docente creado correctamente');
        handleCancel();
        loadTeachers();
      } else {
        Swal.close();
        showErrorAlert('Error', response.data.error || `Error al ${editingTeacher ? 'actualizar' : 'crear'} el docente`);
      }
    } catch (error) {
      console.error('Error saving teacher:', error);
      Swal.close();
      
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error || 'Error al guardar el docente';
        showErrorAlert('Error', errorMessage);
      } else {
        showErrorAlert('Error', 'Error de conexión al guardar el docente');
      }
    }
  };

  // Aprobar solicitud - Abrir modal
  const handleApproveRequest = (request) => {
    setApprovingRequest(request);
    setIsApproveModalVisible(true);
    
    // Mapear sexo de la solicitud al formato del formulario
    const sexoMapped = request.sexo === 'M' ? 'Masculino' : request.sexo === 'F' ? 'Femenino' : request.sexo;
    
    // Buscar el departamento por nombre para obtener el ID
    const department = departments.find(dept => 
      dept.name.toLowerCase() === request.department?.toLowerCase()
    );

    approveForm.setFieldsValue({
      name: request.name,
      apellido_paterno: request.apellido_paterno,
      apellido_materno: request.apellido_materno,
      sexo: sexoMapped,
      department_id: department?.id || null,
      email: request.email || ''
    });
  };

  // Enviar aprobación de solicitud
// Enviar aprobación de solicitud - MODIFICADO
const handleApproveSubmit = async (values) => {
  try {
    if (!values.name || !values.apellido_paterno || !values.apellido_materno || !values.sexo || !values.department_id) {
      showErrorAlert('Error', 'Todos los campos son obligatorios');
      return;
    }

    Swal.fire({
      title: 'Aprobando solicitud...',
      text: 'Creando docente y actualizando solicitud',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // 1. Crear el docente
    const teacherData = new URLSearchParams();
    teacherData.append('name', values.name.trim());
    teacherData.append('apellido_paterno', values.apellido_paterno.trim());
    teacherData.append('apellido_materno', values.apellido_materno.trim());
    teacherData.append('sexo', values.sexo);
    teacherData.append('department_id', values.department_id);

    const teacherResponse = await axios({
      method: 'POST',
      url: `${backend}/teachers`,
      data: teacherData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (teacherResponse.data.message) {
      // 2. Actualizar el estado de la solicitud a "aprobado"
      const approveResponse = await axios.post(`${backend}/teacher_requests/${approvingRequest.id}/approve`);
      
      if (approveResponse.data.message || approveResponse.data.status === 'success') {
        Swal.close();
        showSuccessAlert('¡Éxito!', 'Solicitud aprobada y docente creado correctamente');
        handleCancelApprove();
        loadTeacherRequests();
        
        // Si estamos en la pestaña de docentes, recargar también
        if (activeTab === '1') {
          loadTeachers();
        }
      } else {
        Swal.close();
        showErrorAlert('Error', 'Docente creado pero error al actualizar la solicitud');
      }
    } else {
      Swal.close();
      showErrorAlert('Error', teacherResponse.data.error || 'Error al crear el docente');
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

  // Rechazar solicitud
// Rechazar solicitud - MODIFICADO para usar DELETE
const handleRejectRequest = (request) => {
  Swal.fire({
    title: '¿Rechazar solicitud?',
    text: `¿Estás seguro de rechazar la solicitud de ${request.name} ${request.apellido_paterno}? Esta acción no se puede deshacer.`,
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

        // Llamar al endpoint DELETE para eliminar la solicitud
        await axios.delete(`${backend}/teacher_requests/${request.id}`);
        
        Swal.close();
        showSuccessAlert('Rechazada', `Solicitud de ${request.name} rechazada y eliminada correctamente`);
        loadTeacherRequests();
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

  // Handlers para acciones de docentes
  const handleAddTeacher = () => {
    showModal();
  };

  const handleEdit = (teacher) => {
    showModal(teacher);
  };

  const handleDelete = (teacher) => {
    showConfirmAlert(
      '¿Eliminar docente?',
      `¿Estás seguro de eliminar al docente ${teacher.name} ${teacher.apellido_paterno}?`
    ).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: 'Eliminando docente...',
            text: 'Por favor espere',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          // Implementar eliminación aquí
          Swal.close();
          showSuccessAlert('Eliminado', 'Docente eliminado correctamente');
          loadTeachers();
        } catch (error) {
          Swal.close();
          showErrorAlert('Error', 'Error al eliminar el docente');
        }
      }
    });
  };

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Por favor selecciona al menos un docente');
      return;
    }

    showConfirmAlert(
      '¿Eliminar docentes seleccionados?',
      `Se eliminarán ${selectedRowKeys.length} docente(s) permanentemente.`
    ).then((result) => {
      if (result.isConfirmed) {
        message.info(`Eliminando ${selectedRowKeys.length} docente(s)`);
        setSelectedRowKeys([]);
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
  const totalTeachers = filteredTeachers.length;
  const maleTeachers = filteredTeachers.filter(t => t.sexo === 'Masculino').length;
  const femaleTeachers = filteredTeachers.filter(t => t.sexo === 'Femenino').length;

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
                Administración de Docentes
              </h1>
              <p style={{ margin: '4px 0 0 0', color: '#666' }}>
                Gestión de docentes y solicitudes de registro
              </p>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddTeacher}
                >
                  Agregar Docente
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
          {/* Tab de Docentes Activos */}
          <TabPane tab="Docentes Activos" key="1">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Barra de búsqueda y estadísticas */}
              <div style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                  <Col span={12}>
                    <Search
                      placeholder="Buscar por nombre completo..."
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
                            {totalTeachers}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>Total</div>
                        </div>
                      </Card>
                      <Card size="small" style={{ width: 120 }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                            {maleTeachers}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>Hombres</div>
                        </div>
                      </Card>
                      <Card size="small" style={{ width: 120 }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4f' }}>
                            {femaleTeachers}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>Mujeres</div>
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

              {/* Tabla de docentes */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <Table
                  columns={teacherColumns}
                  dataSource={filteredTeachers}
                  rowKey="id"
                  loading={loading}
                  rowSelection={rowSelection}
                  scroll={{ y: 'calc(100vh - 450px)' }}
                  pagination={{
                    pageSize: 15,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                      `${range[0]}-${range[1]} de ${total} docentes`,
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
                          {teacherRequests.filter(r => r.status === 'aprobado').length}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Aprobados</div>
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small">
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4f' }}>
                          {teacherRequests.filter(r => r.status === 'rechazado').length}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Rechazados</div>
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small">
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                          {teacherRequests.length}
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
                  dataSource={teacherRequests}
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

      {/* Modal para agregar/editar docente */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            <span>{editingTeacher ? 'Editar Docente' : 'Agregar Nuevo Docente'}</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Nombre"
                name="name"
                rules={[
                  { required: true, message: 'Por favor ingresa el nombre' },
                  { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                ]}
              >
                <Input placeholder="Nombre" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Apellido Paterno"
                name="apellido_paterno"
                rules={[
                  { required: true, message: 'Por favor ingresa el apellido paterno' },
                  { min: 2, message: 'El apellido paterno debe tener al menos 2 caracteres' }
                ]}
              >
                <Input placeholder="Apellido paterno" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Apellido Materno"
                name="apellido_materno"
                rules={[
                  { required: true, message: 'Por favor ingresa el apellido materno' },
                  { min: 2, message: 'El apellido materno debe tener al menos 2 caracteres' }
                ]}
              >
                <Input placeholder="Apellido materno" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Sexo"
                name="sexo"
                rules={[{ required: true, message: 'Por favor selecciona el sexo' }]}
              >
                <Select placeholder="Selecciona el sexo">
                  <Option value="Masculino">Masculino</Option>
                  <Option value="Femenino">Femenino</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Departamento"
                name="department_id"
                rules={[{ required: true, message: 'Por favor selecciona el departamento' }]}
              >
                <Select 
                  placeholder="Selecciona el departamento"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {departments.map(dept => (
                    <Option key={dept.id} value={dept.id}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

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
                {editingTeacher ? 'Actualizar Docente' : 'Crear Docente'}
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
            <span>Aprobar Solicitud de Docente</span>
          </Space>
        }
        open={isApproveModalVisible}
        onCancel={handleCancelApprove}
        footer={null}
        width={600}
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
              <div>Nombre: {approvingRequest.name} {approvingRequest.apellido_paterno} {approvingRequest.apellido_materno}</div>
              <div>Departamento solicitado: {approvingRequest.department}</div>
              <div>Email: {approvingRequest.email || 'No proporcionado'}</div>
            </div>

            <Form
              form={approveForm}
              layout="vertical"
              onFinish={handleApproveSubmit}
              autoComplete="off"
              size="large"
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Nombre"
                    name="name"
                    rules={[
                      { required: true, message: 'Por favor ingresa el nombre' },
                      { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                    ]}
                  >
                    <Input placeholder="Nombre" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Apellido Paterno"
                    name="apellido_paterno"
                    rules={[
                      { required: true, message: 'Por favor ingresa el apellido paterno' },
                      { min: 2, message: 'El apellido paterno debe tener al menos 2 caracteres' }
                    ]}
                  >
                    <Input placeholder="Apellido paterno" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Apellido Materno"
                    name="apellido_materno"
                    rules={[
                      { required: true, message: 'Por favor ingresa el apellido materno' },
                      { min: 2, message: 'El apellido materno debe tener al menos 2 caracteres' }
                    ]}
                  >
                    <Input placeholder="Apellido materno" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Sexo"
                    name="sexo"
                    rules={[{ required: true, message: 'Por favor selecciona el sexo' }]}
                  >
                    <Select placeholder="Selecciona el sexo">
                      <Option value="Masculino">Masculino</Option>
                      <Option value="Femenino">Femenino</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Departamento"
                    name="department_id"
                    rules={[{ required: true, message: 'Por favor selecciona el departamento' }]}
                  >
                    <Select 
                      placeholder="Selecciona el departamento"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {departments.map(dept => (
                        <Option key={dept.id} value={dept.id}>
                          {dept.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Email (Opcional)"
                name="email"
              >
                <Input placeholder="Email del docente" />
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
                    Aprobar y Crear Docente
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

export default Docentes_admin;