export type PendantFinish = "silver" | "gold";
export function parsePendantFinish(value: unknown): PendantFinish | null {
  return value === "silver" || value === "gold" ? value : null;
}
export function pendantFinishLabel(value: unknown): string {
  const finish = parsePendantFinish(value);
  return finish === "silver"
    ? "Titanium silver"
    : finish === "gold"
      ? "Gold"
      : "Not specified";
}
