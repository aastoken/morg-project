'use server';
import { DBTagType, TagType } from "../models";
import  prisma  from "../../../prisma/client";

//TagTypes----------------------------------------------------------
export async function createTagType(tagType: TagType){
  const newTagType = await prisma.tag_type.create({data: {name: tagType.name}})
  return newTagType;
}

export async function createTagTypes(typeNames: string[]){
  const parsedTagTypes = typeNames.map(typename => ({name: typename}));
  const newTagTypes = await prisma.tag_type.createMany({
    data:  parsedTagTypes,
    //skipDuplicates:true 
  })
  return newTagTypes;
}

export async function getallTagTypes(): Promise <TagType[]>{
  const tagTypes = await prisma.tag_type.findMany({  
    //relationLoadStrategy: 'join',    
    select:{
      name: true,
      color: true,
      tags:  {
        select: {
          name: true
        },
    },
  }
  });
  const parsedTagTypes: TagType[] = tagTypes.map(tag_type => ({
    name: tag_type.name,
    color: tag_type.color, 
    tags: tag_type.tags.map(tag => ({name: tag.name, color: tag_type.color}))}))

  return parsedTagTypes;
}

export async function getAllTagTypeNames(): Promise <string[]>{
  const tagTypes = await prisma.tag_type.findMany({
    select:{
      name:true,
    }
  });
  return tagTypes.map(tag_type => (tag_type.name))
}

export async function getTagsFromTagTypesByName(tagName:string): Promise <TagType[]>{
  const tagTypes = await prisma.tag_type.findMany({  
    //relationLoadStrategy: 'join',    
    select: {
      name: true,
      color: true,
      tags: {
        select: {
          name: true
        },
        where: {
          name: {
            contains: tagName
          }
        },
        orderBy: {
          name: 'asc'
        }
      }
    },
    where: {
      tags: {
        some: {
          name: {
            contains: tagName
          }
        }
      }
    }
  });
  const parsedTagTypes: TagType[] = tagTypes.map(tag_type => ({
    name: tag_type.name,
    color: tag_type.color, 
    tags: tag_type.tags.map(tag => ({name: tag.name, color: tag_type.color, typeName: tag_type.name}))}))

  return parsedTagTypes;
}

export async function getDBTagsFromTagTypesByName(tagName:string): Promise <DBTagType[]>{
  const tagTypes = await prisma.tag_type.findMany({  
    //relationLoadStrategy: 'join',    
    select: {
      id: true,
      name: true,
      color: true,
      tags: {
        select: {
          name: true,
          id: true
        },
        where: {
          name: {
            contains: tagName
          }
        },
        orderBy: {
          name: 'asc'
        }
      }
    },
    where: {
      tags: {
        some: {
          name: {
            contains: tagName
          }
        }
      }
    }
  });
  const parsedTagTypes: DBTagType[] = tagTypes.map(tag_type => ({
    id: tag_type.id,
    name: tag_type.name,
    color: tag_type.color, 
    tags: tag_type.tags.map(tag => ({id: tag.id, name: tag.name, color: tag_type.color, typeName: tag_type.name, typeId: tag_type.id}))}))

  return parsedTagTypes;
}

