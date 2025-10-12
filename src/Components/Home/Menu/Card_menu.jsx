import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Card_menu = ({ width, height, icon, text, navigate, mobile }) => {
  const [hover, setHover] = useState(false);
  const history = useNavigate();

  const handleClick = () => {
    history(navigate);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: mobile ? "100%" : width,
        height: mobile ? 80 : height, // más rectangular en móvil
        minWidth: width,
        minHeight: mobile ? 80 : height,
        display: "flex",
        flexDirection: mobile ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#FFFFFF",
        border: `1px solid ${hover ? "#25292E" : "#D1D9E0"}`,
        marginRight: 8,
        marginBottom: mobile ? 10 : 0,
        transition: "border 0.3s ease",
        cursor: "pointer",
        padding: mobile ? "0 12px" : 0,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          height: mobile ? "60%" : "80%",
          width: mobile ? 40 : "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: mobile ? 12 : 0,
        }}
      >
        <img
          src={icon}
          alt=""
          style={{
            width: 40,
            height: 40,
          }}
        />
      </div>
      <h2
        style={{
          fontSize: "15px",
          fontWeight: 400,
          textAlign: mobile ? "left" : "center",
        }}
      >
        {text}
      </h2>
    </div>
  );
};

export default Card_menu;
