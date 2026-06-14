const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const verifyToken = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar usuario
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - password
 *               - persona_id
 *             properties:
 *               usuario:
 *                 type: string
 *               password:
 *                 type: string
 *               persona_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Usuario creado
 */
router.post("/register", async (req, res) => {
  try {
    const { usuario, password, persona_id } = req.body;

    if (!usuario || !password || !persona_id) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const existingUser = await prisma.usuario.findUnique({
      where: { usuario },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    const persona = await prisma.persona.findUnique({
      where: { id_Persona: persona_id },
    });

    if (!persona) {
      return res.status(400).json({ message: "Persona no existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.usuario.create({
      data: {
        usuario,
        pass: hashedPassword,
        estado: 1, // ✅ usuario normal por defecto
        persona: {
          connect: { id_Persona: persona_id },
        },
      },
    });

    res.json({
      message: "Usuario creado",
      user,
    });

  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ message: "Error en registro" });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - password
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: juan123
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Token JWT
 *       400:
 *         description: Credenciales inválidas
 */
router.post("/login", async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const user = await prisma.usuario.findUnique({
      where: { usuario },
    });

    if (!user) {
      return res.status(400).json({ message: "Usuario no existe" });
    }

    const valid = await bcrypt.compare(password, user.pass);

    if (!valid) {
      return res.status(400).json({ message: "Password incorrecto" });
    }

    // ✅ Ahora permitimos estado 1 y 2
    if (user.estado !== 1 && user.estado !== 2) {
      return res.status(403).json({ message: "Usuario inactivo" });
    }

    const token = jwt.sign(
      {
        id: user.id_Usuario,
        usuario: user.usuario,
        estado: user.estado, // 🔥 importante para permisos
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "3m",
      }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id_Usuario,
        usuario: user.usuario,
        estado: user.estado,
      },
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en login" });
  }
});

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Cambiar contraseña
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: 123456
 *               newPassword:
 *                 type: string
 *                 example: nueva123
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       400:
 *         description: Error en datos
 *       401:
 *         description: No autorizado
 */
router.post("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Debe enviar currentPassword y newPassword",
      });
    }

    const userId = req.user.id;

    const user = await prisma.usuario.findUnique({
      where: { id_Usuario: userId },
    });

    const valid = await bcrypt.compare(currentPassword, user.pass);

    if (!valid) {
      return res.status(400).json({
        message: "Contraseña actual incorrecta",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.usuario.update({
      where: { id_Usuario: userId },
      data: {
        pass: hashedPassword,
      },
    });

    res.json({
      message: "Contraseña actualizada correctamente",
    });

  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    res.status(500).json({ message: "Error al cambiar contraseña" });
  }
});

/**
 * @swagger
 * /auth/admin/change-password:
 *   post:
 *     summary: Cambiar contraseña de otro usuario (ADMIN)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - newPassword
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 5
 *               newPassword:
 *                 type: string
 *                 example: nueva123
 *     responses:
 *       200:
 *         description: Contraseña actualizada por administrador
 *       403:
 *         description: No autorizado
 */

router.post("/admin/change-password", verifyToken, async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({
        message: "Datos incompletos",
      });
    }

    // ✅ Validar admin por estado
    if (req.user.estado !== 2) {
      return res.status(403).json({
        message: "No tienes permisos de administrador",
      });
    }

    const user = await prisma.usuario.findUnique({
      where: { id_Usuario: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.usuario.update({
      where: { id_Usuario: userId },
      data: {
        pass: hashedPassword,
      },
    });

    res.json({
      message: "Contraseña cambiada por administrador",
    });

  } catch (error) {
    console.error("Error admin change password:", error);
    res.status(500).json({
      message: "Error al cambiar contraseña",
    });
  }
});

module.exports = router;
