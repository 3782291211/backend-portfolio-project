exports.invalidPath = (req, res) => 
  res.status(404).send({msg: "Path not found."});

exports.handlePSQLerrors = (err, req, res, next) =>
  err.code === '22P02' ? res.status(400).send({msg: "Bad request."}) : next(err);

exports.handleCustomErrors = (err, req, res, next) =>
  err.status && err.msg ? res.status(err.status).send({msg: err.msg}) : next(err);

exports.handle500errors = (err, req, res, next) =>
  res.status(500).send("Server error.");