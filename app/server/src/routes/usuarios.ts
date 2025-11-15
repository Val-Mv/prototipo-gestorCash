import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Usuario } from '../models/Usuario';
import { Rol } from '../models/Rol';
import { usuarioCreateSchema, usuarioUpdateSchema, usuarioEstadoSchema } from '../schemas/usuario';

const router = Router();

// Crear un nuevo usuario
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = usuarioCreateSchema.parse(req.body);

    const existingUser = await Usuario.findOne({ where: { email: validatedData.email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Hashear contraseña con bcrypt
    const saltRounds = 10;
    const contrasenahash = await bcrypt.hash(validatedData.contrasena, saltRounds);

    const usuario = await Usuario.create({
      nombreCompleto: validatedData.nombreCompleto,
      email: validatedData.email,
      contrasenahash,
      telefono: validatedData.telefono || null,
      idRol: validatedData.idRol,
      estadoActivo: validatedData.estadoActivo ? 1 : 0,
    });

    // Retornar usuario sin la contraseña hash
    const usuarioResponse = usuario.toJSON();
    delete (usuarioResponse as any).contrasenahash;

    return res.status(201).json(usuarioResponse);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    } else {
      console.error('Error al crear usuario:', error);
      return res.status(500).json({ error: error.message });
    }
  }
});

// Obtener todos los usuarios con JOIN a rol
router.get('/', async (req: Request, res: Response) => {
  try {
    const { skip = '0', limit = '100', idRol, soloActivos = 'true' } = req.query;

    const where: any = {};
    if (soloActivos === 'true') {
      // El campo en la BD ahora es camelCase
      where.estadoActivo = 1;
    }
    if (idRol) {
      where.idRol = Number(idRol);
    }

    const usuarios = await Usuario.findAll({
      where,
      include: [
        {
          model: Rol,
          as: 'rol',
          attributes: ['idRol', 'nombreRol'],
        },
      ],
      limit: Number(limit),
      offset: Number(skip),
      order: [['fechaCreacion', 'DESC']],
      attributes: ['idUsuario', 'nombreCompleto', 'email', 'estadoActivo', 'idRol'],
    });

    // Formatear respuesta con los campos requeridos
    // Leer SIEMPRE valor REAL de BD desde dataValues (nombre propiedad TypeScript: estadoActivo)
    const usuariosFormateados = usuarios.map((usuario) => {
      // Acceder a dataValues directamente para obtener el valor raw antes del getter
      const estado = Number((usuario as any).dataValues.estadoActivo);
      return {
        idUsuario: usuario.idUsuario,
        nombreCompleto: usuario.nombreCompleto,
        email: usuario.email,
        estadoActivo: estado,
        nombreRol: (usuario as any).rol?.nombreRol || null,
      };
    });

    return res.json(usuariosFormateados);
  } catch (error: any) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Obtener un usuario por ID
router.get('/:idUsuario', async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findByPk(req.params.idUsuario);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json(usuario);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Actualizar estado de un usuario
router.patch('/:id/estado', async (req: Request, res: Response) => {
  try {
    const idUsuario = parseInt(req.params.id, 10);
    if (isNaN(idUsuario)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const { estadoActivo } = usuarioEstadoSchema.parse(req.body);

    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.update({ estadoActivo: estadoActivo ? 1 : 0 });

    // Leer estado real de BD desde dataValues (nombre propiedad TypeScript: estadoActivo)
    // Recargar el usuario para obtener el valor actualizado desde la BD
    await usuario.reload();
    const estadoRealBD = Number((usuario as any).dataValues.estadoActivo);

    return res.json({
      idUsuario: usuario.idUsuario,
      estadoActivo: estadoRealBD,
      mensaje: `Usuario ${estadoRealBD === 1 ? 'activado' : 'desactivado'} correctamente`,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    }
    console.error('Error al actualizar estado:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Actualizar un usuario
router.put('/:idUsuario', async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findByPk(req.params.idUsuario);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const datosActualizados = usuarioUpdateSchema.parse(req.body);
    if (Object.keys(datosActualizados).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
    }
    delete (datosActualizados as any).idUsuario;

    // Si se actualiza la contraseña, hashearla
    if (datosActualizados.contrasena) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(datosActualizados.contrasena, saltRounds);
      (datosActualizados as any).contrasenahash = hashedPassword;
      delete (datosActualizados as any).contrasena;
    }

    // El setter del modelo se encargará de la conversión de estadoActivo si viene en el body
    if (datosActualizados.estadoActivo !== undefined) {
      (datosActualizados as any).estadoActivo = datosActualizados.estadoActivo ? 1 : 0;
    }

    await usuario.update(datosActualizados as any);

    // Retornar usuario sin la contraseña hash
    const usuarioResponse = usuario.toJSON();
    delete (usuarioResponse as any).contrasenahash;

    return res.json(usuarioResponse);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    } else {
      console.error('Error al actualizar usuario:', error);
      return res.status(500).json({ error: error.message });
    }
  }
});

// Desactivar un usuario
router.delete('/:idUsuario', async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findByPk(req.params.idUsuario);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Desactivar usuario: el setter del modelo convertirá false a 0
    await usuario.update({ estadoActivo: 0 });
    return res.json({ mensaje: 'Usuario desactivado correctamente' });
  } catch (error: any) {
    console.error('Error al desactivar usuario:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
