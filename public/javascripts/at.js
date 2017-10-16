thePlan = 
{ "waiting": "idle",

  "striationOrder": ["violet", "indigo", "blue", "green", "yellow", "orange", "red"],
  "striationDict":
  { "red":    {"name": "Core Holochain Integration",  "rgb": "(255, 0,   0  )", "label": "HardCore" ,   },
    "orange": {"name": "Events Attendance Outreach",  "rgb": "(255, 148, 0  )", "label": "Infra"    ,   },
    "yellow": {"name": "Organizational Outreach",     "rgb": "(255, 255, 0  )", "label": "Servo"    ,   },
    "green":  {"name": "Networking Outreach",         "rgb": "(0,   255, 0  )", "label": "Socio"    ,   },
    "blue":   {"name": "Social Forms Innovation",     "rgb": "(0,   0,   255)", "label": "Produ"    ,   },
    "indigo": {"name": "Design / Strategy Talk",      "rgb": "(255, 0,   255)", "label": "Exa"      ,   },
    "violet": {"name": "Meta / Politics",             "rgb": "(255, 146, 147)", "label": "Iso"      ,   },
  },
  // TODO: add hover issue summary
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

      $(` <div class="wrapper">
            <div class="popup">
                <iframe class="issueIframe" src="">
                    <p>Your browser does not support iframes.</p>
                </iframe>
                <a href="#" class="close">X</a>
            </div>
          </div>`)
      .appendTo($("body"));



      thePlan.containerHeight = $(window).height();
      $(".thePlanContainer").css( {"height": thePlan.containerHeight - 20, "width": thePlan.containerHeight * thePlan.eschatonRatio } );

      $(".thePlanContainer").on
        ("click", ".dot", 
          (event) => 
          { var dotIdentity = $(event.currentTarget).data("positionData");
            
            console.log( dotIdentity );

            if (thePlan.issues.hasOwnProperty(dotIdentity.dictionaryKey))
            { window.open(thePlan.issues[dotIdentity.dictionaryKey].html_url);
            }
            else
            { var ajaxOptions = 
              { "method": "POST",
                "url"   : "/",
                "data"  : dotIdentity,

                "dataType": "JSON",
              };
              $.ajax("/", ajaxOptions)
                .done
                ( (data) => 
                  { console.log(data);
                    // $(".issueIframe").attr("src", data.url);
                    var browserUrl = data.html_url;
                    window.open(browserUrl, "_blank");
                  }
                );
            }
          } 
        );

      // thePlan.resize();


      thePlan.getAllIssues();

      // thePlan.createDivs();


    }
  }
);

thePlan.getAllIssues =
  () =>
  { var ajaxOptions = 
    { "method": "POST",
      "url"   : "/",
      "data"  : {"operation": "getAllIssues"},

      "dataType": "JSON",
    };
    $.ajax("/", ajaxOptions)
      .done
      ( (data) => 
        { console.log(data);
          // $(".issueIframe").attr("src", data.url);
          // var browserUrl = data.url.replace("api.github.com/repos/", "github.com/");
          // window.open(browserUrl, "_blank");
          thePlan.issues = {};
          for (var key in data)
          { var issue = data[key];
            if (JSON.stringify(issue.xy) !== JSON.stringify({}) )
            { thePlan.issues[issue.xy] = issue;
            }
          }

          thePlan.createDivs();
        }
      );



  }

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
    { var striationColor    = thePlan.striationOrder[striation];
      var striationObject   = thePlan.striationDict[striationColor];
      var currentStriation  = $("<div class='striation "+striationColor+"' />");
      var striationLabel    = $("<div class='striationLabel'>"+striationObject.label+"</div>").appendTo(currentStriation);

      for (var dots_allTheWayAcross=0; dots_allTheWayAcross < numberOfDivs_horizontal; dots_allTheWayAcross++)
      { for (var dots_7high=0; dots_7high<7; dots_7high++)
        { var currentDot = $("<div class='dot' />").appendTo(currentStriation);
          var dictionaryKey =
                striationObject.label     + ":"
              + dots_allTheWayAcross      + ":"
              + dots_7high
          currentDot.toggleClass(dictionaryKey, true);
          if (thePlan.issues.hasOwnProperty(dictionaryKey) )
          { currentDot.attr("title", thePlan.issues[dictionaryKey].body);
          }
          currentDot.height(sizeOfDots);
          currentDot.width(sizeOfDots);
          currentDot.data("positionData", {"striationLabel": striationObject.label, "x": dots_allTheWayAcross, "y": dots_7high, "dictionaryKey": dictionaryKey} );
        }
      }
      
      currentStriation.appendTo($(".interactiveContainer"));
    }
  }
);
