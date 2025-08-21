import React, { useEffect, useState } from "react";
import { Select } from "antd";
import backend from "../config/backend";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const removeAccents = (text) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const Navbar = ({ windowWidth }) => {
  const [professors, setProfessors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(backend + "/teachers")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setProfessors(data.data);
      })
      .catch(console.error);
  }, []);

  const filteredProfessors = professors.filter((professor) => {
    const fullName = `${professor.name} ${professor.apellido_paterno} ${professor.apellido_materno}`.toLowerCase();
    return removeAccents(fullName).includes(removeAccents(searchTerm.toLowerCase()));
  });

  const onSearch = (value) => setSearchTerm(value);
  const onSelect = (id) => navigate(`/teacher/${id}`);

  // En móvil (<768px) ocupamos todo el ancho y ocultamos el logo
  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <Select
        showSearch
        placeholder="Buscar profesor"
        style={{ width: "100%" }} // ancho dinámico
        onSearch={onSearch}
        onSelect={onSelect}
        filterOption={false}
      >
        {filteredProfessors.map((prof) => (
          <Option key={prof.id} value={prof.id}>
            {`${prof.name} ${prof.apellido_paterno} ${prof.apellido_materno}`}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default Navbar;
