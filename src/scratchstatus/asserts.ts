import { Forum, Category, categories, forums } from './consts';

export function assertCategory(value: any): asserts value is Category {
  if (!categories.includes(value)) {
    throw new Error(`Invalid category: ${value}`);
  }
}

export function assertForum(value: any): asserts value is Forum {
  if (
    !Object.keys(forums).includes(
      value.toLowerCase ? value.toLowerCase() : value
    )
  ) {
    throw new Error(`Invalid forum: ${value}`);
  }
}

export function assertNumber(value: any): asserts value is number {
  if (typeof value !== 'number') {
    throw new Error(`Invalid number: ${value}`);
  }
}
