import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import { VentaDiaria } from '../models/VentaDiaria';
import { ventaDiariaCreateSchema } from '../schemas/venta-diaria';

const router = Router();

const parseFecha = (fecha?: string | Date) => {
  if (!fecha) return new Date();
  if (fecha instanceof Date) return fecha;
  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Fecha inválida');
  }
  return parsed;
};

// Crear una nueva venta diaria
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = ventaDiariaCreateSchema.parse(req.body);
    const { fecha, ...rest } = validatedData;

    const venta = await VentaDiaria.create({
      ...rest,
      fecha: parseFecha(fecha),
    });

    res.status(201).json(venta);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    } else if (error.message === 'Fecha inválida') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Obtener todas las ventas diarias
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      skip = '0',
      limit = '100',
      idCaja,
      idUsuario,
      fechaDesde,
      fechaHasta,
    } = req.query;

    const where: any = {};
    if (idCaja) where.idCaja = Number(idCaja);
    if (idUsuario) where.idUsuario = Number(idUsuario);

    if (fechaDesde && fechaHasta) {
      where.fecha = {
        [Op.between]: [new Date(String(fechaDesde)), new Date(String(fechaHasta))],
      };
    } else if (fechaDesde) {
      where.fecha = {
        [Op.gte]: new Date(String(fechaDesde)),
      };
    } else if (fechaHasta) {
      where.fecha = {
        [Op.lte]: new Date(String(fechaHasta)),
      };
    }

    const ventas = await VentaDiaria.findAll({
      where,
      limit: Number(limit),
      offset: Number(skip),
      order: [['fecha', 'DESC']],
    });

    res.json(ventas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una venta diaria por ID
router.get('/:idVenta', async (req: Request, res: Response) => {
  try {
    const venta = await VentaDiaria.findByPk(req.params.idVenta);

    if (!venta) {
      return res.status(404).json({ error: 'Venta diaria no encontrada' });
    }

    res.json(venta);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una venta diaria
router.put('/:idVenta', async (req: Request, res: Response) => {
  try {
    const validatedData = ventaDiariaCreateSchema.parse(req.body);
    const venta = await VentaDiaria.findByPk(req.params.idVenta);

    if (!venta) {
      return res.status(404).json({ error: 'Venta diaria no encontrada' });
    }

    const { fecha, ...rest } = validatedData;
    await venta.update({
      ...rest,
      fecha: parseFecha(fecha),
    });

    res.json(venta);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    } else if (error.message === 'Fecha inválida') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Eliminar una venta diaria
router.delete('/:idVenta', async (req: Request, res: Response) => {
  try {
    const venta = await VentaDiaria.findByPk(req.params.idVenta);

    if (!venta) {
      return res.status(404).json({ error: 'Venta diaria no encontrada' });
    }

    await venta.destroy();
    res.json({ mensaje: 'Venta diaria eliminada correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


