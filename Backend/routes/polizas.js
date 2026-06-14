const express = require("express");
const verifyToken = require("../middleware/auth");
const prisma = require("../prismaClient");

const router = express.Router();

/**
 * @swagger
 * /polizas/buscar:
 *   get:
 *     summary: Buscar pólizas por texto
 *     tags: [Polizas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: texto
 *         required: true
 *         schema:
 *           type: string
 *         description: Texto de búsqueda
 *     responses:
 *       200:
 *         description: Lista de pólizas encontradas
 *       400:
 *         description: Parámetro inválido
 *       401:
 *         description: No autorizado (JWT)
 *       500:
 *         description: Error del servidor
 */
router.get("/buscar", verifyToken, async (req, res) => {
  try {
    const { texto } = req.query;

    if (!texto) {
      return res.status(400).json({
        message: "Debe enviar el parámetro 'texto'",
      });
    }

    // 🔥 Query segura (evita SQL injection)
    const result = await prisma.$queryRaw`
      SELECT * FROM dbo.fn_BuscarPolizas(${texto})
    `;

    res.json({
      count: result.length,
      data: result,
    });

  } catch (error) {
    console.error("Error buscar pólizas:", error);

    res.status(500).json({
      message: "Error ejecutando la función",
    });
  }
});

module.exports = router;