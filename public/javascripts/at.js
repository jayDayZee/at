thePlan = 
{ "waiting": "idle",
};

$(document).on
( "readystatechange",  
  () =>
  { if (document.readyState == "complete")
    { thePlan.resize();

      thePlan.createDivs();
    }
  }
);

$( () =>
    { $(window).resize( function() { thePlan.waitOnResize(); } ); 
    }
  );

thePlan.resize = 
  () =>
  { thePlan.waiting = "idle";
    thePlan.calculateSizes();
    thePlan.setBackgroundImageHeight();
    thePlan.setSeventhDivStyle();
  };

thePlan.waitOnResize = 
  () =>
  { if (thePlan.waiting == "idle")
    { thePlan.waiting = "waiting";
      setTimeout
      ( () =>
        { if (thePlan.waiting == "pinged")
          { thePlan.waiting = "idle";
            setImmediate(thePlan.waitOnResize); 
          }
          else if (thePlan.waiting = "waiting")
          { thePlan.waiting = "idle";
            setImmediate(thePlan.resize);
          }
        },
        100
      )
    }
    else if (thePlan.waiting == "waiting")
    { thePlan.waiting = "pinged";
    }
  };

thePlan.calculateSizes = 
( () =>
  { var windowHeight = $(window).height() - 30;

    thePlan.windowHeight = windowHeight;
    thePlan.seventhHeight = windowHeight / 7.0;

    thePlan.groundWidth = window.getComputedStyle($(".thePlan").get(0))["width"];
    console.log(thePlan);
  }
)

thePlan.setBackgroundImageHeight = 
( () =>
  { thePlan.calculateSizes();
    $(".thePlan").css({"max-height": thePlan.windowHeight, "min-width": "100%"});
  }
)

thePlan.setSeventhDivStyle = 
( () =>
  { $(".seventhDiv").css({"height": thePlan.seventhHeight, "width": thePlan.seventhHeight} );
  }
)

thePlan.createDivs = 
( () =>
  { thePlanComputer = window.getComputedStyle($(".thePlan").get(0))
    // console.log(window.getComputedStyle($(".thePlan").get(0) ));
  }
);
