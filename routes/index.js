var buildAtRouter = 
(atApplication) =>

{ var express = require('express');
  var router  = express.Router();
  var atRoot  = atApplication.atRoot;

  /* GET home page. */
  router
      .get
      ( '/', 
        function(req, res, next) 
        { debugger;
          res.render('index', { "publicJSON": atApplication.publicJSON } );
        }
      );
  /* GET home page. */
  router
      .get
      ( '/publicJSON', 
        function(req, res, next) 
        { debugger;
          req.res.json(atApplication.getPublicJSON());
          req.res.end();
        }
      );

  router
      .post
      ( '*', 
        function(req, res, next) 
        { debugger;

          // req.atRoot.connectedAtStore
          //   .find({"id":"twilioPostToEmail", })
          //   .then
          //   ( (docs) =>
          //     { console.log(docs);
          //     }      
          //   )
          var namespace = atRoot.namespace;



          var traveller = {};
          req.atRoot.namespace(traveller, "traveller").express =
              { "requestBody" : JSON.parse(JSON.stringify(req.body)),
                "req"         : req,
              }
          traveller.traveller.suggestedExit = atApplication.appName+"_rootRouter";
          req.atRoot.traverse(traveller, {});
        }
      );

  return router;
}

module.exports = buildAtRouter;
