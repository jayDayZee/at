thePlan = 
{ "waiting": "idle",

  "striationOrder": ["violet", "indigo", "blue", "green", "yellow", "orange", "red"],
  "striations":
  { "red":    {"name": "Core Holochain Integration",  "rgb": "(255, 0,   0  )"    },
    "orange": {"name": "Events Attendance Outreach",  "rgb": "(255, 148, 0  )"    },
    "yellow": {"name": "Organizational Outreach",     "rgb": "(255, 255, 0  )"    },
    "green":  {"name": "Networking Outreach",         "rgb": "(0,   255, 0  )"    },
    "blue":   {"name": "Social Forms Innovation",     "rgb": "(0,   0,   255)"    },
    "indigo": {"name": "Design / Strategy Talk",      "rgb": "(255, 0,   255)"    },
    "violet": {"name": "Meta / Politics",             "rgb": "(255, 146, 147)"    },
  },
};

$(document).on
( "readystatechange",  
  () =>
  { if (document.readyState == "complete")
    { thePlan.eschatonNaturalHeight = $(".eschaton").get(0).naturalHeight;
      thePlan.eschatonNaturalWidth  = $(".eschaton").get(0).naturalWidth;

      thePlan.eschatonRatio = thePlan.eschatonNaturalWidth / thePlan.eschatonNaturalHeight;

      // $(window).resize
      // ( () =>
      //   { thePlan.waitOnResize(); 
      //   } 
      // ); 

      thePlan.containerHeight = $(window).height();
      $(".thePlanContainer").css( {"height": thePlan.containerHeight - 20, "width": thePlan.containerHeight * thePlan.eschatonRatio } );

      $(".thePlanContainer").on
        ("click", ".dot", 
          (event) => 
          { console.log( $(event.currentTarget).data("positionData") );
          } 
        );

      // thePlan.resize();


      thePlan.createDivs();
    }
  }
);

thePlan.resize = 
  () =>
  { thePlan.waiting       = "idle";
    
    thePlan.calculateSizes();
    thePlan.setContainerWidth();
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

    thePlan.windowHeight  = windowHeight;
    thePlan.seventhHeight = windowHeight / 7.0 / 7.0;

    thePlan.eschatonWidth = window.getComputedStyle($(".eschaton").get(0))["width"];
    console.log(thePlan);
  }
)

thePlan.setContainerWidth = 
( () =>
  { thePlan.calculateSizes();
    
    thePlan.containerHeight = window.getComputedStyle($(".thePlanContainer").get(0))["height"];
    $(".thePlanContainer").css( {"width": thePlan.containerHeight * thePlan.eschatonRatio } );
  }
)

thePlan.setSeventhDivStyle = 
( () =>
  { // TODO this should be %s and then doesnt need to be reset
    $(".seventhDiv").css({"height": thePlan.seventhHeight, "width": thePlan.seventhHeight} );
  }
)

thePlan.createDivs = 
( () =>
  { 

    var numberOfDivs_vertical   = 49;
    var numberOfDivs_horizontal = Math.floor($(".thePlanContainer").width() / ($(".thePlanContainer").height() / 49) );
    var sizeOfDots = $(".thePlanContainer").height() / 59;

    for (var striation=0; striation < 7; striation ++)
    { var striationColor = thePlan.striationOrder[striation]
      var currentStriation = $("<div class='striation "+striationColor+"' />");
      
      for (var dots_allTheWayAcross=0; dots_allTheWayAcross < numberOfDivs_horizontal; dots_allTheWayAcross++)
      { for (var dots_7high=0; dots_7high<7; dots_7high++)
        { var currentDot = $("<div class='dot' />").appendTo(currentStriation);
          currentDot.height(sizeOfDots);
          currentDot.width(sizeOfDots);
          currentDot.data("positionData", {"striationColor": striationColor, "x": dots_allTheWayAcross, "y": dots_7high} );
        }
      }
      currentStriation.appendTo($(".interactiveContainer"));
    }
  }
);
