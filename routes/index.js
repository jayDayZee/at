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
        { //debugger;
          // TODO:
          //   make the javascript loading load modules from the backend on an address space basis.
          //   any request that is made to a module that isnt loaded just gets loaded from the backend and then called
          //   this can be called using a traveller / context paradigm. Simple. Sick.
          res.render('index', { "publicJSON": atApplication.publicJSON } );

        }
      );
  /* GET home page. */
  router
      .get
      ( '/publicJSON', 
        function(req, res, next) 
        { //debugger;
          req.res.json(atApplication.getPublicJSON());
          req.res.end();
        }
      );

  router
      .post
      ( '*', 
        function(req, res, next) 
        { //debugger;

          var traveller = {};
          req.atRoot.namespace(traveller, "traveller").express =
              { "requestBody" : JSON.parse(JSON.stringify(req.body)),
                "req"         : req,
              }
          traveller.traveller.suggestedExit = atApplication.appName+"_httpPOSTRouter";
          req.atRoot.traverse(traveller, {});
        }
      );

  return router;
}

module.exports = buildAtRouter;
