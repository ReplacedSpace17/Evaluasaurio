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

const Grafica2 = ({ datos }) => {
  const hasData = Array.isArray(datos) && datos.length > 0;

  const labels = hasData ? datos.map(d => d.materia) : ["Sin datos"];
  const dataValues = hasData ? datos.map(d => d.promedio) : [0];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Calificación promedio",
        data: dataValues,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
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
        text: "Calificación promedio por materia",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
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

export default Grafica2;
