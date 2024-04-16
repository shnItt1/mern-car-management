import express from "express";
import bodyParser from "body-parser";
import { connectToDatabase } from "./utils/db.js";
import { ObjectId } from "mongodb";
import cors from "cors";

async function init() {
  const app = express();
  const PORT = process.env.PORT || 3005;

  const db = await connectToDatabase();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // GET all products
  app.get("/car-product", async (req, res) => {
    try {
      const collection = db.collection("carsdata");
      const carsProduct = await collection.find({}).toArray();
      res.json({
        message: "Fetching data sucessful!",
        carsProduct: carsProduct,
      });
    } catch (error) {
      console.log("Error fetching Data", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // GET by Id
  app.get("/car-product/:id", async (req, res) => {
    const carId = new ObjectId(req.params.carId);

    try {
      const collection = db.collection("carsdata");
      const carsProduct = await collection.findOne({ _id: carId }).toArray();

      res.json({
        message: `Car id ${carId}`,
        carsProduct: carsProduct[0],
      });
    } catch (error) {
      console.log("Error fetching Data", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Edit Product
  app.put("/car-product/:id", async (req, res) => {
    const carId = new ObjectId(req.params.carId);

    const updatedCar = {
      ...req.body,
      updatedAt: new Date(),
    };

    try {
      const collection = db.collection("carsdata");
      const carsProduct = await collection.updateOne(
        {
          _id: carId,
        },
        { $set: updatedCar }
      );

      if (!carId) {
        return res.status(404).send(`Car Id ${carId} not found`);
      }

      res.json({
        message: `Car Id ${carId} updated successfully!`,
        updatedCar: updatedCar,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Add new product
  app.post("/car-product", async (req, res) => {
    const collection = db.collection("carsdata");

    try {
      const newCarProduct = {
        ...req.body,
        _id: new ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const carsProduct = await collection.insertOne(newCarProduct);
      res.json({
        message: "New Car has been created!",
        newCarProduct: newCarProduct,
      });
    } catch (error) {
      console.error("Error adding new product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Delete Product
  app.delete("/car-product/:id", async (req, res) => {
    const collection = db.collection("carsdata");

    try {
      const delProduct = await collection.deleteOne({
        _id: new ObjectId(req.params.id),
      });

      if (delProduct.deletedCount === 0) {
        return res
          .status(404)
          .send(`This car Id: ${req.params.id} was not found`);
      }
      res.json({
        message: "Product has been deleted",
        delProduct: delProduct,
      });
    } catch (error) {
      console.error("Error deleting car:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
  });
}

init();
