# Integración del Backend con Next.js

## Configuración

1. **Crear archivo de configuración de API** en Next.js:

```typescript
// src/lib/api-config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

2. **Agregar variable de entorno** en `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Ejemplo de Servicio para Expenses

```typescript
// src/lib/api/expenses.ts
import { API_BASE_URL } from '@/lib/api-config';
import type { Expense } from '@/lib/types';

export async function createExpense(expense: Omit<Expense, 'id' | 'createdAt'>) {
  const response = await fetch(`${API_BASE_URL}/api/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    throw new Error('Failed to create expense');
  }

  return response.json();
}

export async function getExpenses(params?: {
  store_id?: string;
  category?: string;
  date?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.store_id) queryParams.append('store_id', params.store_id);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.date) queryParams.append('date', params.date);

  const response = await fetch(
    `${API_BASE_URL}/api/expenses?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch expenses');
  }

  return response.json();
}

export async function updateExpense(id: string, expense: Partial<Expense>) {
  const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    throw new Error('Failed to update expense');
  }

  return response.json();
}

export async function deleteExpense(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete expense');
  }

  return response.json();
}
```

## Actualizar el componente AddExpenseForm

```typescript
// src/components/dashboard/add-expense-form.tsx
import { createExpense } from '@/lib/api/expenses';

// En la función onSubmit:
async function onSubmit(values: ExpenseFormData) {
  // ... validaciones existentes ...

  try {
    const newExpense = await createExpense({
      category: values.category,
      item: values.item,
      amount: values.amount,
      description: values.description,
      attachment_url: values.attachmentUrl || undefined,
      store_id: user?.storeId || 'berwyn-il',
      date: new Date().toISOString().split('T')[0],
      user_id: user?.uid,
    });

    if (onExpenseAdded) {
      onExpenseAdded(newExpense);
    }

    toast({
      title: 'Gasto Registrado',
      description: `Se ha registrado el gasto de ${values.item} por $${values.amount.toFixed(2)}.`,
    });

    form.reset();
    onOpenChange(false);
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'No se pudo registrar el gasto. Por favor intenta de nuevo.',
    });
  }
}
```

## Crear Server Actions (Recomendado para Next.js)

```typescript
// src/app/actions/expenses.ts
'use server';

import { API_BASE_URL } from '@/lib/api-config';

export async function createExpenseAction(expense: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });

    if (!response.ok) {
      throw new Error('Failed to create expense');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
}
```

## Scripts útiles

Agregar al `package.json`:

```json
{
  "scripts": {
    "dev:api": "cd backend && uvicorn app.main:app --reload --port 8000",
    "dev:all": "concurrently \"npm run dev\" \"npm run dev:api\""
  }
}
```

Instalar concurrently:
```bash
npm install --save-dev concurrently
```

