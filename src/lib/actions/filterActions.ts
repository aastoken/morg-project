'use server';
import prisma  from "../../../prisma/client";
import { FilterData } from "../models";
import { mapAdvancedFilterData } from "../scripts/data_utils"


export async function createAdvancedFilterData(
  allConditions: boolean,
  filterRows: {
    selectedKey: string,
    selectedComparator: string,
    selectedTags: { id: number }[],
    selectedGenres: { id: number }[],
    inputValue?: string,
    inputValueMin?: string,
    inputValueMax?: string
  }[]
): Promise<FilterData> {
  const newFilterData = await prisma.advanced_filter_data.create({
    data: {
      allConditions,
      filterRows: {
        create: filterRows.map(row => ({
          selectedKey: row.selectedKey,
          selectedComparator: row.selectedComparator,
          inputValue: row.inputValue,
          inputValueMin: row.inputValueMin,
          inputValueMax: row.inputValueMax,
          selectedTags: {
            connect: row.selectedTags
          },
          selectedGenres: {
            connect: row.selectedGenres
          }
        }))
      }
    },
    include: {
      filterRows: {
        include: {
          selectedTags: {
            include: {
              type: true,
            },
          },
          selectedGenres: true,
        },
      },
    },
  });

  return mapAdvancedFilterData(newFilterData);
}

export async function getAdvancedFilterData(id: number): Promise<FilterData> {
  const filterData = await prisma.advanced_filter_data.findUnique({
    where: { id },
    include: {
      filterRows: {
        include: {
          selectedTags: {
            include: {
              type: true,
            },
          },
          selectedGenres: true,
        },
      },
    },
  });

  if (!filterData) {
    throw new Error(`Filter data with id ${id} not found`);
  }

  return mapAdvancedFilterData(filterData);
}

export async function updateAdvancedFilterData(
  id: number,
  allConditions: boolean,
  filterRows: {
    id?: number,
    selectedKey: string,
    selectedComparator: string,
    selectedTags: { id: number }[],
    selectedGenres: { id: number }[],
    inputValue?: string,
    inputValueMin?: string,
    inputValueMax?: string
  }[]
): Promise<FilterData> {
  const updatedFilterData = await prisma.advanced_filter_data.update({
    where: { id },
    data: {
      allConditions,
      filterRows: {
        upsert: filterRows.map(row => ({
          where: { id: row.id ?? 0 },
          create: {
            selectedKey: row.selectedKey,
            selectedComparator: row.selectedComparator,
            inputValue: row.inputValue,
            inputValueMin: row.inputValueMin,
            inputValueMax: row.inputValueMax,
            selectedTags: {
              connect: row.selectedTags
            },
            selectedGenres: {
              connect: row.selectedGenres
            }
          },
          update: {
            selectedKey: row.selectedKey,
            selectedComparator: row.selectedComparator,
            inputValue: row.inputValue,
            inputValueMin: row.inputValueMin,
            inputValueMax: row.inputValueMax,
            selectedTags: {
              set: row.selectedTags
            },
            selectedGenres: {
              set: row.selectedGenres
            }
          }
        }))
      }
    },
    include: {
      filterRows: {
        include: {
          selectedTags: {
            include: {
              type: true,
            },
          },
          selectedGenres: true,
        },
      },
    },
  });

  return mapAdvancedFilterData(updatedFilterData);
}

export async function deleteAdvancedFilterData(id: number): Promise<FilterData> {
  const deletedFilterData = await prisma.advanced_filter_data.delete({
    where: { id },
    include: {
      filterRows: {
        include: {
          selectedTags: {
            include: {
              type: true,
            },
          },
          selectedGenres: true,
        },
      },
    },
  });

  return mapAdvancedFilterData(deletedFilterData);
}