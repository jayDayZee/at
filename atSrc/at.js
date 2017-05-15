// TODO INCLUDE VELOCITY.js? for queues?

// TODO INCLUDE VELOCITY.js? for queues?


// Encoding of basic tools
//   


console.log("loading at.js module");

if ( typeof module === 'object' && module && typeof module.exports === 'object' )
{ //NODE
  uuid = require("uuid");
}
else
{ //BROWSER
  // extend = jQuery.extend;
  // uuid = require("uuid");
}


( function(window)
  { 
    var AtRoot = function(atStore)
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
        idDict.idString = JSON.stringify(idDict).replace(/[^A-Za-z0-9-]/g, "_");

        return idDict;
      }
      

      // initialise a store for nodes
      this.connectAtStore = function(atStore)
      { if (atRoot.connectedAtStore)
          return;

        atStore
          .find({"id":"@"})
          .then
          ( docs =>
            { console.log("initial docs:\n", docs);
              var atStoreInitialisePromise = { "then":function(){ atRoot.connectedAtStore = atStore; console.log("atStore already initialised");} };
              if (docs.length == 0)
              { atStoreInitialisePromise = 
                  atStore
                    .insert({"id":"@", "storeID": new atRoot.createID() })
              }
              else if (docs.length == 1 && ! docs[0].hasOwnProperty("storeID") )
              { atStoreInitialisePromise = 
                  atStore
                    .update
                    ( { "id": "@" }, 
                      { "storeID": new atRoot.createID() } 
                    )
              }
              atStoreInitialisePromise
                .then
                ( docs =>
                  { console.log("post atStore initialised: docs\n", docs);
                    atRoot.connectedAtStore = atStore;
                  }
                );
            }
          )
          .catch
          ( function() 
            { console.log("atStore initialisation failed");
            }
          )
      };
      
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


      if (atStore) atRoot.connectAtStore(atStore);


      atRoot.regex.startsWithToReturn = /^\s*toReturn\s*=/;
      //namespace functions are convenience. Since @ makes namespaces mean anything and everything, its nice to be able to create and use them easily.
      this.namespace = function(object, address, defaultList)
      { var current  = object;

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
        if ( defaultList[0].startsWith("nonLeafNodes:") )
        { nonLeafNodes = defaultList[0].replace(/nonLeafNodes:/, "");
          console.log("nonLeafNodes: \n  ", nonLeafNodes);
        }
        else if ( defaultList[0].startsWith("leafNode:") )
        { defaultList[0] = defaultList[0].replace(/leafNode:/, "");
          nonLeafNodes = "toReturn = {}";
        }


        for (var wayPoint of addressList)
        { if (!current.hasOwnProperty(wayPoint) )
          { var toReturn;
            var toEval;
            if (addressCounter < addressListTestIndex && nonLeafNodes != null)
            { toEval = nonLeafNodes;
            }
            else
            { toEval = defaultList[defaultCounter];
            }
            if (! atRoot.regex.startsWithToReturn.test(toEval) ) toEval = "toReturn = "+toEval+";";
            console.log("toEval:", toEval);
            eval(toEval);
            // toReturn.name = wayPoint;
            current[wayPoint] =  toReturn;
            console.log("current:", current, "key:", wayPoint, "obj:", current[wayPoint]);
          }
          current = current[wayPoint];

          addressCounter ++;
          if (defaultCounter < defaultListTestIndex)
          { defaultCounter ++;
          }
        }

        return current;
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

        this.idDict = new atRoot.createID();
        // the id is indexed in the store
        this.id     = this.idDict.idString;

        // if (nodeContent)
        // { extend(this, nodeContent);
        // }
      }
      
      this.traverse = function(traveller, context, atStore)
      { //function which takes the traveller and the context. this avoids hard coding the name of the codeBlock / program field into the objects
        setImmediate(
            function()
            { var namespace = atRoot.namespace
              var atStore = atStore || atRoot.connectedAtStore;
              
              var dataAccessPromise = {"then": function(then) { then(); } };

              var atStoreFunctionName = namespace(traveller, "atStore.functionName", ["leafNode:null"] );
              if (atStoreFunctionName)
              { dataAccessPromise = atStore[atStoreFunctionName].apply(null, traveller.atStore.functionParams);
              }

              dataAccessPromise.then
              ( () =>
                // overload the atRoot variable, so that node code does not have access
                { var atRoot = {};

                  //evaluate the code in the context against the traveller              
                  //  the node has the ability to set a suggested exit. A difference traverse function could ignore it (e.g. visualisation traveller)
                  var toEval = namespace(context, "traveller.codeBlock", ["toReturn = {}", "toReturn = ''"])
                  console.log("traverse.toEval:\n  ", toEval);
                  // toEvalFunction = new Function("traveller", "context", toEval);
                  // toEvalFunction(traveller, context);
                  eval(toEval);


                  var destination = namespace(traveller, "traveller.suggestedExit", ["toReturn = {}", "toReturn = null"]) || namespace(context, "traveller.exit", ["toReturn = {}", "toReturn = null"]);
                  traveller.traveller.suggestedExit = null;

                  if (!destination) 
                  { console.log("End context:", traveller)
                    if (traveller.traveller.callback) setImmediate(function(){traveller.traveller.callback(traveller);});
                  }
                  else 
                    atRoot.traverse(traveller, register(destination) );
                }
              );
            }
        );
        
      }

    }


    if ( typeof module === 'object' && module && typeof module.exports === 'object' )
    { module.exports = AtRoot;
    } else 
    { window.AtRoot = window.AtRoot || AtRoot;
    }



  }
)( this );