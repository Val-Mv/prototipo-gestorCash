import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { DailyReport } from '../models/DailyReport';
import { dailyReportCreateSchema } from '../schemas/report';

const router = Router();

// Crear un nuevo reporte diario
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = dailyReportCreateSchema.parse(req.body);
    
    const report = await DailyReport.create({
      id: uuidv4(),
      ...validatedData,
      generated_at: new Date(),
    });

    res.status(201).json(report);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Obtener todos los reportes diarios
router.get('/', async (req: Request, res: Response) => {
  try {
    const { skip = 0, limit = 100, store_id, date_from, date_to } = req.query;
    
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

    const reports = await DailyReport.findAll({
      where,
      limit: Number(limit),
      offset: Number(skip),
      order: [['date', 'DESC']],
    });

    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un reporte por ID
router.get('/:report_id', async (req: Request, res: Response) => {
  try {
    const report = await DailyReport.findByPk(req.params.report_id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un reporte
router.put('/:report_id', async (req: Request, res: Response) => {
  try {
    const validatedData = dailyReportCreateSchema.parse(req.body);
    const report = await DailyReport.findByPk(req.params.report_id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    await report.update(validatedData);
    res.json(report);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Eliminar un reporte
router.delete('/:report_id', async (req: Request, res: Response) => {
  try {
    const report = await DailyReport.findByPk(req.params.report_id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    await report.destroy();
    res.json({ message: 'Report deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

