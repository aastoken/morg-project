'use server';
import prisma  from "../../../prisma/client";
import { FilterRow } from "../models";
import { mapFilterRow } from "../scripts";

export async function createFilterRow(
  advancedFilterId: number,
  selectedKey: string,
  selectedComparator: string,
  selectedTags: { id: number }[],
  selectedGenres: { id: number }[],
  inputValue?: string,
  inputValueMin?: string,
  inputValueMax?: string
): Promise<FilterRow> {
  const newFilterRow = await prisma.filter_row.create({
    data: {
      selectedKey,
      selectedComparator,
      inputValue,
      inputValueMin,
      inputValueMax,
      advancedFilterId,
      selectedTags: {
        connect: selectedTags
      },
      selectedGenres: {
        connect: selectedGenres
      }
    },
    include: {
      selectedTags: {
        include: {
          type: true,
        },
      },
      selectedGenres: true,
    },
  });

  return mapFilterRow(newFilterRow);
}

export async function getFilterRow(id: number): Promise<FilterRow> {
  const filterRow = await prisma.filter_row.findUnique({
    where: { id },
    include: {
      selectedTags: {
        include: {
          type: true,
        },
      },
      selectedGenres: true,
    },
  });

  if (!filterRow) {
    throw new Error(`Filter row with id ${id} not found`);
  }

  return mapFilterRow(filterRow);
}

export async function updateFilterRow(
  id: number,
  selectedKey: string,
  selectedComparator: string,
  selectedTags: { id: number }[],
  selectedGenres: { id: number }[],
  inputValue?: string,
  inputValueMin?: string,
  inputValueMax?: string
): Promise<FilterRow> {
  const updatedFilterRow = await prisma.filter_row.update({
    where: { id },
    data: {
      selectedKey,
      selectedComparator,
      inputValue,
      inputValueMin,
      inputValueMax,
      selectedTags: {
        set: selectedTags
      },
      selectedGenres: {
        set: selectedGenres
      }
    },
    include: {
      selectedTags: {
        include: {
          type: true,
        },
      },
      selectedGenres: true,
    },
  });

  return mapFilterRow(updatedFilterRow);
}

export async function deleteFilterRow(id: number): Promise<FilterRow> {
  const deletedFilterRow = await prisma.filter_row.delete({
    where: { id },
    include: {
      selectedTags: {
        include: {
          type: true,
        },
      },
      selectedGenres: true,
    },
  });

  return mapFilterRow(deletedFilterRow);
}