import React, { useEffect, useState } from "react";
import { Select } from "antd";
import backend from "../../../config/backend";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const removeAccents = (text) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const Navbar_departamentos = ({ windowWidth }) => {
  const [departamentos, setDepartamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ✅ Cargar departamentos
  useEffect(() => {
    fetch(backend + "/departamentos/all")
      .then((res) => res.json())
      .then((data) => {
        setDepartamentos(data);
      })
      .catch(console.error);
  }, []);

  // ✅ Filtrar departamentos según búsqueda
  const filteredDepartamentos = departamentos.filter((d) =>
    removeAccents(d.name.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase()))
  );

  const onSearch = (value) => setSearchTerm(value);
  const onSelect = (id) => navigate(`/departament/${id}`);

  return (
    <div style={{ width: "100%", minWidth: 180 }}>
      <Select
        showSearch
        placeholder="Buscar departamento"
        style={{ width: "100%" }}
        onSearch={onSearch}
        onSelect={onSelect}
        filterOption={false} // usamos nuestro propio filtro
      >
        {filteredDepartamentos.map((dep) => (
          <Option key={dep.id} value={dep.id}>
            {dep.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default Navbar_departamentos;
