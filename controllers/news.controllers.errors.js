exports.invalidPath = (req, res) => 
  res.status(404).send({msg: "Path not found."});

exports.handlePSQLerrors = (err, req, res,next) =>
    err.code === '22P02' ? res.status(400).send({msg: 'Request contains invalid data type.'})
  : err.code === '23502' ? res.status(400).send({msg: "Bad request."})
  : next(err);

exports.handleForeignKeyError = (err, req, res,next) => {
  if (err.code === '23503') {
    if(err.detail.includes('article')) {
       res.status(404).send({msg: 'Article not found.'});
    } else if (err.detail.includes('author')) {
      res.status(404).send({msg: 'User not found.'});
    } else {
      res.status(404).send({msg: 'Resource not found.'});
    }
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) =>
  err.status && err.msg ? res.status(err.status).send({msg: err.msg}) : next(err);

exports.handle500errors = (err, req, res, next) =>
  res.status(500).send("Server error.");