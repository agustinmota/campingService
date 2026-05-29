function assignDefined(model, values) {
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined) {
      model[key] = value;
    }
  });

  return model;
}

module.exports = {
  assignDefined
};
