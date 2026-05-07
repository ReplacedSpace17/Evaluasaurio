import versiones from "../versions/versions.json";

// 🧩 Verificar si ya visitó la intro
const getVisitado = () => {
  const visitado = localStorage.getItem("isNew");
 // Si no existe, retornar false
  return visitado === "true" ? true : false;
};
// 🧩 Verificar si ya acepto el aviso de privacidad
const getPolicyAccepted = () => {
  const accepted = localStorage.getItem("policyAccepted");
  return accepted === "true" ? true : false;
};

//setear que el aviso de privacidad fue aceptado
const setPolicyAccepted = () => {
  localStorage.setItem("policyAccepted", "true");
};

const setVisitado = () => {
  localStorage.setItem("isNew", "true");
};

// 🧩 Obtener del JSON la última versión
const latestVersion = versiones[versiones.length - 1]?.nameversion || "none";
console.log("Última versión del JSON:", latestVersion);

const getLastVersionSeen = () => {
  const version = localStorage.getItem(`lasted_version`);
  let result;
    if (version === latestVersion) {
      result = true; // Ya vio la última versión
    } else {
      result = false; // No ha visto la última versión
    }
  return result;
};

//regresar el json de la version
const getDataVersion = () => {
  return versiones[versiones.length - 1] || {nameversion: "none", novedades: []};
};
const setLastVersionSeen = () => {
  localStorage.setItem(`lasted_version`, latestVersion);
};



export { getVisitado, setVisitado, getLastVersionSeen, setLastVersionSeen, getDataVersion, getPolicyAccepted, setPolicyAccepted };
