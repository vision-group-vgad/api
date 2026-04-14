const buildVGADUrl = (path, params = {}) => {
  const url = new URL(path, process.env.VGAD_API_URL);

  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  return url.toString();
};

export default buildVGADUrl