export function formatGhs(amount: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function sizeLabel(sizeMl: number | null): string {
  if (sizeMl === null) {
    return "One size";
  }
  return `${sizeMl}ml`;
}
