export const repr = (val: unknown) => {
  try {
    return JSON.stringify(val) ?? String(val);
  } catch {
    return String(val);
  }
};

export const dd = (val: unknown) => {
  console.log(repr(val));

  process.exit(0);
};
