'use server'

import prisma from "@/lib/prisma"


export const getCollections = async() => {
  try{
    const collections = prisma.collection.findMany({ orderBy: {
      name: 'asc'
    }})

    return collections
  } catch (error) {
    console.log(error)
    return[]
  }
}
