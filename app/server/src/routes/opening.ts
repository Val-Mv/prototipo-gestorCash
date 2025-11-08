import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { OpeningCount } from '../models/OpeningCount';
import { openingCountCreateSchema } from '../schemas/opening';

const router = Router();

// Crear un nuevo conteo de apertura
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = openingCountCreateSchema.parse(req.body);
    
    const openingCount = await OpeningCount.create({
      id: uuidv4(),
      ...validatedData,
      timestamp: new Date(),
    });

    res.status(201).json(openingCount);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Obtener todos los conteos de apertura
router.get('/', async (req: Request, res: Response) => {
  try {
    const { skip = 0, limit = 100, store_id, date } = req.query;
    
    const where: any = {};
    if (store_id) where.store_id = store_id;
    if (date) where.date = date;

    const openingCounts = await OpeningCount.findAll({
      where,
      limit: Number(limit),
      offset: Number(skip),
    });

    res.json(openingCounts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un conteo de apertura por ID
router.get('/:opening_id', async (req: Request, res: Response) => {
  try {
    const openingCount = await OpeningCount.findByPk(req.params.opening_id);
    
    if (!openingCount) {
      return res.status(404).json({ error: 'Opening count not found' });
    }

    res.json(openingCount);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un conteo de apertura
router.put('/:opening_id', async (req: Request, res: Response) => {
  try {
    const validatedData = openingCountCreateSchema.parse(req.body);
    const openingCount = await OpeningCount.findByPk(req.params.opening_id);
    
    if (!openingCount) {
      return res.status(404).json({ error: 'Opening count not found' });
    }

    await openingCount.update(validatedData);
    res.json(openingCount);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Eliminar un conteo de apertura
router.delete('/:opening_id', async (req: Request, res: Response) => {
  try {
    const openingCount = await OpeningCount.findByPk(req.params.opening_id);
    
    if (!openingCount) {
      return res.status(404).json({ error: 'Opening count not found' });
    }

    await openingCount.destroy();
    res.json({ message: 'Opening count deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

