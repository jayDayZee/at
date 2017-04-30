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
    { this.createID = function()
      { var idDict = 
          { "v1": uuid.v1(),
            "v4": uuid.v4(),
            "created": Date(),
            "timestamp": Date.now(),
          }
        idDict.idString = JSON.stringify(idDict).replace(/[^A-Za-z0-9-]/g, "_");

        return idDict;
      }
      atStore
        .find({"id":"@"})
        .then
        ( docs =>
          { console.log("docs\n", docs);
            if (docs.length == 0)
            { atStore
                .insert({"id":"@", "storeID": new this.createID() })
                .then
                ( docs =>
                  { console.log("docs\n", docs);
                  }
                );
            }
            else if (docs.length == 1 && ! docs[0].hasOwnProperty("storeID") )
            { atStore
                .update( { "id": "@" }, { "storeID": new this.createID() } )
                .then
                ( docs =>
                  { console.log("docs\n", docs);
                  }
                );
            }
          }
        );
    }


    if ( typeof module === 'object' && module && typeof module.exports === 'object' )
    { module.exports = AtRoot;
    } else 
    { window.atRoot = window.AtRoot || AtRoot;
    }



  }
)( this );