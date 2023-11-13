import { transform } from 'typescript';

interface ParsedTransform {
  type: string;
  values: string[];
}

export const parseTransformAttribute = (
  transformAttribute: string
): ParsedTransform[] => {
  const transformFunctions: ParsedTransform[] = [];

  const regex = /(\w+)\(([^)]+)\)/g;
  let match;

  while ((match = regex.exec(transformAttribute)) !== null) {
    const [, type, valuesStr] = match;
    const values = valuesStr.split(',').map((val) => val.trim());

    transformFunctions.push({
      type,
      values,
    });
  }

  return transformFunctions;
};
