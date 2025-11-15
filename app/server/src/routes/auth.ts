import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario';
import { Rol } from '../models/Rol';
import { loginSchema } from '../schemas/auth';

const router = Router();

// POST /auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, contrasena } = loginSchema.parse(req.body);

    // Buscar usuario por email con su rol
    // Usar raw: false para obtener instancia del modelo (necesario para getDataValue)
    const usuario = await Usuario.findOne({
      where: { email },
      include: [
        {
          model: Rol,
          as: 'rol',
          attributes: ['idRol', 'nombreRol', 'descripcion'],
        },
      ],
      // Asegurar que se carguen todos los campos necesarios
      attributes: ['idUsuario', 'nombreCompleto', 'email', 'contrasenahash', 'telefono', 'estadoActivo', 'idRol', 'fechaCreacion'],
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // LOG TEMPORAL PARA DEPURAR (BORRAR LUEGO)
    // Sequelize almacena en dataValues usando el nombre de la propiedad TypeScript
    // contrasenahash: propiedad TypeScript coincide con campo BD
    // estadoActivo: propiedad TypeScript (mapeada a estadoactivo en BD)
    const hash = (usuario as any).dataValues.contrasenahash;
    const rawEstado = (usuario as any).dataValues.estadoActivo;

    console.log("DATA VALUES AUTH:", (usuario as any).dataValues);
    console.log("HASH REAL:", hash);
    console.log("ESTADO REAL LOGIN:", rawEstado);

    // Comparar contraseña con bcrypt PRIMERO (antes de verificar estado)
    // Esto evita revelar si el usuario existe o no
    // Acceder directamente a dataValues para obtener el hash sin pasar por getters
    console.log("LOGIN → Hash real en BD:", hash);
    console.log("LOGIN → Contraseña recibida:", contrasena);
    console.log("LOGIN → Tipo de hash:", typeof hash, "Longitud:", hash?.length);

    if (!hash || typeof hash !== 'string') {
      console.error('ERROR: No se pudo obtener el hash de contraseña o no es válido');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar formato del hash bcrypt
    if (!hash.startsWith('$2b$') && !hash.startsWith('$2a$') && !hash.startsWith('$2y$')) {
      console.error('ERROR: Hash no tiene formato bcrypt válido');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, hash);
    console.log("LOGIN → Resultado bcrypt.compare:", contrasenaValida);

    if (!contrasenaValida) {
      console.error('ERROR: La contraseña no coincide con el hash');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar estado activo usando el valor raw de la base de datos
    // Acceder directamente a dataValues usando el nombre de la propiedad TypeScript (estadoActivo)
    // que contiene el valor raw antes del getter: "1" o "0" como string
    console.log("LOGIN → Estado real:", rawEstado);
    if (Number(rawEstado) !== 1) {
      return res.status(403).json({ error: 'Usuario inactivo. Contacte al administrador.' });
    }

    // Generar token JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-change-in-production';
    const token = jwt.sign(
      {
        idUsuario: usuario.idUsuario,
        email: usuario.email,
        idRol: usuario.idRol,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar respuesta con token y datos del usuario
    // Obtener el valor raw (numeric) de estadoActivo desde dataValues (nombre propiedad TypeScript)
    const rawEstadoResponse = Number(rawEstado);
    const usuarioData = usuario.toJSON();
    const rolData = (usuario as any).rol?.toJSON() || null;

    return res.json({
      token,
      usuario: {
        idusuario: usuarioData.idUsuario,
        nombrecompleto: usuarioData.nombreCompleto,
        email: usuarioData.email,
        telefono: usuarioData.telefono || null,
        estadoactivo: rawEstadoResponse,
        idrol: usuarioData.idRol,
        nombrerol: rolData?.nombreRol || null,
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    }
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;


