// Filter

export function typedBooleanFilterPredicate<T>(
  value: T,
): value is Exclude<T, "" | 0 | false | null | undefined> {
  return Boolean(value);
}

export function formDataStringOnlyEntriesFilterPredicate<
  T extends FormDataEntryValue,
>(entry: [string, T]): entry is [string, Exclude<T, File>] {
  return typeof entry[1] === "string";
}

export function uniqueFilterPredicate<T>(
  item: T,
  index: number,
  array: T[],
): boolean {
  const itemIndexInArray = array.findIndex((_item) => Object.is(_item, item));

  return index === itemIndexInArray;
}

uniqueFilterPredicate.withMatcher = function uniqueFilterPredicateWithMatcher<
  T,
>(matcher: (a: T, b: T) => boolean) {
  return (item: T, index: number, array: T[]): boolean => {
    const itemIndexInArray = array.findIndex((_item) => matcher(_item, item));

    return index === itemIndexInArray;
  };
};

// Sort

export function dateSortPredicate(
  a?: Date | string | number,
  b?: Date | string | number,
): number {
  const defaultDateValue: number = new Date().valueOf();
  const aDateValue: number = a ? Number(a.valueOf()) : defaultDateValue;
  const bDateValue: number = b ? Number(b.valueOf()) : defaultDateValue;

  if (aDateValue === bDateValue) {
    return 0;
  }

  return bDateValue > aDateValue ? 1 : -1;
}

dateSortPredicate.ascending = function dateAscSortPredicate(
  a?: Date | string | number,
  b?: Date | string | number,
): number {
  const descSort = dateSortPredicate(a, b);

  if (descSort === 0) return 0;

  return descSort * -1;
};
