import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import { PlayCircleOutlined, ShareAltOutlined } from "@ant-design/icons";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
} from "react-share";

// Función auxiliar para convertir fechas tipo "31/Oct/2025" a objeto Date
const parseDate = (str) => {
  const months = {
    Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5,
    Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11
  };
  const [day, monthStr, year] = str.split("/");
  return new Date(year, months[monthStr], parseInt(day));
};

const Card_event = ({ title, image, description, navigate, finalDate, launchDate }) => {
  const [hover, setHover] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [isActive, setIsActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const history = useNavigate();

  const fullUrl = `${window.location.origin}${navigate}`; 

  const handleClick = () => {
    if (isActive) history(navigate);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const now = new Date();
    const start = parseDate(launchDate);
    const end = parseDate(finalDate);
    setHasStarted(now >= start);
    setIsActive(now >= start && now <= end);
  }, [launchDate, finalDate]);

  // Compartir evento
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: fullUrl,
        });
      } catch (error) {
        console.error("Error al compartir:", error);
      }
    } else {
      setShowShareModal(true); // fallback si no soporta Web Share API
    }
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          borderRadius: 12,
          backgroundColor: "#F6F8FA",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "12px",
          border: "1px solid #D1D9E0",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Imagen */}
        <div
          style={{
            width: isMobile ? "100%" : "30%",
            height: isMobile ? "200px" : "100%",
          }}
        >
          <img
            src={image}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Contenido */}
        <div
          style={{
            width: isMobile ? "100%" : "70%",
            display: "flex",
            flexDirection: "column",
            padding: "12px",
          }}
        >
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "bold",
              color: "#25292E",
            }}
          >
            {title} — {hasStarted ? `Disponible hasta ${finalDate}` : `Inicia el ${launchDate}`}
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "#25292E",
              marginBottom: "auto",
            }}
          >
            {description}
          </p>

          {/* Botones */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "12px",
              marginTop: "10px",
              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
          >
            <Button
              type={isActive ? "primary" : "default"}
              icon={<PlayCircleOutlined />}
              onClick={handleClick}
              disabled={!isActive}
              style={{
                maxWidth: "120px",
                flex: 1,
                opacity: isActive ? 1 : 0.5,
                cursor: isActive ? "pointer" : "not-allowed",
              }}
            >
              {isActive ? "Jugar" : hasStarted ? "No disponible" : "Próximamente"}
            </Button>

            <Button
              type="default"
              icon={<ShareAltOutlined />}
              onClick={handleShare}
              style={{ maxWidth: "120px", flex: 1 }}
            >
              Compartir
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de compartir */}
      <Modal
        title="Compartir evento"
        open={showShareModal}
        onCancel={() => setShowShareModal(false)}
        footer={null}
        centered
      >
        <p>Comparte este evento en tus redes:</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px" }}>
          <FacebookShareButton url={fullUrl} quote={title}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>

          <TwitterShareButton url={fullUrl} title={title}>
            <TwitterIcon size={40} round />
          </TwitterShareButton>

          <WhatsappShareButton url={fullUrl} title={title}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
        </div>
      </Modal>
    </>
  );
};

export default Card_event;
