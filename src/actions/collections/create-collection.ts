"use server";

import { InputCollection } from '@/interfaces'
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const createCollection = async(collection: InputCollection) => {
  try {
    const collectionSaved = await prisma.collection.create({
      data: collection,
    });

    revalidatePath('/')

    return {
      ok: true,
      message: 'Categoría creada exitosamente',
      collection: collectionSaved
    }
  } catch (e) {
    console.error(e)
    return {
      ok: false,
      message: '"No se pudo grabar la categoría',
    }
  }
}
