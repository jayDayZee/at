// TODO INCLUDE VELOCITY.js? for queues?

// TODO INCLUDE VELOCITY.js? for queues?


// Encoding of basic tools
//   


console.log("loading at.js module");

if ( typeof module === 'object' && module && typeof module.exports === 'object' )
{ //Browser
  // uuid = require("uuid");
}
else
{ //NODE
  // extend = jQuery.extend;
}


( function(window)
  { 
    var AtRoot = function()
    { 
    }


    if ( typeof module === 'object' && module && typeof module.exports === 'object' )
    { module.exports = AtRoot;
    } else 
    { window.atRoot = window.AtRoot || AtRoot;
    }



  }
)( this );