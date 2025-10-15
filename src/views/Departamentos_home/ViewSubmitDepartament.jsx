import { Layout } from "antd";
import FormSubmitDepartament from "../../Components/Departaments/Submit_departaments/FormSubmit_departaments.jsx";


const ViewSubmitDepartament = () => {

    //obtener el id desde la url, :id
    const id = window.location.pathname.split("/").pop();

    const svgBackground = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' width='40' height='59.428' patternTransform='rotate(155)scale(2)' patternUnits='userSpaceOnUse'><rect width='100%' height='100%' fill='%230466c8'/><path fill='none' stroke='%23023e7e' stroke-linecap='round' stroke-linejoin='round' stroke-width='5' d='M0 70.975V47.881m20-1.692L8.535 52.808v13.239L20 72.667l11.465-6.62V52.808zm0-32.95 11.465-6.62V-6.619L20-13.24 8.535-6.619V6.619zm8.535 4.927v13.238L40 38.024l11.465-6.62V18.166L40 11.546zM20 36.333 0 47.88m0 0v23.094m0 0 20 11.548 20-11.548V47.88m0 0L20 36.333m0 0 20 11.549M0 11.547l-11.465 6.619v13.239L0 38.025l11.465-6.62v-13.24zv-23.094l20-11.547 20 11.547v23.094M20 36.333V13.24'/></pattern></defs><rect width='800%' height='800%' fill='url(%23a)' transform='translate(-158 -228)'/></svg>`;

  return (
   <Layout style={{ 
  width: "100vw", 
  minHeight: "100vh",
  padding: 20, 
  backgroundImage: `url("${svgBackground}")`, 
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}}>
  <div style={{
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgb(219, 219, 219)"
  }}>
    <FormSubmitDepartament id={id} />
  </div>
</Layout>

  );
};

export default ViewSubmitDepartament;
