// Simple utility for className merging
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
