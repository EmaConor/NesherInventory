'use server'

import prisma from "@/lib/prisma"


export const getColors = async() => {
  try{
    const colors = prisma.color.findMany({ orderBy: {
      color: 'asc'
    }})

    return colors
  } catch (error) {
    console.log(error)
    return[]
  }
}
