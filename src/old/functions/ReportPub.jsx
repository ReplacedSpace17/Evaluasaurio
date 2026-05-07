import axios from "axios";  
import backend from "../config/backend";

const ReportPub = async (id_target, publication_type, complaint_type, description) => {
    try {
        console.log("🔍 Parámetros recibidos en ReportPub:", {
            id_target,
            publication_type, 
            complaint_type,
            description
        });

        // 🔥 VALIDAR QUE id_target NO SEA UNDEFINED
        if (id_target === undefined || id_target === null) {
            throw new Error("id_target es undefined - verifica la publicación seleccionada");
        }

        // 🔥 FECHA CORRECTA - FORMATO MySQL
        const now = new Date();
        const created_at = now.toISOString().slice(0, 19).replace('T', ' ');
        // Resultado: "2024-06-12 10:00:00"
        
        const jsonData = {
            id_target: Number(id_target),
            publication_type: Number(publication_type), 
            complaint_type: Number(complaint_type),
            description: String(description),
            created_at: created_at
        };

        console.log("📤 Enviando reporte CORREGIDO:", jsonData);

        const response = await axios.post(`${backend}/request_revisions/add`, jsonData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log("✅ Respuesta del servidor:", response.data);
        return response.data;
        
    } catch (error) {
        console.error("❌ Error en ReportPub:", error);
        
        if (error.response) {
            console.error("📋 Error del servidor:", error.response.data);
        }
        
        throw error;
    }
};

export { ReportPub };