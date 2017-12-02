// Gives us the percentage of the range(min, max) val is in
export const normalize = (val, min, max) =>
  (val - min) / (val - max)

export const lerp = (norm, min, max) =>
  (max - min) * norm + min
