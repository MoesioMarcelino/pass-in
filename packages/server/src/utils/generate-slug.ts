export function generateSlug(text: string) {
  return text
    .normalize("NFD")
    .replace(/\u300-\u036f/g, "")
    .toLocaleLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}
