import React, { useEffect, useState } from "react";
import { Select } from "antd";
import backend from "../config/backend";
import { useNavigate } from "react-router-dom";
import TeacherSelect from "./Selects/TeacherSelect";

const { Option } = Select;

const Navbar = ({ windowWidth }) => {
  const navigate = useNavigate();


  const onSelect = (id) => navigate(`/teacher/${id}`);

  // En móvil (<768px) ocupamos todo el ancho y ocultamos el logo
  return (
    <div style={{ width: "100%", minWidth: 180 }}>
      <TeacherSelect
        placeholder={"Buscar profesor"}
        onChange={onSelect}
      />
    </div>
  );
};

export default Navbar;
