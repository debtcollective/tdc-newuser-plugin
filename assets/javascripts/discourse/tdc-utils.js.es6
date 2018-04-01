export const solidarity = "Solidarity Bloc";

export function hasDebt(collectives) {
  // true if the list of collectives contains a collective that is not solidarity
  return collectives.filter(x => x != solidarity).length > 0
}