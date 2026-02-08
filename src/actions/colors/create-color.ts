"use server";

import { InputColor } from '@/interfaces'
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const createColor = async(color: InputColor) => {
  try {
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
    console.error(e)
    return {
      ok: false,
      message: '"No se pudo grabar el Color',
    }
  }
}
