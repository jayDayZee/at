var express = require('express');
var router = express.Router();
var atRoot = require("../atSrc/at.js")
/* GET home page. */
router.get('/', function(req, res, next) {
  debugger;

  res.render('index', { title: 'thePlan', message: 'Hello there!' })
});

router.post('*', function(req, res, next) {
  debugger;

  // req.atRoot.connectedAtStore
  //   .find({"id":"twilioPostToEmail", })
  //   .then
  //   ( (docs) =>
  //     { console.log(docs);
  //     }      
  //   )
var namespace = atRoot.namespace;



  var traveller = {};
  req.atRoot.namespace(traveller, "traveller").twilio = JSON.parse(JSON.stringify(req.body));
  console.log("post req body", req.body);
  req.atRoot.namespace(traveller, "traveller.express").req = req;
  traveller.traveller.suggestedExit = "thePlanIssueTracker__0_1_20";
  req.atRoot.traverse(traveller, {});

});

module.exports = router;
