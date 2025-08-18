import React, { useEffect, useState } from "react";
import { Select, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import backend from "../config/backend";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const removeAccents = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const Navbar = () => {
  const [professors, setProfessors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(backend + "/teachers")
      .then(res => res.json())
      .then(data => {
        if(data.status === "success"){
          setProfessors(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const filteredProfessors = professors.filter((professor) => {
    const fullName = `${professor.name} ${professor.apellido_paterno} ${professor.apellido_materno}`.toLowerCase();
    return removeAccents(fullName).includes(removeAccents(searchTerm.toLowerCase()));
  });

  const onSearch = (value) => setSearchTerm(value);

  const onSelect = (id) => {
    navigate(`/teacher/${id}`);
  };

  return (
   
      <Select
        showSearch
        placeholder="Buscar"
        style={{ width: "500px" }}
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
    
  );
};

export default Navbar;
