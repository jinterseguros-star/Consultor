require("dotenv").config();
const express = require("express");

const authRoutes = require("./routes/auth");
const polizaRoutes = require("./routes/polizas");


const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");


const app = express();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/polizas", polizaRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});