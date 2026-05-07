import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BounceLoader from "react-spinners/BounceLoader";
import logo from "../../assets/logo2.svg";

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // avisa que terminó
    }, 1000); // 1.5 segundos
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#193961",
    }}>
      <motion.img
        src={logo}
        alt="JurassicProf"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ width: 120 }}
      />
      <div style={{ marginTop: 40 }}>
        <BounceLoader color="#D9D9D9" size={40} />
      </div>
    </div>
  );
};

export default SplashScreen;
