'use server'

import prisma from "@/lib/prisma"
import { requireSession } from "@/lib/require-session";

export const getColors = async() => {
  try{
    await requireSession();
    
    const colors = prisma.color.findMany({ orderBy: {
      color: 'asc'
    }})

    return colors
  } catch (error) {
    console.error(error)
    return[]
  }
}
