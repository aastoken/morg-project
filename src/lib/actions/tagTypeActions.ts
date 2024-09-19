'use server';
import { DBTagType, TagType } from "../models";
import  prisma  from "../../../prisma/client";
import { mapDBTagType } from "../scripts";

//TagTypes----------------------------------------------------------
export async function createTagType(tagType: DBTagType): Promise<DBTagType> {
  // First, create the tag_type itself
  const createdTagType = await prisma.tag_type.create({
    data: {
      name: tagType.name,
      color: tagType.color || '#ffffff',
    },
    include: { tags: true }, // Ensure tags are included in the created tag_type
  });

  // Now, create the tags associated with this tag_type
  const createdTags = await Promise.all(
    tagType.tags.map(tag =>
      prisma.tag.create({
        data: {
          name: tag.name,
          color: tag.color || '#ffffff',
          typeId: createdTagType.id, // Associate the tag with the created tag_type
        },
      })
    )
  );

  // Combine the created tags with the created tag_type
  const createdTagTypeWithTags = {
    ...createdTagType,
    tags: createdTags, // Attach createdTags here
  };

  // Map the createdTagTypeWithTags object using mapDBTagType and return it
  return mapDBTagType(createdTagTypeWithTags);
}

export async function createTagTypesFromTypeNames(typeNames: string[]){
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
          id: true,
          type: true
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
  // const parsedTagTypes: DBTagType[] = tagTypes.map(tag_type => ({
  //   id: tag_type.id,
  //   name: tag_type.name,
  //   color: tag_type.color, 
  //   tags: tag_type.tags.map(tag => ({id: tag.id, name: tag.name, color: tag_type.color, typeName: tag_type.name, typeId: tag_type.id}))}))

  return tagTypes.map(mapDBTagType);
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
  // First, update the tag_type itself (name and color)
  const updatedTagType = await prisma.tag_type.update({
    where: { id: tagType.id },
    data: {
      name: tagType.name,
      color: tagType.color || '#ffffff',
    },
    include: { tags: true }, // Ensure tags are included in the updated tag_type
  });

  // Fetch the existing tags for the tag_type
  const existingTags = await prisma.tag.findMany({
    where: { typeId: tagType.id },
  });

  // Find which tags to create, update, and delete
  const newTags = tagType.tags.filter(tag => !tag.id); // Tags without an id need to be created
  const updatedTags = tagType.tags.filter(tag => tag.id); // Tags with an id need to be updated
  const tagsToDelete = existingTags.filter(
    existingTag => !tagType.tags.find(tag => tag.id === existingTag.id)
  ); // Tags that exist but are not in the new tagType.tags should be deleted

  // Create new tags
  const createdTags = await Promise.all(
    newTags.map(tag =>
      prisma.tag.create({
        data: {
          name: tag.name,
          color: tag.color || '#ffffff',
          typeId: tagType.id, // Ensure the new tags are associated with the tag_type
        },
      })
    )
  );

  // Update existing tags
  const updatedTagsPromises = updatedTags.map(tag =>
    prisma.tag.update({
      where: { id: tag.id },
      data: {
        name: tag.name,
        color: tag.color || '#ffffff',
        typeId: tagType.id, // Ensure typeId remains correct
      },
    })
  );
  const updatedTagsResult = await Promise.all(updatedTagsPromises);

  // Delete removed tags
  await prisma.tag.deleteMany({
    where: { id: { in: tagsToDelete.map(tag => tag.id) } },
  });

  // Combine the updated tags and newly created tags
  const finalTags = [...updatedTagsResult, ...createdTags];

  // Include finalTags in the updatedTagType object
  const updatedTagTypeWithTags = {
    ...updatedTagType,
    tags: finalTags, // Attach finalTags here
  };

  // Map the updatedTagTypeWithTags object using mapDBTagType and return it
  return mapDBTagType(updatedTagTypeWithTags);
}

export async function deleteTagType(id:number): Promise <DBTagType>{
  const deletedTagType = await prisma.tag_type.delete({
    where:{id},
    include:{
      tags:{
        include:{
          type:true
        }
      }
    }
  })

  return mapDBTagType(deletedTagType); 
}
