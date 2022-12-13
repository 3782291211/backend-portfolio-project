exports.invalidPath = (req, res) => 
  res.status(404).send({msg: "Path not found."});

exports.handlePSQLerrors = (err, req, res,next) => {
  if (err.code === '22P02' || err.code === '23502' || err.code === '23503' ) {
    res.status(400).send({msg: "Bad request."}) 
  } else {
    next(err);
  };
};

exports.handleCustomErrors = (err, req, res, next) =>
  err.status && err.msg ? res.status(err.status).send({msg: err.msg}) : next(err);

exports.handle500errors = (err, req, res, next) =>
  res.status(500).send("Server error.");