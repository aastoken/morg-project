'use server';
import { DBTag, Tag, TagType } from "lib/models";
import  prisma  from "../../../../prisma/client";

//Tags--------------------------------------------------------------
export async function createTag(tag: Tag){
  const tagTypeId = await prisma.tag_type.findFirst({select:{
    id: true
  },
  where:{
    name: tag.typeName
  }
  })
  if (!tagTypeId) {
    throw new Error(`Tag type with name "${tag.typeName}" does not exist.`);
  }
  const newTag = await prisma.tag.create({
    data: { name: "TagName", typeId: tagTypeId.id }
  });
  return newTag;
}

export async function createTags(tags: Tag[], tagTypes?: TagType[]){
  let typeNames = ['']
  if(tagTypes==null || tagTypes == undefined){
    typeNames = tags.map(tag => tag.typeName)
    typeNames = [...new Set(typeNames)];
  }
  else{
    typeNames = tagTypes.map(tagType => tagType.name)
    typeNames = [...new Set(typeNames)];
  }

  const dbTagTypes = (await prisma.tag_type.findMany({select:{
    id: true,
    name: true
  },
  where:{
    name: {
      in: typeNames
    }
  }
  })).map((type)=>({id: type.id, name: type.name}))

  const dbTags = tags.map(tag => {
    let id = dbTagTypes.filter(type => type.name == tag.typeName).map(type => type.id)[0];
    return({
      name: tag.name,
      typeId: id
    });
  });

  const newTags = await prisma.tag.createMany({
    data: dbTags,
    skipDuplicates:true 
  })
  return newTags;
}

export async function getDBTags(tags: Tag[]): Promise <DBTag[]>{
  const tagNames = tags.map(tag => tag.name);
  const typeNames = tags.map(tag => tag.typeName);
  const dbTags = await prisma.tag.findMany({
    where:{
      AND:[
      {name:{
        in: tagNames
      }},
      {
        type:{
          name:{
            in:typeNames
          }
        }
      }
    ]
    },
    include:{
      type:true
    }
  });

  return dbTags.map(tag => ({
    id:tag.id,
    name:tag.name,
    typeId:tag.typeId,
    tagType:tag.type.name}
  ));
}

export async function getAllTags(): Promise <Tag[]>{
  const tags = await prisma.tag.findMany({
    relationLoadStrategy: 'join',
    select:{
      name: true,
      type: {
        select:{
          name: true,
        }
      }
    }
  });
  const allTags: Tag[] = tags.map((tag)=>({
    name: tag.name,
    typeName: tag.type.name
  }));
  return allTags;
}

export async function getAllTagNames(): Promise <string[]>{
  const tags = await getAllTags();
  const tagNames = tags.map(tag => tag.name);
  return tagNames;
}

export async function updateTags(tags: Tag[]){

}
