function badRequest(res, message) {
  return res.status(400).json({ message });
}

function notFound(res, resourceName) {
  return res.status(404).json({ message: `${resourceName} not found` });
}

function serverError(res, error) {
  return res.status(500).json({ message: error.message });
}

module.exports = {
  badRequest,
  notFound,
  serverError
};
