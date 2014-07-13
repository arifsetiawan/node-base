
var fs = require('fs');

var formidable = require('formidable');

var config = require('./config.js');

function hasBody(req) {
  return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
};

function mime(req) {
  var str = req.headers['content-type'] || '';
  return str.split(';')[0];
};

exports.do = function(req, res, next) {

  if (req._body) return next();
  req.body = req.body || {};
  req.files = req.files || {};
  
  if (!hasBody(req)) return next();
  if ('GET' == req.method || 'HEAD' == req.method) return next();
  if ('multipart/form-data' != mime(req)) return next();

  req._body = true;

  var form = new formidable.IncomingForm({ keepExtensions: true, uploadDir: config.uploadDir });

  form.parse(req, function(err, fields, files) { 
    req.body = fields;
    req.files = files;
    next();
  });

  form
  .on('error', function(err) {
    console.error('Upload photo error', 
      { meta: { module: 'Multipart', url: req.url, err: err.message} });
    res.send({ 
      status: 'Error', 
      message: 'Upload failed ' + err.message 
    },500);
  })

  var end = res.end;
  res.end = function(chunk, encoding){
    res.end = end;
    res.end(chunk, encoding);
    
    /*
    // Optional. delete temp when done
    if (req.files) {
      if (req.files.file) {
          file = req.files.file;
          console.log(file.path);
          if (fs.existsSync(file.path))
            fs.unlinkSync(file.path);
      }
    }
    */
  };
}