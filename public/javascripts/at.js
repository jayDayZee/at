atInterface = 
{ "browserSupport": 
      { "navigator.userAgent.toLowerCase().indexOf('webkit') == -1": 
            ` window.confirm("<strong>ideas for a plan</strong> is currently only built for webkit-* compatible browsers (chromium, google-chrome and safari)");
              $("body").html("<strong>ideas for a plan</strong> is currently only built for webkit-* compatible browsers (chromium, google-chrome and safari)");
              toReturn = true;
            `
      },

  "waiting": "idle",
};

$(document).on
( "readystatechange",  
  () =>
  { if (document.readyState == "complete")
    { setTimeout
      ( () =>
        { for (var key in atInterface.browserSupport)
          { if ( eval(key) )
            { var toReturn=false;
              eval(atInterface.browserSupport[key]);
              if (toReturn) return;
            }
          }


        },
        100
      );

    }
  }
);