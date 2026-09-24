"use server";

import { InputColor } from '@/interfaces'
import prisma from '@/lib/prisma';
import { requireSession } from '@/lib/require-session';
import { revalidatePath } from 'next/cache';

export const createColor = async(color: InputColor) => {
  try {
    await requireSession();
    
    const colorSaved = await prisma.color.create({
      data: color,
    });

    revalidatePath('/')

    return {
      ok: true,
      message: 'Color creado exitosamente',
      color: colorSaved
    }
  } catch (e) {
     if (e instanceof Error && e.message === 'UNAUTHORIZED') {
      return { ok: false, message: 'No autorizado' };
    }
    console.error(e)
    return {
      ok: false,
      message: '"No se pudo grabar el Color',
    }
  }
}
