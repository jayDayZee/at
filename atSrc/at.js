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
    { if (window.hasOwnProperty("atRoot") )
      { return;
      }
      else
      { atRoot = this;
      }

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

    }


    if ( typeof module === 'object' && module && typeof module.exports === 'object' )
    { module.exports = AtRoot;
    } else 
    { window.atRoot = window.AtRoot || AtRoot;
    }



  }
)( this );