export const truncate = (input: string, maxLen: number) => {
  if (!input) return '';
  return input.length > maxLen
    ? `${input.substring(0, Math.max(0, maxLen - 3))}...`
    : input;
};
