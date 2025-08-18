import { Layout } from "antd";
import FormSubmit from "../../Components/FormSubmit.jsx";


const ViewSubmit = () => {

    //obtener el id desde la url, :id
    const id = window.location.pathname.split("/").pop();
    
    const svgBackground = `data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22a%22%20width%3D%2277.141%22%20height%3D%2241%22%20patternTransform%3D%22rotate(165)scale(2)%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%238696a2%22/%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22%236f7c85%22%20stroke-width%3D%227%22%20d%3D%22M73.212%2040H50.118L38.57%2020%2050.118%200h23.094l11.547%2020zM61.665%2060H38.57L27.023%2040%2038.57%2020h23.095l11.547%2020zm0-40H38.57L27.023%200%2038.57-20h23.095L73.212%200zM38.57%2060H15.476L3.93%2040l11.547-20h23.095l11.547%2020zm0-40H15.476L3.93%200l11.547-20h23.095L50.118%200zM27.023%2040H3.93L-7.617%2020%203.93%200h23.094L38.57%2020z%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width%3D%22800%25%22%20height%3D%22800%25%22%20fill%3D%22url(%23a)%22%20transform%3D%22translate(-70%20-52)%22/%3E%3C/svg%3E`;

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
    <FormSubmit id={id} />
  </div>
</Layout>

  );
};

export default ViewSubmit;
