'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {v2 as cloudinary} from 'cloudinary';
import { Product } from '@/interfaces';
cloudinary.config( process.env.CLOUDINARY_URL ?? '' );

export const createUpdateProduct = async( product: Product ) => {
  product.slug = product.slug.toLowerCase().replace(/ /g, '-' ).trim();

  const { id, ...rest } = product;

  try {
    const prismaTx = await prisma.$transaction( async (tx) => {
  
      let product: Product;
      const tagsArray = rest.tags.split(',').map( tag => tag.trim().toLowerCase() );
  
      if ( id ) {
        // Actualizar
        product = await prisma.product.update({
          where: { id },
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray
            }
          }
        });
  
      } else {
        // Crear
        product = await prisma.product.create({
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray
            }
          }
        })
      }
  
      
      // Proceso de carga y guardado de imagenes
      // Recorrer las imagenes y guardarlas
      if ( formData.getAll('images') ) {
        // [https://url.jpg, https://url.jpg]
        const images = await uploadImages(formData.getAll('images') as File[]);
        if ( !images ) {
          throw new Error('No se pudo cargar las imágenes, rollingback');
        }

        await prisma.productImage.createMany({
          data: images.map( image => ({
            url: image!,
            productId: product.id,
          }))
        });

      }
  
  
  
      
      return {
        product
      }
    });


    // Todo: RevalidatePaths
    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${ product.slug }`);
    revalidatePath(`/products/${ product.slug }`);


    return {
      ok: true,
      product: prismaTx.product,
    }

    
  } catch (error) {
    
    return {
      ok: false,
      message: 'Revisar los logs, no se pudo actualizar/crear'
    }
  }

}



const uploadImages = async( image: File ) => {

  try {

    const uploadPromises = images.map( async( image) => {

      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
  
        return cloudinary.uploader.upload(`data:image/png;base64,${ base64Image }`)
          .then( r => r.secure_url );
        
      } catch (error) {
        console.log(error);
        return null;
      }
    })


    const uploadedImages = await Promise.all( uploadPromises );
    return uploadedImages;


  } catch (error) {

    console.log(error);
    return null;
    
  }


}