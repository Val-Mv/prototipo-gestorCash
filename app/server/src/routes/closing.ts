import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ClosingCount } from '../models/ClosingCount';
import { closingCountCreateSchema } from '../schemas/closing';

const router = Router();

// Crear un nuevo conteo de cierre
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = closingCountCreateSchema.parse(req.body);
    
    const closingCount = await ClosingCount.create({
      id: uuidv4(),
      ...validatedData,
      timestamp: new Date(),
    });

    res.status(201).json(closingCount);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Obtener todos los conteos de cierre
router.get('/', async (req: Request, res: Response) => {
  try {
    const { skip = 0, limit = 100, store_id, date } = req.query;
    
    const where: any = {};
    if (store_id) where.store_id = store_id;
    if (date) where.date = date;

    const closingCounts = await ClosingCount.findAll({
      where,
      limit: Number(limit),
      offset: Number(skip),
    });

    res.json(closingCounts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un conteo de cierre por ID
router.get('/:closing_id', async (req: Request, res: Response) => {
  try {
    const closingCount = await ClosingCount.findByPk(req.params.closing_id);
    
    if (!closingCount) {
      return res.status(404).json({ error: 'Closing count not found' });
    }

    res.json(closingCount);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un conteo de cierre
router.put('/:closing_id', async (req: Request, res: Response) => {
  try {
    const validatedData = closingCountCreateSchema.parse(req.body);
    const closingCount = await ClosingCount.findByPk(req.params.closing_id);
    
    if (!closingCount) {
      return res.status(404).json({ error: 'Closing count not found' });
    }

    await closingCount.update(validatedData);
    res.json(closingCount);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Eliminar un conteo de cierre
router.delete('/:closing_id', async (req: Request, res: Response) => {
  try {
    const closingCount = await ClosingCount.findByPk(req.params.closing_id);
    
    if (!closingCount) {
      return res.status(404).json({ error: 'Closing count not found' });
    }

    await closingCount.destroy();
    res.json({ message: 'Closing count deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

