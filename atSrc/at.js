// TODO INCLUDE VELOCITY.js? for queues?

// TODO INCLUDE VELOCITY.js? for queues?


// Encoding of basic tools
//   


console.log("loading at.js module");

if ( typeof module === 'object' && module && typeof module.exports === 'object' )
{ //NODE
  uuid    = require("uuid");
  extend  = require("extend");
  util    = require("util");
}
else
{ //BROWSER
  // extend = jQuery.extend;
  // uuid = require("uuid");
}

const Console     = require("console").Console;
var   errConsole  = new Console(process.stderr);

( function(window)
  { 
    var AtRoot = function()
    { var atRoot = this;

      this.regex = {};

      // fudamental identifier for implementation
      this.createID = function()
      { var idDict = 
          { "v1": uuid.v1(),
            "v4": uuid.v4(),
            "created": Date(),
            "timestamp": Date.now(),
          }
        idDict.idString = "@."+JSON.stringify(idDict).replace(/[^A-Za-z0-9-]/g, "_");

        return idDict;
      }
      

      // initialise a store for nodes
      this.connectAtStore = function(atStore)
      { if (atRoot.connectedAtStore)
          return;

        return atStore
          .find({"id":"@"})
          .then
          ( docs =>
            { // basic sanity checks on the atStore
              if ( docs.length != 1 ) throw "atStore sanity check. docs.length !=1. https://github.com/christopherreay/at/wiki/Errors#atstoreconnect1";
              var atStoreID = docs[0]
              if ( ! atStoreID.hasOwnProperty("storeID") ) throw "atStore sanity check. no storeID. https://github.com/christopherreay/at/wiki/Errors#atstoreconnect2";
              //TODO. Fix the length of the storeID, and add it here.
            }
          )
          .then
          ( () =>
            { atRoot.connectedAtStore = atStore;
              atRoot.public.atStore   = atStore;
            }
          );
      };
      this.initialiseAtStore = function(atStore)
      { //debugger;
        atRoot.ls("atSrc/at.js: AtRoot.initialiseAtStore");

        //make sure the store is empty
        return atStore
          .find({})
          .then
          ( docs =>
            { //console.log("initialiseAtStore, find{}:", JSON.stringify(docs) );
              if ( docs.length != 0 ) throw "atStore sanity check. store not empty. https://github.com/christopherreay/at/wiki/Errors#atstoreinitialise1";
            }
          )
          .then
          ( () =>
            { //debugger;
              return atStore
                .insert
                ( { "id": "@", "storeID": new atRoot.createID().idString } 
                )
                .then
                ( result =>
                  { console.log("new atStore initialised with storeID=", result);
                  }
                )
            }
          );
      }


      
      this.purgeAtStore = function(atStore)
      { atStore
          .find({"id":"@"})
          .then
          ( docs =>
            { var idString = docs[0].storeID.idString;
              atStore
                .update
                ( { "id": "@" }, 
                  { "id": "@."+idString } 
                )
                .then 
                ( () => { console.log("rewrote the store root from '@' to '@."+idString+"'"); }
                );
            }
          );
      }


      // if (atStore) atRoot.connectAtStore(atStore);


      atRoot.regex.startsWithToReturn = /^\s*toReturn\s*=/;
      //namespace functions are convenience. Since @ makes namespaces mean anything and everything, its nice to be able to create and use them easily.
      this.namespace = function(object, address, defaultList, checkExists)
      { //can use namespace to return constants too
        if (address == null) return object;
        if (address == "")   return object;


        if (checkExists == null) checkExists = false;

        var current   = object;
        var last      = null;

        var addressList           = address.split(".");
        var addressListTestIndex  = addressList.length -1;
        var addressCounter        = 0;

        // by default just fill the namespace with objects
        if (defaultList == null) defaultList = ["toReturn = {}"];
        var defaultListTestIndex  = defaultList.length -1;
        var defaultCounter        = 0;

        // if the address is more than one item long, and the defaultList is one item long, populate the default list with empty objects, up until 
        //   the leaf address
        var nonLeafNodes;
        var leafObject;
        if ( defaultList[0].startsWith("nonLeafNodes:") )
        { nonLeafNodes = defaultList[0].replace(/nonLeafNodes:/, "");
          //####console.log("nonLeafNodes: \n  ", nonLeafNodes);
        }
        else if ( defaultList[0].startsWith("leafNode:") )
        { defaultList[0] = defaultList[0].replace(/leafNode:/, "");
          if (defaultList[0].length == 0) 
          { defaultList[0]  = "null";
            leafObject      = checkExists;
            checkExists     = false;
          }
          nonLeafNodes = "toReturn = {}";
        }


        for (var wayPoint of addressList)
        { if (!current.hasOwnProperty(wayPoint) )
          { if (! checkExists == false) return false;

            var toReturn;
            var toEval;
            if (addressCounter < addressListTestIndex && nonLeafNodes != null)
            { toEval = nonLeafNodes;
            }
            else
            { toEval = defaultList[defaultCounter];
            }
            if (! atRoot.regex.startsWithToReturn.test(toEval) ) toEval = "toReturn = "+toEval+";";
            //####console.log("toEval:", toEval);
            eval(toEval);
            // toReturn.name = wayPoint;
            current[wayPoint] =  toReturn;
            //####console.log("current:", current, "key:", wayPoint, "obj:", current[wayPoint]);
          }
          last    = current;
          current = current[wayPoint];

          addressCounter ++;
          if (defaultCounter < defaultListTestIndex)
          { defaultCounter ++;
          }
        }
        if (leafObject != null && current == null)
        { current = last[wayPoint] = leafObject;
        }
          

        if (checkExists == "delete") delete last[wayPoint];
        return current;
      }
      this.namespace.move = function(object, moveDict)
      { //extend this to use dot notation for addresses. And maybe a target object
        for (var key in moveDict)
        { object[moveDict[key]] = object[key]
          delete object[key];
        }
      }
      this.namespace.cp = function(source, target, cpList)
      { cpList.forEach
        ( (key) =>
          { target[key] = source[key];
          }
        );
      }
      this.namespace.rm = function(object, address)
      { return atRoot.namespace(object, address, null, "delete");
      }
      this.namespace.contains = function(object, address, listOfKeys)
      { var checkThisObject = atRoot.namespace(object, address, null, true);
        if (! checkThisObject) return false;

        for (var index in listOfKeys)
        { if (! checkThisObject.hasOwnProperty(listOfKeys[index]))
            return false;
        }
      
        return true;
      }
      this.namespace.popFirstKey = function(object, address, rm)
      { var toReturn;

        var targetObject = namespace(object, address, null, true);
        if (! targetObject || ! Object.keys(targetObject) )
        { toReturn = null;
        }
        else
        { var keysList = Object.keys(targetObject);
          toReturn = { "name": keysList[0], "object": targetObject[keysList[0]] };
          if (rm == "rm") delete targetObject[keysList[0]];
        }
        return toReturn;
      }

      this.namespaceExists = function(object, address)
      { var current = object;
        address = address.split(".");

        for (var wayPoint of address)
        { if (! current.hasOwnProperty(wayPoint) )
          { return false;
          }
          current = current[wayPoint];
        }
        return true;
      }

      // functions for graphs
      this.AtNode = function()
      { //At Node is the fundamental object of the programming language. Travellers and Branches are also At Nodes. not sure about "contexts". but probabaly them too
        //  because nodes are connected by branches and travellers, there is no such thing as a "reference" as far as node.js is concerned. There are only explicit
        //  references to other node id's. This means that this object can be persisted "as is" into the database (well mongo anyway). Some other database might want
        //  to pull it apart a bit, but the "id" field should be enough for most things

        var idDict = new atRoot.createID();
        // the id is indexed in the store
        this.id     = idDict.idString;

        // if (nodeContent)
        // { extend(this, nodeContent);
        // }
      }
      this.newAtNode = function(object)
      { if (object == null) object = {};
        
        if (! object.hasOwnProperty("id") ) object.id = atRoot.createID().idString;

        return object
      }

      //create public accessible tools for travellers to use
      this.public = {}
      this.namespace.cp(this, this.public, ["newAtNode", "namespace", "createID"]);

      this.getConfiguration = function(address)
        { return atRoot.namespace(atRoot.atApplication.configuration, address, null, true);          
        }
      
      this.pauseTraveller = function(traveller)
      { traveller.traveller.pause = true;        
      }
      this.unPauseTraveller = function(traveller)
      { delete traveller.traveller.pause;
        this.traverse(traveller, {});
      }

      this.traverse = function(traveller, context, atStore)
      { //function which takes the traveller and the context. this avoids hard coding the name of the codeBlock / program field into the objects
        // TODO make it possible to run the code synchronously
        // TODO 
        
        setImmediate(
            function()
            { if (! context)
              { atRoot.ls("@: ERROR: at.js: traverse: context is: ", context);
                throw new Error("@: ERROR: at.js: traverse: context is: "+ context);
              }

              var atStore           = atStore || atRoot.connectedAtStore;

              var ls                = atRoot.ls;
              var getConfiguration  = atRoot.getConfiguration;

              var traverse          = atRoot.traverse;
              var pauseTraveller    = atRoot.pauseTraveller;
              var unPauseTraveller  = atRoot.unPauseTraveller;
              var namespace         = atRoot.namespace     

              var emptyDictionary   = {};
              var isString          = (item) => { return Object.prototype.toString.call(item) === "[object String]" };
        

              //atRoot and atStore should be in "named contexts", rather than embedded here like this
              //  that requires graphBuilding. Which is doable.
              for (var key in namespace(traveller, "atRoot", null, true) )
              { if ( ! key.startsWith("__"))
                { var functionName    = Object.keys(traveller.atRoot[key])[0];
                  var functionParams  = traveller.atRoot[key][functionName];
                  // ls("traverse: traveller.atRoot:", functionName, functionParams );
                  //should this be atRoot.results? or atRoot.__results? I like this because it leaves the namespaces clean, and noone ever has to remember anything anyway.
                  //  people should be using some kind of sub namespace for all their stuff. this is root root stuff, which is why I have made everything traveller.traveller.xyzetc
                  namespace(traveller, "results.atRoot");
                  traveller.results.atRoot[key] = atRoot.public[functionName].apply(null, functionParams);
                  delete traveller.atRoot[key];
                }
              }
              
              //We can possible do something with security, vis the atStore storeID. Somehow bake it into the traveller, like with merkel trees maybe?
              //  since the atStore and its value are not accessible to any code within the running code
              // TODO. Make this work like above, with using a Promise.All
              var dataAccessPromise       = Promise.resolve({});
              var dataAccessPromiseList   = [];

              for (var key in namespace(traveller, "atStore", null, true) )
              { if ( ! key.startsWith("__"))
                { var functionName    = Object.keys(traveller.atStore[key])[0];
                  var functionParams  = traveller.atStore[key][functionName];

                  // ls("traverse: traveller.atStore:", functionName, functionParams );
                  //should this be atRoot.results? or atRoot.__results? I like this because it leaves the namespaces clean, and noone ever has to remember anything anyway.
                  //  people should be using some kind of sub namespace for all their stuff. this is root root stuff, which is why I have made everything traveller.traveller.xyzetc
                  //  theres also this thing of being able to control read/write permissions of areas of the namespace. /results is kind of open.
                  namespace(traveller, "results.atStore");
                  
                  var storeAndDeleteKey = function(key, functionName, functionParams)
                  { //ls("at.js: traverse: atStore:", functionName, functionParams, "\n\n");
                    return atStore[functionName].apply(null, functionParams)
                      .then
                      ( (docs) => 
                        { //ls("at.js: traverse: atStore:", functionName, functionParams, "\ndocs:", docs, "\n\n");
                          traveller.results.atStore[key] = docs;
                          delete traveller.atStore[key];
                        }
                     );
                  }

                  dataAccessPromiseList.push
                  ( storeAndDeleteKey(key, functionName, functionParams)
                  )
                }
              }

              if (dataAccessPromiseList.length > 0) dataAccessPromise = Promise.all(dataAccessPromiseList);

              // if (namespace(traveller,"atStore.functionName", null, true))
              // { var functionName = traveller.atStore.functionName;
              //   var functionParams = traveller.atStore.functionParams;
              //   dataAccessPromise = 
              //     atStore[functionName].apply(null, functionParams)
              //       .then
              //       ( (docs) =>
              //         { namespace.move(traveller.atStore, {"functionName": "__functionName", "functionParams": "__functionParams"} );
              //           traveller.atStore.result = docs;
              //         }
              //       );
              // }


              dataAccessPromise.then
              ( () =>
                { // overload the atRoot variable, so that node code does not have access to the store
                  var atRoot  = null;
                  var atStore = null;
                  var docs    = null;

                  // TODO:
                  // Add tool to choose the namespace for the evaluation


                  //evaluate the code in the context against the traveller              
                  //  the node has the ability to set a suggested exit. A difference traverse function could ignore it (e.g. visualisation traveller)
                  var toEval = namespace(context, "traveller.codeBlock", ["toReturn = {}", "toReturn = ''"])
                  // ls(errConsole, "traverse.toEval:\n  ", toEval);
                  // toEvalFunction = new Function("traveller", "context", toEval);
                  // toEvalFunction(traveller, context);
                  // SOME SHIT ABOUT ACCESSING CLOSURES OVER LOCALS ANALYSE AND DESTROY. MIGHT HAVE TO PUT "traverse" INTO A CONTEXT OBJECT in the atStore
                  eval(toEval);

                  // check if the traveller is paused, and return a function which continues it
                  if (traveller.traveller.pause)
                  { return;
                  }

                  //determine the next destination of the traveller.
                  //  other traveller code may override this completely, the node can make a suggestion, or the traveller can follow the node's default exit
                  //  if there is no destination, then the traveller may have completed its journey, and can call its callback
                  //  the default place to look "traveller.exit" just allows us to create simple graphs without putting code 
                  //    in the codeblock
                  var travellerSuggestedExit  = namespace(traveller, "traveller.suggestedExit", null, true);
                  var destination             = travellerSuggestedExit || namespace(context, "traveller.exit", null, true);
                  if (travellerSuggestedExit)
                    delete traveller.traveller.suggestedExit;
                  ls("traverse.setExit: ", destination);
                  if (!destination)
                    if ( namespace(traveller, "traveller.suggestedExitQueue", null, true) )
                    { //debugger;
                      destination = traveller.traveller.suggestedExitQueue.shift();
                      if (!destination)
                      { delete traveller.traveller.suggestedExitQueue;
                      }
                    }

                  if (!destination) 
                  { //console.dir("End context:", traveller)
                    if (traveller.traveller.callback) 
                    { setImmediate(function(){var callback = traveller.traveller.callback; delete traveller.traveller.callback; callback(traveller);});
                    }
                  }
                  else
                  { traveller.destination = destination;
                  }
                }
              )
              .then 
              ( () =>
                { //THIS namespace is why there is also a "traveller.traveller" namespace, even though it looks wierd. Maybe it could be called defaultDimension
                  if (traveller.hasOwnProperty("destination"))
                  { var destination = traveller.destination;
                    delete traveller.destination;
                    return atStore
                      .findOne({"id": destination})
                      .then
                      ( (doc) =>
                        { if (! doc)
                          { throw new Error("@: at.js: traverse: searched atStore for:"+ destination+", found null");
                          }
                          atRoot.traverse(traveller, doc);
                        }
                      );
                  }
                }
              )
            }
        );
      }

      this.ls = function(listOfStuff)
      { argumentList = Array.from(arguments);

        var useConsole;
        if (arguments[0].constructor == require("console").Console )
        { useConsole = argumentList.shift();
        }
        else
        { useConsole = console;
        }

        argumentList.forEach
        ( (thing) =>
          { if (typeof thing == "string")
            { useConsole.log(thing);
            }
            else
            { useConsole.log(util.inspect(thing, false, null))
            }
          }
        );
      }
      this.prettyPrint = function(object)
      { return util.inspect(object, false, null);
      }

    }


    if ( typeof module === 'object' && module && typeof module.exports === 'object' )
    { module.exports = AtRoot;
    } else 
    { window.AtRoot = window.AtRoot || AtRoot;
    }



  }
)( this );