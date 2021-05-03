export const sanitizeUrl = (value: string): string => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\W_]/g, "-")
    .toLowerCase();
};
