var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req, res);

  var nodeID = req.query.nodeID;
  var node = req.atStore.findOne({"id":nodeID});

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(node, null, 3));
});

module.exports = router;
