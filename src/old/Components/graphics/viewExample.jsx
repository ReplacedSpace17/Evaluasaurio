import React from 'react';
import Grafica1 from './Grafica1';
import Grafica2 from './Grafica2';
import Grafica3 from './Grafica3';

const ViewExample = () => {
  return (
    <div style={{backgroundColor: "#000", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", margin:-10 }}>
      <div style={{width: 500, height: 300, backgroundColor: "rgba(255, 255, 255, 0.88)"}}>
        <Grafica3/>
      </div>
      
      
    </div>
  );
}

export default ViewExample;