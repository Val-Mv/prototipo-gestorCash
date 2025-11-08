import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { userCreateSchema } from '../schemas/user';

const router = Router();

// Crear un nuevo usuario
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = userCreateSchema.parse(req.body);
    
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email: validatedData.email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create(validatedData);
    res.status(201).json(user);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Obtener todos los usuarios
router.get('/', async (req: Request, res: Response) => {
  try {
    const { skip = 0, limit = 100, role, store_id } = req.query;
    
    const where: any = { active: true };
    if (role) where.role = role;
    if (store_id) where.store_id = store_id;

    const users = await User.findAll({
      where,
      limit: Number(limit),
      offset: Number(skip),
    });

    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un usuario por ID
router.get('/:user_id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.user_id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un usuario
router.put('/:user_id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.user_id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = { ...req.body };
    delete updateData.uid; // No permitir cambiar el UID

    await user.update(updateData);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar (desactivar) un usuario
router.delete('/:user_id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.user_id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ active: false });
    res.json({ message: 'User deactivated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

