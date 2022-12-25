export function typedBooleanFilterPredicate<T>(
	value: T,
): value is Exclude<T, "" | 0 | false | null | undefined> {
	return Boolean(value);
}

export function dateSortPredicate(
	a?: Date | string | number,
	b?: Date | string | number,
	invert: boolean = false,
) {
	const order =
		(b?.toString() || new Date().toISOString()) >
		(a?.toString() || new Date().toISOString());

	if (invert) return order ? -1 : 1;

	return order ? 1 : -1;
}
