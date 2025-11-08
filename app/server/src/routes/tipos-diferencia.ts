import { Router, Request, Response } from 'express';
import { TipoDiferencia } from '../models/TipoDiferencia';
import { tipoDiferenciaCreateSchema } from '../schemas/tipo-diferencia';

const router = Router();

// Crear tipo de diferencia
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = tipoDiferenciaCreateSchema.parse(req.body);
    const tipo = await TipoDiferencia.create(validatedData);
    return res.status(201).json(tipo);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Listar tipos de diferencia
router.get('/', async (_req: Request, res: Response) => {
  try {
    const tipos = await TipoDiferencia.findAll({ order: [['nombreTipo', 'ASC']] });
    return res.json(tipos);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Obtener tipo por ID
router.get('/:idTipoDiferencia', async (req: Request, res: Response) => {
  try {
    const tipo = await TipoDiferencia.findByPk(req.params.idTipoDiferencia);

    if (!tipo) {
      return res.status(404).json({ error: 'Tipo de diferencia no encontrado' });
    }

    return res.json(tipo);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Actualizar tipo de diferencia
router.put('/:idTipoDiferencia', async (req: Request, res: Response) => {
  try {
    const validatedData = tipoDiferenciaCreateSchema.parse(req.body);
    const tipo = await TipoDiferencia.findByPk(req.params.idTipoDiferencia);

    if (!tipo) {
      return res.status(404).json({ error: 'Tipo de diferencia no encontrado' });
    }

    await tipo.update(validatedData);
    return res.json(tipo);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Eliminar tipo de diferencia
router.delete('/:idTipoDiferencia', async (req: Request, res: Response) => {
  try {
    const tipo = await TipoDiferencia.findByPk(req.params.idTipoDiferencia);

    if (!tipo) {
      return res.status(404).json({ error: 'Tipo de diferencia no encontrado' });
    }

    await tipo.destroy();
    return res.json({ mensaje: 'Tipo de diferencia eliminado correctamente' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;


