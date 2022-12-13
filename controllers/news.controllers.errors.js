exports.invalidPath = (req, res) => 
  res.status(404).send({msg: "Path not found."});

exports.handlePSQLerrors = (err, req, res,next) =>
    err.code === '22P02' ? res.status(400).send({msg: 'Invalid data type in URL.'})
  : err.code === '23502' ? res.status(400).send({msg: "Bad request."})
  : next(err);

exports.handleForeignKeyError = (err, req, res,next) => {
  err.code === '23503' ? 
    err.detail.includes('article') ? res.status(404).send({msg: "Article not found."})
    : err.detail.includes('author') ? res.status(404).send({msg: "Username not found."})
    : res.status(404).send({msg: "Resource not found."})
  : next(err);
};

exports.handleCustomErrors = (err, req, res, next) =>
  err.status && err.msg ? res.status(err.status).send({msg: err.msg}) : next(err);

exports.handle500errors = (err, req, res, next) =>
  res.status(500).send("Server error.");