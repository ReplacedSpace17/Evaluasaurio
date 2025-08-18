import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Select } from "antd";
import "antd/dist/reset.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const { Option } = Select;

const Grafica3 = ({ datos }) => {
  // Verificamos si los datos son un arreglo válido
  const hasData = Array.isArray(datos) && datos.length > 0;

  // Si no es arreglo, intentamos detectar un mensaje de error
  const mensajeError = !hasData && datos?.success === false ? datos.message : null;

  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(hasData ? datos[0]?.nombre : "");
  const materiaData = hasData ? datos.find(d => d.nombre === materiaSeleccionada) : null;
  const [anioSeleccionado, setAnioSeleccionado] = useState(
    materiaData ? materiaData.fecha[materiaData.fecha.length - 1]?.año : new Date().getFullYear()
  );
  const anioData = materiaData ? materiaData.fecha.find(f => f.año === Number(anioSeleccionado)) || { puntaje: [], prediccion: [] } : { puntaje: [], prediccion: [] };

  const fechas = hasData
    ? anioData.prediccion
      ? [...anioData.puntaje, ...anioData.prediccion].map(d => meses[parseInt(d.fecha.split("-")[1], 10) - 1])
      : anioData.puntaje.map(d => meses[parseInt(d.fecha.split("-")[1], 10) - 1])
    : ["Sin datos"];

  const calificacionesReales = hasData ? anioData.puntaje.map(c => c.calificacion) : [0];
  const calificacionesPrediccionDataset = hasData && anioData.prediccion
    ? [...new Array(calificacionesReales.length - 1).fill(null), ...[calificacionesReales[calificacionesReales.length - 1], ...anioData.prediccion.map(p => p.calificacion)]]
    : [];

  const data = {
    labels: fechas,
    datasets: hasData
      ? [
          {
            label: "Calificación promedio",
            data: [...calificacionesReales, ...new Array(anioData.prediccion ? anioData.prediccion.length : 0).fill(null)],
            fill: false,
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.4)",
            tension: 0.2
          },
          ...(anioData.prediccion ? [{
            label: "Predicción",
            data: calificacionesPrediccionDataset,
            fill: false,
            borderColor: "rgba(255,99,132,1)",
            borderDash: [5,5],
            backgroundColor: "rgba(255,99,132,0.4)",
            tension: 0.2
          }] : [])
        ]
      : [
          {
            label: "Calificación promedio",
            data: [0],
            fill: false,
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.4)",
            tension: 0.2
          }
        ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: hasData ? "Evolución de calificaciones por materia" : mensajeError || "No hay datos para mostrar" }
    },
    scales: { y: { beginAtZero: true, max: 5 } }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: 450 }}>
      {hasData && !mensajeError ? (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: 10 }}>
          <Select
            value={materiaSeleccionada}
            style={{ width: 150 }}
            onChange={(value) => {
              setMateriaSeleccionada(value);
              const nuevaMateria = datos.find(d => d.nombre === value);
              setAnioSeleccionado(nuevaMateria.fecha[nuevaMateria.fecha.length - 1].año);
            }}
          >
            {datos.map(d => <Option key={d.nombre} value={d.nombre}>{d.nombre}</Option>)}
          </Select>

          <Select
            value={anioSeleccionado}
            style={{ width: 100 }}
            onChange={(value) => setAnioSeleccionado(Number(value))}
          >
            {materiaData?.fecha.map(f => <Option key={f.año} value={f.año}>{f.año}</Option>)}
          </Select>
        </div>
      ) : (
        <div style={{ textAlign: "center", paddingTop: 50, color: "#888" }}>
          {mensajeError || "No hay datos para mostrar"}
        </div>
      )}

      <Line data={data} options={options} />
    </div>
  );
};


export default Grafica3;
