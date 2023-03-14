// rome-ignore lint/suspicious/noExplicitAny: unknown cause object-key lookup to break;
export default function isEqual(first: any, second: any): boolean {
  if (first === second) {
    return true;
  }

  if (
    (first === undefined ||
      second === undefined ||
      first === null ||
      second === null) &&
    (first || second)
  ) {
    return false;
  }

  const firstType = first?.constructor.name;
  const secondType = second?.constructor.name;

  if (firstType !== secondType) {
    return false;
  }

  if (firstType === "Array") {
    return isArrayEqual(first, second);
  }

  if (firstType === "Object" && first && second) {
    return isObjectEqual(first, second);
  }

  // scalers
  return first === second;
}

function isArrayEqual(first: unknown[], second: unknown[]): boolean {
  if (Array.isArray(first) && Array.isArray(second)) {
    if (first.length !== second.length) {
      return false;
    }

    let equal = true;
    for (let i = 0; i < first.length; i++) {
      if (!isEqual(first[i], second[i])) {
        equal = false;
        break;
      }
    }

    return equal;
  }

  return false;
}

function isObjectEqual<O extends Record<string, unknown>>(
  first: O,
  second: O,
): boolean {
  if (typeof first === "object" && typeof second === "object") {
    let equal = true;
    const fKeys = Object.keys(first);
    const sKeys = Object.keys(second);

    if (fKeys.length !== sKeys.length) {
      return false;
    }

    for (let i = 0; i < fKeys.length; i++) {
      const key = fKeys[i];

      if (key in first && key in second) {
        if (first[key] === second[key]) {
          continue;
        }
        if (
          first[key] &&
          (Array.isArray(first[key]) || typeof first[key] === "object")
        ) {
          equal = isEqual(first[key], second[key]);
          if (!equal) {
            break;
          }
        } else if (first[key] !== second[key]) {
          equal = false;
          break;
        }
      } else if ((first[key] && !second[key]) || (!first[key] && second[key])) {
        equal = false;
        break;
      }
    }
    return equal;
  }

  return false;
}
