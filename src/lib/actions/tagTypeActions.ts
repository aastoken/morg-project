'use server';
import { DBTagType, TagType } from "../models";
import  prisma  from "../../../prisma/client";
import { mapDBTagType } from "../scripts";

//TagTypes----------------------------------------------------------

export async function createTagType(tagType: DBTagType): Promise<DBTagType> {
  const created = await prisma.tag_type.create({
    data: {
      name: tagType.name,
      color: tagType.color || "#ffffff",
      // nested-create all its tags in one shot
      tags: {
        create: tagType.tags.map(tag => ({
          name: tag.name,     
        })),
      },
    },
    include: {
      tags: {
        include: {
          type: true,    
        },
      },
    },
  })

  return mapDBTagType(created)
}

export async function createTagTypesFromTypeNames(typeNames: string[]){
  const parsedTagTypes = typeNames.map(typename => ({name: typename}));
  const newTagTypes = await prisma.tag_type.createMany({
    data:  parsedTagTypes,
    //skipDuplicates:true 
  })
  return newTagTypes;
}

export async function getallTagTypes(): Promise<TagType[]> {

  const raws = await prisma.tag_type.findMany({
    select: {
      id:    true,
      name:  true,
      color: true,
      tags: {
        select: {
          id:   true,
          name: true,
        },
        orderBy: { name: 'asc' },
      },
    },
  });


  return raws.map((tt) => ({
    id:    tt.id,
    name:  tt.name,
    color: tt.color,
    tags:  tt.tags.map((t) => ({
      id:       t.id,
      name:     t.name,
      color:    tt.color,   
      typeId:   tt.id,
      typeName: tt.name,
    })),
  }));
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
  const where = tagName
    ? {
        OR: [
          { tags: { some: { name: { contains: tagName } } } },
          { tags: { none: {} } },
        ],
      }
    : {}; // if no filter, get everything

  const tagTypes = await prisma.tag_type.findMany({
    where,
    select: {
      name: true,
      color: true,
      tags: {
        select: { name: true },
        orderBy: { name: "asc" },
      },
    },
  });
  const parsedTagTypes: TagType[] = tagTypes.map(tag_type => ({
    name: tag_type.name,
    color: tag_type.color, 
    tags: tag_type.tags.map(tag => ({name: tag.name, color: tag_type.color, typeName: tag_type.name}))}))

  return parsedTagTypes;
}

export async function getDBTagsFromTagTypesByName(tagName:string): Promise <DBTagType[]>{
  const where = tagName
    ? {
        OR: [
          { tags: { some: { name: { contains: tagName } } } },
          { tags: { none: {} } },
        ],
      }
    : {}

  const tagTypes = await prisma.tag_type.findMany({
    where,
    select: {
      id: true,
      name: true,
      color: true,
      tags: {
        select: {
          id: true,
          name: true,
          typeId: true,
        },
        orderBy: { name: "asc" },
      },
    },
  })

  return tagTypes.map((tt) => ({
    id:    tt.id,
    name:  tt.name,
    color: tt.color,
    tags:  
      tt.tags
        .filter((t) =>
          tagName ? t.name.toLowerCase().includes(tagName.toLowerCase()) : true
        )
        .map((t) => ({
          id:       t.id,
          name:     t.name,
          color:    tt.color,    
          typeId:   t.typeId,
          typeName: tt.name,
        })),
  }));
}

export async function getDBTagTypeById(id:number): Promise<DBTagType | null>{
  const tagType = await prisma.tag_type.findUnique({
    where: { id },
    include: { tags: { include: { type: true } } },
  });
  if (!tagType) return null;

  return mapDBTagType(tagType)
}


export async function updateTagType(tagType: DBTagType): Promise<DBTagType> {
  const existing = await prisma.tag.findMany({
    where: { typeId: tagType.id },
    select: { id: true },
  })
  const existingIds = new Set(existing.map((t) => t.id))

  const toCreate = tagType.tags
    .filter((t) => !existingIds.has(t.id))
    .map((t) => ({ name: t.name }))

  const toUpdate = tagType.tags
    .filter((t) => existingIds.has(t.id))
    .map((t) => ({
      where: { id: t.id },
      data:  { name: t.name },
    }))

  const toDeleteIds = existing
    .filter((e) => !tagType.tags.find((t) => t.id === e.id))
    .map((e) => e.id)

  const updated = await prisma.tag_type.update({
    where: { id: tagType.id },
    data: {
      name:  tagType.name,
      color: tagType.color || "#ffffff",
      tags: {
        deleteMany: toDeleteIds.map((id) => ({ id })),
        update:    toUpdate,
        create:    toCreate,
      },
    },
    include: {
  
      tags: { include: { type: true } }
    },
  })


  return mapDBTagType(updated)
}

export async function deleteTagType(id: number): Promise<DBTagType> {
  const existing = await prisma.tag_type.findUnique({
    where: { id },
    include: { tags: { include: { type: true } } },
  });
  if (!existing) {
    throw new Error(`TagType #${id} not found`);
  }
  
  const toReturn: DBTagType = mapDBTagType(existing);
  
  await prisma.tag.deleteMany({
    where: { typeId: id },
  });

  await prisma.tag_type.delete({
    where: { id },
  });

  return toReturn;
}

export async function deleteTagTypeByName(name: string): Promise<DBTagType> { 
  const tagType = await prisma.tag_type.findUnique({
    where: { name },
    include: { tags: true },
  });
  if (!tagType) {
    throw new Error(`TagType with name "${name}" not found`);
  }
 
  const toReturn: DBTagType = mapDBTagType(tagType);

  await prisma.tag.deleteMany({
    where: { typeId: tagType.id },
  });

  await prisma.tag_type.delete({
    where: { name },
  });

  return toReturn;
}
