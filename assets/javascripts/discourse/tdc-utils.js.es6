export const solidarityFullName = 'Solidarity Bloc';
export const solidarityGroupName = 'solidarity-bloc';

export function hasDebt(collectives) {
  // true if the list of collectives contains a collective that is not solidarityFullName
  return collectives.filter(x => x != solidarityGroupName).length > 0;
}
