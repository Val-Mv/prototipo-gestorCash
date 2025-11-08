import { Router, Request, Response } from 'express';
import { Store } from '../models/Store';
import { CajaRegistradora } from '../models/CajaRegistradora';
import {
  storeCreateSchema,
  storeUpdateSchema,
  cajaRegistradoraCreateSchema,
  cajaRegistradoraUpdateSchema,
} from '../schemas/store';

const router = Router();

// ========== STORES ==========

// Crear una nueva tienda
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = storeCreateSchema.parse(req.body);
    const store = await Store.create(validatedData);
    return res.status(201).json(store);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Obtener todas las tiendas
router.get('/', async (req: Request, res: Response) => {
  try {
    const { skip = 0, limit = 100, active_only = 'true' } = req.query;
    
    const where: any = {};
    if (active_only === 'true') {
      where.active = true;
    }

    const stores = await Store.findAll({
      where,
      limit: Number(limit),
      offset: Number(skip),
    });

    return res.json(stores);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Obtener una tienda por ID
router.get('/:store_id', async (req: Request, res: Response) => {
  try {
    const store = await Store.findByPk(req.params.store_id);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    return res.json(store);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Actualizar una tienda
router.put('/:store_id', async (req: Request, res: Response) => {
  try {
    const store = await Store.findByPk(req.params.store_id);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const updateData = storeUpdateSchema.parse(req.body);
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
    }

    await store.update(updateData);
    return res.json(store);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Eliminar (desactivar) una tienda
router.delete('/:store_id', async (req: Request, res: Response) => {
  try {
    const store = await Store.findByPk(req.params.store_id);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    await store.update({ active: false });
    return res.json({ message: 'Store deactivated successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ========== CASH REGISTERS ==========

// Crear una nueva registradora
router.post('/registers', async (req: Request, res: Response) => {
  try {
    const validatedData = cajaRegistradoraCreateSchema.parse(req.body);
    const register = await CajaRegistradora.create({
      ...validatedData,
      estadoActiva: validatedData.estadoActiva ?? true,
    });
    return res.status(201).json(register);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Obtener todas las registradoras
router.get('/registers', async (req: Request, res: Response) => {
  try {
    const { active_only = 'true' } = req.query;
    
    const where: any = {};
    if (active_only === 'true') {
      where.estadoActiva = true;
    }

    const registers = await CajaRegistradora.findAll({ where });
    return res.json(registers);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Obtener una registradora por ID
router.get('/registers/:register_id', async (req: Request, res: Response) => {
  try {
    const register = await CajaRegistradora.findByPk(req.params.register_id);
    
    if (!register) {
      return res.status(404).json({ error: 'Cash register not found' });
    }

    return res.json(register);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Actualizar una registradora
router.put('/registers/:register_id', async (req: Request, res: Response) => {
  try {
    const register = await CajaRegistradora.findByPk(req.params.register_id);
    
    if (!register) {
      return res.status(404).json({ error: 'Cash register not found' });
    }

    const updateData = cajaRegistradoraUpdateSchema.parse(req.body);
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
    }

    await register.update(updateData);
    return res.json(register);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Eliminar (desactivar) una registradora
router.delete('/registers/:register_id', async (req: Request, res: Response) => {
  try {
    const register = await CajaRegistradora.findByPk(req.params.register_id);
    
    if (!register) {
      return res.status(404).json({ error: 'Cash register not found' });
    }

    await register.update({ estadoActiva: false });
    return res.json({ message: 'Cash register deactivated successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;

