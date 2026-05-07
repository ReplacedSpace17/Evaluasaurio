import versiones from "../versions/versions.json";


const getVisitado = () => {
  const visitado = localStorage.getItem("isNew");
  return visitado === "true" ? true : false;
};

const getPolicyAccepted = () => {
  const accepted = localStorage.getItem("policyAccepted");
  return accepted === "true" ? true : false;
};


const setPolicyAccepted = () => {
  localStorage.setItem("policyAccepted", "true");
};

const setVisitado = () => {
  localStorage.setItem("isNew", "true");
};


const latestVersion = versiones[versiones.length - 1]?.nameversion || "none";
console.log("Última versión del JSON:", latestVersion);

const getLastVersionSeen = () => {
  const version = localStorage.getItem(`lasted_version`);
  let result;
    if (version === latestVersion) {
      result = true; 
    } else {
      result = false; 
    }
  return result;
};


const getDataVersion = () => {
  return versiones[versiones.length - 1] || {nameversion: "none", novedades: []};
};
const setLastVersionSeen = () => {
  localStorage.setItem(`lasted_version`, latestVersion);
};



export { getVisitado, setVisitado, getLastVersionSeen, setLastVersionSeen, getDataVersion, getPolicyAccepted, setPolicyAccepted };
