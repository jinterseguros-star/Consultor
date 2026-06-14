require("dotenv").config();
const { PrismaMssql } = require("@prisma/adapter-mssql");  // ← Mssql, no MsSql
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaMssql({
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;