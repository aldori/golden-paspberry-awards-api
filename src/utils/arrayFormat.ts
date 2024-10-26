export const getArrayItems = (items: string): string[] => {
  const arrayItems: string[] = [];
  const splitedString = items.split(/,\s*|\s+and\s+/).map((item) => item.trim());

  for (const studio of splitedString) {
    arrayItems.push(studio.replace(/\s*and\s*/g, "").trim());
  }
  return arrayItems;
};
