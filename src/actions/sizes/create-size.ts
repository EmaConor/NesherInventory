"use server";

import { InputSize } from '@/interfaces'
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const createSize = async(size: InputSize) => {
  try {
    const sizeSaved = await prisma.size.create({
      data: size,
    });

    revalidatePath('/')

    return {
      ok: true,
      message: 'Talla creada exitosamente',
      size: sizeSaved
    }
  } catch (e) {
    console.error(e)
    return {
      ok: false,
      message: '"No se pudo grabar la talla',
    }
  }
}
