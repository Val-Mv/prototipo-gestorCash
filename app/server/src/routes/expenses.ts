import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { Expense } from '../models/Expense';
import { expenseCreateSchema } from '../schemas/expense';

const router = Router();

// Crear un nuevo gasto
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = expenseCreateSchema.parse(req.body);
    
    const expense = await Expense.create({
      id: uuidv4(),
      ...validatedData,
      date: validatedData.date || new Date().toISOString().split('T')[0],
      created_at: new Date(),
    });

    res.status(201).json(expense);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Obtener todos los gastos
router.get('/', async (req: Request, res: Response) => {
  try {
    const { skip = 0, limit = 100, store_id, category, date } = req.query;
    
    const where: any = {};
    if (store_id) where.store_id = store_id;
    if (category) where.category = category;
    if (date) where.date = date;

    const expenses = await Expense.findAll({
      where,
      limit: Number(limit),
      offset: Number(skip),
      order: [['created_at', 'DESC']],
    });

    res.json(expenses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un gasto por ID
router.get('/:expense_id', async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findByPk(req.params.expense_id);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(expense);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un gasto
router.put('/:expense_id', async (req: Request, res: Response) => {
  try {
    const validatedData = expenseCreateSchema.parse(req.body);
    const expense = await Expense.findByPk(req.params.expense_id);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await expense.update(validatedData);
    res.json(expense);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Eliminar un gasto
router.delete('/:expense_id', async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findByPk(req.params.expense_id);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await expense.destroy();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener estadísticas de gastos por categoría
router.get('/stats/by-category', async (req: Request, res: Response) => {
  try {
    const { store_id, date_from, date_to } = req.query;
    
    const where: any = {};
    if (store_id) where.store_id = store_id;
    if (date_from && date_to) {
      where.date = {
        [Op.between]: [date_from, date_to],
      };
    } else if (date_from) {
      where.date = {
        [Op.gte]: date_from,
      };
    } else if (date_to) {
      where.date = {
        [Op.lte]: date_to,
      };
    }

    const expenses = await Expense.findAll({ where });
    
    const stats: Record<string, { count: number; total: number }> = {};
    expenses.forEach((expense) => {
      const category = expense.category;
      if (!stats[category]) {
        stats[category] = { count: 0, total: 0 };
      }
      stats[category].count += 1;
      stats[category].total += expense.amount;
    });

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

