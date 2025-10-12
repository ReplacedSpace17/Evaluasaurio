import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Novedades = ({ title, width, data }) => {
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
        {data
          .filter(item => item.visible)
          .map((item) =>
            item.url && item.url.toLowerCase() !== "none" ? (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: 18,
                    border: "1px solid #D1D9E0",
                  }}
                />
              </a>
            ) : (
              <img
                key={item.id}
                src={item.img}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: 18,
                  border: "1px solid #D1D9E0",
                }}
              />
            )
          )}
      </Slider>
    </div>
  );
};

export default Novedades;
