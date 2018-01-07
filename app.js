var buildAtApplication = 
    (appName, requiredConfigFields) =>
    { var AtRoot = require("./atSrc/at.js")
      var atRoot = new AtRoot();

      var atApplication = 
          { "appName":                      appName,
            "appRuntimeTimestamp":          new Date().getTime(),
            
            "atRoot":                       atRoot,
            
            "preConfiguration":
                { "pathToConfigurationFromDisk":  "./apps/"+appName+".config.json",
                  "requiredConfigFields":         requiredConfigFields,
                },

          };


      // DEFAULT DEFAULT CONFIG
      // TODO: this should be parameterised by some kind of default default configuration
      process.on("unhandledRejection", function(error) {console.log(error); } );      

      /**
       * Module dependencies.
       */
      var debug         = require('debug')('at:server');
      var http          = require('http');

      const Console     = require("console").Console;
      var   errConsole  = new Console(process.stderr);

      var path          = require('path');
      var fs            = require("fs");
      var jsmin         = require('jsmin').jsmin;
      
      var configurationFromDisk = atApplication.preConfiguration.configurationFromDisk = 
          JSON.parse(jsmin(fs.readFileSync(atApplication.preConfiguration.pathToConfigurationFromDisk, "utf8") ));

      var configuration = atApplication.configuration = JSON.parse(JSON.stringify(configurationFromDisk));

      for (var configFieldName in atApplication.preConfiguration.requiredConfigFields)
      { if (! configurationFromDisk.hasOwnProperty(configFieldName) )
        { //const readLine = readlinePackage.createInterface
          // ( { input: process.stdin,
          //     output: process.stdout,
          //   }
          // );
          var requiredConfigField = atApplication.preConfiguration.requiredConfigFields[configFieldName];
          if (requiredConfigField.hasOwnProperty("default") )
          { console.log("@: WARNING: app.js: buildAtApplication.js: the JSON file '"+atApplication.preConfiguration.pathToConfigurationFromDisk+"' does not contain a value for the '"+configFieldName+"' parameter");
            console.log("@:   setting the value to the system default:\n    " + requiredConfigField.default);
            configuration[configFieldName] = requiredConfigField.default;
          }
          else
          { console.log("@: ERROR  : app.js: buildAtApplication.js: the JSON file '"+atApplication.preConfiguration.pathToConfigurationFromDisk+"' does not contain a value for the '"+configFieldName+"' parameter");
            console.log("@:   exiting with exit value: \n  " + requiredConfigField.exitValue); 
            process.exit(requiredConfigField.exitValue);
          }
        }
      }

      atApplication.getPublicJSON = 
        () =>
        { debugger;
          var publicJSON = atRoot.namespace(atApplication, "configuration.publicJSON", ["leafNode:"], []);
          
          var toReturn = {};
          for (var i=0, len=publicJSON.length; i < len; i++)
          { atRoot.namespace(toReturn, publicJSON[i], ["leafNode:"], atRoot.namespace(atApplication, publicJSON[i]));
          } 
          return toReturn;
        }


      // ################ create registers ####################
      var registers     = atApplication.registers = {};
      registers.monk    = require("monk");
      registers.db      = registers.monk("localhost/"+atApplication.appName+"_atApplication");
      registers.atStore = registers.db.get('atStore_'+atApplication.appName);
      

      // ################ create express app ##################
      var expressApp = atApplication.expressApp = buildExpressApp(atApplication);

       /**
       * Normalize a port into a number, string, or false.
       */
      function normalizePort(val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
          // named pipe
          return val;
        }

        if (port >= 0) {
          // port number
          return port;
        }

        return false;
      }

      /**
       * Event listener for HTTP server "error" event.
       */

      function onError(error) {
        if (error.syscall !== 'listen') {
          throw error;
        }

        var bind = typeof port === 'string'
          ? 'Pipe ' + port
          : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
          case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
          case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
          default:
            throw error;
        }
      }

      var port;
      if (process.env.hasOwnProperty("atApplication_PORT"))
      { port = process.env.atApplication_PORT
      }
      else if (atApplication.configuration.hasOwnProperty("port") )
      { port = atApplication.configuration.port;
      }
      port = normalizePort(port);
      console.log("@: app.js: buildAtApplication: setting port to: "+port);
      if (port === false)
      { console.log("@: app.js: buildAtApplication: 'port' is not set. Exitting with value 1");
        process.exit(1)
      }
      expressApp.set('port', port);

      /**
       * Create HTTP server.
       */
      var server = http.createServer(expressApp);

      /**
       * Listen on provided port, on all network interfaces.
       */

      function onListening() 
      { var addr = server.address();
        var bind = typeof addr === 'string'
          ? 'pipe ' + addr
          : 'port ' + addr.port;
        debug('Listening on ' + bind);
      }

      server.listen(port);
      server.on('error', onError);
      server.on('listening', onListening);

      return atApplication;

      // ############ END CREATE EXPRESS APP #################
      
    }

var buildExpressApp = 
  (atApplication) =>

  { var express       = require('express');
    var path          = require('path');
    var favicon       = require('serve-favicon');
    var logger        = require('morgan');
    var cookieParser  = require('cookie-parser');
    var bodyParser    = require('body-parser');

    
    var app = express();
    
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(function(req,res,next){
        req.atRoot          = atApplication.atRoot;
        req.atStore         = atApplication.registers.atStore;
        req.atConfiguration = atApplication;
        next();
    });

    var index = require('./routes/index')(atApplication);
    app.use('/', index);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message  = err.message;
      res.locals.error    = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });

    return app;
  }


module.exports = buildAtApplication;
