var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  debugger;

  console.log(req, res);

  var nodeID = req.query.nodeID;
  var node = req.atStore.findOne({"id":nodeID});

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(node, null, 3));
});

router.post('/', function(req, res, next) {
  debugger;

  // req.atRoot.connectedAtStore
  //   .find({"id":"twilioPostToEmail", })
  //   .then
  //   ( (docs) =>
  //     { console.log(docs);
  //     }      
  //   )


  var traveller = {};
  req.atRoot.namespace(traveller, "traveller").twilio = req.body;
  req.atRoot.namespace(traveller, "traveller.express").req = req;
  traveller.traveller.suggestedExit = "twilioPostToEmail";
  req.atRoot.traverse(traveller, {});

});

module.exports = router;
