import { Router, Request, Response } from 'express';
import { Store } from '../models/Store';
import { CashRegister } from '../models/CashRegister';
import { storeCreateSchema, cashRegisterCreateSchema } from '../schemas/store';

const router = Router();

// ========== STORES ==========

// Crear una nueva tienda
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = storeCreateSchema.parse(req.body);
    const store = await Store.create(validatedData);
    res.status(201).json(store);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
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

    res.json(stores);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una tienda por ID
router.get('/:store_id', async (req: Request, res: Response) => {
  try {
    const store = await Store.findByPk(req.params.store_id);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json(store);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una tienda
router.put('/:store_id', async (req: Request, res: Response) => {
  try {
    const store = await Store.findByPk(req.params.store_id);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const updateData = { ...req.body };
    delete updateData.id; // No permitir cambiar el ID

    await store.update(updateData);
    res.json(store);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
    res.json({ message: 'Store deactivated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== CASH REGISTERS ==========

// Crear una nueva registradora
router.post('/registers', async (req: Request, res: Response) => {
  try {
    const validatedData = cashRegisterCreateSchema.parse(req.body);
    const register = await CashRegister.create(validatedData);
    res.status(201).json(register);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Obtener todas las registradoras
router.get('/registers', async (req: Request, res: Response) => {
  try {
    const { store_id, active_only = 'true' } = req.query;
    
    const where: any = {};
    if (store_id) where.store_id = store_id;
    if (active_only === 'true') {
      where.active = true;
    }

    const registers = await CashRegister.findAll({ where });
    res.json(registers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una registradora por ID
router.get('/registers/:register_id', async (req: Request, res: Response) => {
  try {
    const register = await CashRegister.findByPk(req.params.register_id);
    
    if (!register) {
      return res.status(404).json({ error: 'Cash register not found' });
    }

    res.json(register);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una registradora
router.put('/registers/:register_id', async (req: Request, res: Response) => {
  try {
    const register = await CashRegister.findByPk(req.params.register_id);
    
    if (!register) {
      return res.status(404).json({ error: 'Cash register not found' });
    }

    const updateData = { ...req.body };
    delete updateData.id; // No permitir cambiar el ID

    await register.update(updateData);
    res.json(register);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar (desactivar) una registradora
router.delete('/registers/:register_id', async (req: Request, res: Response) => {
  try {
    const register = await CashRegister.findByPk(req.params.register_id);
    
    if (!register) {
      return res.status(404).json({ error: 'Cash register not found' });
    }

    await register.update({ active: false });
    res.json({ message: 'Cash register deactivated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

