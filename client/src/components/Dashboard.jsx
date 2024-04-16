import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [carProductList, setCarProductList] = useState([]);

  async function fetchCarData() {
    try {
      const result = await axios.get("http://localhost:3005/car-product");
      setCarProductList(result.data);
      console.log(result.data);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  }
  console.log(carProductList);

  useEffect(() => {
    fetchCarData();
  }, []);

  return (
    <div>
      <h1>Car Products</h1>
    </div>
  );
}

export default Dashboard;
