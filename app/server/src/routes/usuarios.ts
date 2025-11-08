import { Router, Request, Response } from 'express';
import { Usuario } from '../models/Usuario';
import { usuarioCreateSchema } from '../schemas/usuario';

const router = Router();

// Crear un nuevo usuario
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = usuarioCreateSchema.parse(req.body);

    const existingUser = await Usuario.findOne({ where: { email: validatedData.email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const usuario = await Usuario.create({
      ...validatedData,
      estadoActivo: validatedData.estadoActivo ?? true,
    });

    res.status(201).json(usuario);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Obtener todos los usuarios
router.get('/', async (req: Request, res: Response) => {
  try {
    const { skip = '0', limit = '100', idRol, soloActivos = 'true' } = req.query;

    const where: any = {};
    if (soloActivos === 'true') {
      where.estadoActivo = true;
    }
    if (idRol) {
      where.idRol = Number(idRol);
    }

    const usuarios = await Usuario.findAll({
      where,
      limit: Number(limit),
      offset: Number(skip),
      order: [['fechaCreacion', 'DESC']],
    });

    res.json(usuarios);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un usuario por ID
router.get('/:idUsuario', async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findByPk(req.params.idUsuario);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un usuario
router.put('/:idUsuario', async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findByPk(req.params.idUsuario);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const datosActualizados = { ...req.body };
    delete datosActualizados.idUsuario;

    await usuario.update(datosActualizados);
    res.json(usuario);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Desactivar un usuario
router.delete('/:idUsuario', async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findByPk(req.params.idUsuario);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.update({ estadoActivo: false });
    res.json({ mensaje: 'Usuario desactivado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


