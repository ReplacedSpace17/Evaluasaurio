import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import flecha from "../../../assets/icons/flecha.svg";
const Card_menu = ({ width, height, icon, text, navigate, mobile }) => {
  const [hover, setHover] = useState(false);
  const history = useNavigate();

  const handleClick = () => {
    history(navigate);
  };

  return mobile ? (
    // Versión mobile: [icon text >]
    <div
      onClick={handleClick}
      style={{
        width: "100%",
        height: 70,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#FFFFFF",
        border: `1px solid ${hover ? "#25292E" : "#D1D9E0"}`,
        marginBottom: 0,
        padding: "0 12px",
        cursor: "pointer",
        transition: "border 0.3s ease",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Icono + texto */}
      <div style={{ display: "flex", alignItems: "center", backgroundColor: "none" }}>
        <div style={{ display: "flex", alignItems: "center", width: 50, height: 50 , padding: 10, backgroundColor: "#e2ebf7d0", borderRadius: 8,}}>
        <img
          src={icon}
          alt=""
          style={{ width: "auto", height: "100%", marginRight: 12, }}
        />
        </div>
        <span style={{ fontSize: 15, fontWeight: 400, marginLeft: 15 }}>{text}</span>
      </div>

      {/* Flecha */}
      <img src={flecha} alt="flecha" style={{ width: 20, height: 20, color: "red", marginRight: 5}} />
    </div>
  ) : (
    // Versión desktop: columna tradicional
    <div
      onClick={handleClick}
      style={{
        width: width,
        height: height,
        minWidth: width,
        minHeight: height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#FFFFFF",
        border: `1px solid ${hover ? "#25292E" : "#D1D9E0"}`,
        marginRight: 8,
        transition: "border 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          height: "80%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <img src={icon} alt="" style={{ width: 40, height: 40 }} />
      </div>
      <h2
        style={{
          fontSize: 15,
          fontWeight: 400,
          textAlign: "center",
        }}
      >
        {text}
      </h2>
    </div>
  );
};

export default Card_menu;
