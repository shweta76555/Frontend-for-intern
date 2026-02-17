import { useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

function Test() {

  useEffect(() => {
    axiosInstance.get("ProjectItem")
      .then(res => console.log("DATA:", res.data))
      .catch(err => console.log("ERROR:", err));
  }, []);

  return <h2 style={{textAlign:"center", marginTop:"2rem"}}>Testing Backend...</h2>;
}

export default Test;
