import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Novedades = ({ title, width, data, isMobile }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true
  };

  const imageHeight = isMobile ? 180 : 250; // altura adaptada según mobile

  return (
    <div
      style={{
        width: width,
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        padding: 0,
        borderRadius: 18,
        userSelect: "none",
      }}
    >
      <h2
        style={{
          fontSize: "17px",
          fontWeight: 400,
          marginBottom: 10,
        }}
      >
        {title}
      </h2>

     <Slider {...settings}>
  {data.filter(item => item.visible).map(item => (
    <div
      key={item.id}
      style={{
        height: imageHeight, // fuerza altura uniforme
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {item.url && item.url.toLowerCase() !== "none" ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ width: "100%", height: "100%" }}>
          <img
            src={item.img}
            alt={item.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 18,
              border: "1px solid #D1D9E0",
            }}
          />
        </a>
      ) : (
        <img
          src={item.img}
          alt={item.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 18,
            border: "1px solid #D1D9E0",
          }}
        />
      )}
    </div>
  ))}
</Slider>

    </div>
  );
};

export default Novedades;
