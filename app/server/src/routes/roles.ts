import { Router, Request, Response } from 'express';
import { Rol } from '../models/Rol';

const router = Router();

// Listar todos los roles
router.get('/', async (_req: Request, res: Response) => {
  try {
    const roles = await Rol.findAll({ 
      order: [['nombreRol', 'ASC']] 
    });
    return res.json(roles);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Obtener un rol por ID
router.get('/:idRol', async (req: Request, res: Response) => {
  try {
    const rol = await Rol.findByPk(req.params.idRol);

    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    return res.json(rol);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;

