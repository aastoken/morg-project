import { TagType } from "lib/models";
import { prisma } from "../../../../prisma/client";

//TagTypes----------------------------------------------------------
export async function createTagType(tagType: TagType){
  const newTagType = await prisma.tag_type.create({data: {name: tagType.name}})
}

export async function createTagTypes(tagTypes: TagType[]){
  
}

export async function getallTagTypes(): Promise <TagType[]>{
  const tagTypes = await prisma.tag_type.findMany({  
    relationLoadStrategy: 'join',    
    select:{
      name: true,
      tags:  {
        select: {
          name: true,
        },
    },
  }
  });
  const parsedTagTypes: TagType[] = tagTypes.map(tag_type => ({
    name: tag_type.name, 
    tags: tag_type.tags.map(tag => tag.name)}))

  return parsedTagTypes;
}

export async function getAllTagTypeNames(): Promise <TagType[]>{
  const tagTypes = await prisma.tag_type.findMany({
    select:{
      name:true,
    }
  });
  return tagTypes.map(tag_type => ({
    name: tag_type.name, 
    tags: []}))
}

