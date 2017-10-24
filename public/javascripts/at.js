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
  tabindex: 0,

  // TODO: add hover issue summary
};

$(document).on
( "readystatechange",  
  () =>
  { if (document.readyState == "complete")
    { setTimeout
      ( () =>
        { thePlan.eschatonNaturalHeight = $(".eschaton").get(0).naturalHeight;
          thePlan.eschatonNaturalWidth  = $(".eschaton").get(0).naturalWidth;

          thePlan.eschatonRatio = thePlan.eschatonNaturalWidth / thePlan.eschatonNaturalHeight;

          // $(window).resize
          // ( () =>
          //   { thePlan.waitOnResize(); 
          //   } 
          // ); 

          // $(` <div class="wrapper">
          //       <div class="popup">
          //           <iframe class="issueIframe" src="">
          //               <p>Your browser does not support iframes.</p>
          //           </iframe>
          //           <a href="#" class="close">X</a>
          //       </div>
          //     </div>`)
          // .appendTo($("body"));


          thePlan.containerHeight = $(window).height();
          $(".thePlanContainer").css( {"height": thePlan.containerHeight-38, "width": thePlan.containerHeight * thePlan.eschatonRatio } );

          $(".thePlanContainer").on
            ( "click", ".dot", 
              (event) => 
              { if (thePlan.checkModalState()) return;

                thePlan.currentDot = $(event.currentTarget).data("positionData");
                console.log( thePlan.currentDot );
                thePlan.openSideBar();
              } 
            );

          // thePlan.resize();

          var link = document.createElement( "link" );
          link.href = "//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css";
          link.type = "text/css";
          link.rel = "stylesheet";
          link.media = "screen,print";

          document.getElementsByTagName( "head" )[0].appendChild( link );


          thePlan.getAllIssues();
        },
        100
      );

    }
  }
);

thePlan.checkModalState = 
  () =>
  { toReturn = false;

    if (thePlan.modalState)
    { thePlan.closeModal();
      thePlan.modalState = false;
      toReturn = true;
      $(".newIssueColorResponsive").toggleClass(thePlan.selectedColor.data("thePlan.issueTypeColorData").color+"3", false);
    }
    
    return toReturn;
  };
thePlan.closeModal = 
  () =>
  { $(".modal").toggleClass("open", false);
  }

thePlan.openSideBar =
  () =>
  { thePlan.modalState = true;
    thePlan.sideBarComponent.toggleClass("open", true);
    var dotIdentity = thePlan.currentDot;

    if (thePlan.issues.hasOwnProperty(dotIdentity.dictionaryKey))
    { //window.open(thePlan.issues[dotIdentity.dictionaryKey].html_url);
    }
    else
    { thePlan.sideBar.innerHTML = "";

      thePlan.sideBar.append(thePlan.newIssueContainer);
      thePlan.issueTypeColorsContainer.find(":first-child").click().focus();

      // thePlan.sideBar.append(thePlan.issueTypeColorsContainer);
      // thePlan.sideBar.append(thePlan.newIssueTitleField);
      // thePlan.sideBar.append(thePlan.newIssueCreateButton);
      

      //var ajaxOptions = 
      // { "method": "POST",
      //   "url"   : "/",
      //   "data"  : dotIdentity,

      //   "dataType": "JSON",
      // };
      // $.ajax("/", ajaxOptions)
      //   .done
      //   ( (data) => 
      //     { console.log(data);
      //       // $(".issueIframe").attr("src", data.url);
      //       var browserUrl = data.html_url;
      //       window.open(browserUrl, "_blank");
      //     }
      //   );
    }
  };

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
            if ( issue.state == "open" && JSON.stringify(issue.xy) !== JSON.stringify({}) )
            { thePlan.issues[issue.xy] = issue;
            }
            console.log(issue.state);
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
      var currentStriation  = $("<div class='striation"+" "+striationColor+"3' />");
      var striationLabel    = $("<div class='striationLabel modalCloser'>"+striationObject.label+"</div>").appendTo(currentStriation);

      for (var dots_allTheWayAcross=0; dots_allTheWayAcross < numberOfDivs_horizontal; dots_allTheWayAcross++)
      { for (var dots_7high=0; dots_7high<7; dots_7high++)
        { var currentDot = $("<div class='dot' />").appendTo(currentStriation);
          var dictionaryKey =
                striationObject.label     + ":"
              + dots_allTheWayAcross      + ":"
              + dots_7high
          currentDot.toggleClass(dictionaryKey, true);
          if (! thePlan.issues.hasOwnProperty(dictionaryKey) )
          { //currentDot.attr("title", "<input />");
            // currentDot.toggleClass("hasIssue", true);
          }
          else
          { var issue = thePlan.issues[dictionaryKey]
            currentDot.attr("title", "<strong>"+issue.title+"</strong><br><br>"+issue.body);
            currentDot.toggleClass("hasIssue", true);
          }
          currentDot.height(sizeOfDots);
          currentDot.width(sizeOfDots);
          currentDot.data("positionData", {"striationLabel": striationObject.label, "x": dots_allTheWayAcross, "y": dots_7high, "dictionaryKey": dictionaryKey, "issue": issue} );
        }
      }
      
      currentStriation.appendTo($(".interactiveContainer"));
    }


    thePlan.issueTypeColorsContainer = $('<div class="issueTypeColorsContainer" />');
    for (var striation=6; striation > -1; striation --)
    { var striationColor    = thePlan.striationOrder[striation];
      $('<div class="issueTypeColor' + " "+striationColor+'7" />')
          .data("thePlan.issueTypeColorData", { "color": striationColor } )
          .attr("tabindex", thePlan.tabindex)
          .appendTo(thePlan.issueTypeColorsContainer);
    }
    thePlan.newIssueTitleField    = $("<input class='newIssueTitleField newIssueColorResponsive' placeholder='issue title' />");
    thePlan.newIssueCreateButton  = $("<div class='newIssueCreateButton newIssueColorResponsive'>Create</div>");
    thePlan.newIssueCreateButton.attr("tabindex", 0);

    thePlan.newIssueContainer     = $("<div class='newIssueContainer' />");
    thePlan.newIssueContainer.append(thePlan.issueTypeColorsContainer).append(thePlan.newIssueTitleField).append(thePlan.newIssueCreateButton);

    thePlan.fullSizeModalSpinner  = $("<div class='fullSizeModalSpinner modal' />");

    thePlan.doubleBuffer          = $("<div class='doubleBuffer' />");
    
    $("body").append(thePlan.doubleBuffer);
      thePlan.doubleBuffer.append(thePlan.newIssueContainer);


      //issueTypeColorManager
      thePlan.issueTypeColorsContainer.on
          ( "click", ".issueTypeColor", 
            (event) => 
            { thePlan.selectedColor = $(event.currentTarget);

              $(".issueTypeColor").toggleClass("selected", false);
              thePlan.selectedColor.toggleClass("selected", true);
            } 
          );
      thePlan.issueTypeColorsContainer.on
      ( "focus", ".issueTypeColor",
        (event) =>
        { $(".newIssueColorResponsive").toggleClass(thePlan.selectedColor.data("thePlan.issueTypeColorData").color+"3", false);
          $(".newIssueColorResponsive").toggleClass($(event.currentTarget).data("thePlan.issueTypeColorData").color+"3", true);
          thePlan.selectedColor = $(event.currentTarget);
      });
      thePlan.issueTypeColorsContainer.on
      ( "keyup", ".issueTypeColor",
        (event) =>
        { if (event.keyCode == 32 || event.keyCode == 13) 
          { // space and enter
            event.currentTarget.click();
            thePlan.newIssueTitleField.focus();
          }
      });
      thePlan.issueTypeColorsContainer.on
      ( "keydown", ".issueTypeColor",
        (event) =>
        { console.log(event);
          // var cycleDict = 
          // { "9":  { false: [":last-child", ":first-child"] }.
          //         { true:  [":first-child", ":last-child"] ),
          // }
          
          if (event.keyCode == 9 && event.shiftKey == false) 
          { // space and enter
            if ($(event.currentTarget).is(":last-child"))
            { thePlan.issueTypeColorsContainer.find(":first-child").focus();
              // thePlan.issueTypeColorsContainer.trigger("focus");
              return false
            }
          }
          if (event.keyCode == 9 && event.shiftKey == true) 
          { // space and enter
            if ($(event.currentTarget).is(":first-child"))
            { thePlan.issueTypeColorsContainer.find(":last-child").focus();
              // thePlan.issueTypeColorsContainer.trigger("focus");
              return false;
            }
          }
      });
      

      // Enter Issue Title
      thePlan.newIssueTitleField.on
      ( "keyup",
        (event) =>
        { if (event.keyCode == 13) 
          { // space and enter
            thePlan.newIssueCreateButton.focus();
          }
      });

      // Create new Issue  
      thePlan.newIssueCreateButton.on
      ( "keydown",
        (event) =>
        { console.log(event);
          if (event.keyCode == 9) 
          { // tab
            thePlan.issueTypeColorsContainer.find(":first-child").focus();
            return false;
          }
      });
      thePlan.newIssueCreateButton.on
      ( "keyup",
        (event) =>
        { if (event.keyCode == 32 || event.keyCode == 13) 
          { // space and enter
            thePlan.newIssueCreateButton.click();
          }
      });
      thePlan.newIssueCreateButton.on
      ( "click",
        (event) =>
        { var newIssueTitle = thePlan.newIssueTitleField.val();
          if (newIssueTitle.length < 5)
          { alert("Issue title must be at lest 5 characters");
            thePlan.newIssueTitleField.focus();
            return;
          }

          thePlan.fullSizeModalSpinner.toggleClass("open", true).appendTo(thePlan.sideBar);
          thePlan.fullSizeModalSpinner.toggleClass(thePlan.selectedColor.data("thePlan.issueTypeColorData").color+"3", true)

          var ajaxOptions = 
          { "method": "POST",
            "url"   : "/",
            "data"  : 
                $.extend
                ( {}, 
                  thePlan.currentDot, 
                  { "title": newIssueTitle ,
                  } 
                ),

            "dataType": "JSON",
          };
          console.log(ajaxOptions);
          $.ajax("/", ajaxOptions)
            .done
            ( (data) => 
              { setTimeout
                ( () =>
                  { console.log(data);
                    // $(".issueIframe").attr("src", data.url);
                    var browserUrl = data.html_url;
                    window.open(browserUrl, "_blank");
                    // thePlan.fullSizeModalSpinner.hide();
                    thePlan.checkModalState();
                    thePlan.fullSizeModalSpinner.toggleClass(thePlan.selectedColor.data("thePlan.issueTypeColorData")+"7", false)
                    thePlan.newIssueTitleField.val("");
                    $(".issueTypeColor").toggleClass("selected", false);
                    $(".newIssueColorResponsive").toggleClass(thePlan.selectedColor.data("thePlan.issueTypeColorData").color+"3", false);
                    thePlan.newIssueContainer.appendTo(thePlan.doubleBuffer);
                  },
                  1000
                );
              }
            );
        }
      );


    $(document).tooltip({
        content: function () {
            return $(this).prop('title');
        }
    });

    // memoise stuff for modal
    thePlan.modal             = $(".modal");
    thePlan.modalCloser       = $(".modalCloser");

    thePlan.sideBarComponent  = $(".sideBarComponent");
    // thePlan.sideBarModal      = $(".sideBarModal");
    thePlan.sideBar           = $(".sideBar");

    // modal stuff
    $(document).keyup(function(e) {
        if (e.keyCode == 27) { // escape key maps to keycode `27`
            thePlan.checkModalState();
        }
    });
    thePlan.modalCloser.on
      ( "click",
        (event) => 
        { thePlan.checkModalState();
        } 
      );
  }
);
