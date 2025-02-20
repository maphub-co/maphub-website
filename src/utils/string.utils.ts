export const truncate_text = (text: string, max_length: number) => {
  if (text.length <= max_length) return text;
  return text.slice(0, max_length) + "...";
};
