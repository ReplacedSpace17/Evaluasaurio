import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Grafica1 = ({ datos }) => {
  // Si no hay datos, creamos un placeholder
  const hasData = Array.isArray(datos) && datos.length > 0;

  const labels = hasData ? datos.map(d => d.calificacion) : ["0"];
  const dataValues = hasData ? datos.map(d => d.cantidad) : [0];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Número de opiniones",
        data: dataValues,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Distribución de calificaciones",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {hasData ? (
        <Bar data={data} options={options} />
      ) : (
        <div style={{ textAlign: "center", paddingTop: 50, color: "#888" }}>
          No hay datos para mostrar
        </div>
      )}
    </div>
  );
};

export default Grafica1;
