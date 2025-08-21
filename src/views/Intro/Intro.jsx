import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Importa tus imágenes
import fondo from "../../assets/slides/slide.webp";
import objetivo from "../../assets/slides/slide.webp";
import flow from "../../assets/slides/slide.webp";
import beneficio from "../../assets/slides/slide.webp";
import comenzar from "../../assets/slides/slide.webp";

const slides = [
  {
    title: "Bienvenido a JurassicProf",
    text: "Una plataforma para estudiantes que buscan evaluar docentes de manera objetiva y constructiva.",
    img: fondo
  },
  {
    title: "Objetivo",
    text: "No se trata de juzgar o despreciar, sino de brindar un panorama justo y equilibrado.",
    img: objetivo
  },
  {
    title: "Cómo funciona",
    text: "Los alumnos registran opiniones basadas en criterios objetivos. Se generan reportes claros y útiles.",
    img: flow
  },
  {
    title: "Beneficio",
    text: "Los docentes reciben retroalimentación valiosa y los estudiantes evalúan con criterio y transparencia.",
    img: beneficio
  },
  {
    title: "¡Comencemos!",
    text: "",
    img: comenzar,
    button: true
  }
];

// Animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const IntroSlides = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={50}
      slidesPerView={1}
      style={{ height: "100vh", width: "100%" }}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="relative h-full w-full">
            {/* Imagen de fondo (z-0) */}
            <img
              src={slide.img}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Overlay semitransparente (z-10) */}
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

            {/* Contenido en primer plano (z-20) */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6 text-white"
            >
              <motion.h2
                className="text-4xl font-bold mb-4 drop-shadow-lg"
                variants={itemVariants}
              >
                {slide.title}
              </motion.h2>
              <motion.p
                className="text-lg max-w-2xl mb-6 drop-shadow-md"
                variants={itemVariants}
              >
                {slide.text}
              </motion.p>
              {slide.button && (
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = "/")}
                  className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg"
                >
                  Empezar
                </motion.button>
              )}
            </motion.div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default IntroSlides;
