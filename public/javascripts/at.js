thePlan = 
{ "waiting": "idle",

  "striationOrder"    : ["violet", "indigo", "blue", "green", "yellow", "orange", "red"],
  "striationLabels"   : ["HardCore", "Infra", "Servo", "Socio", "Produ", "Exa", "Iso"],
  "striationDict"     :
      { "red":    {"name": "Core Holochain Integration",  "rgb": "(255, 0,   0  )", "label": "HardCore" ,   },
        "orange": {"name": "Events Attendance Outreach",  "rgb": "(255, 148, 0  )", "label": "Infra"    ,   },
        "yellow": {"name": "Organizational Outreach",     "rgb": "(255, 255, 0  )", "label": "Servo"    ,   },
        "green":  {"name": "Networking Outreach",         "rgb": "(0,   255, 0  )", "label": "Socio"    ,   },
        "blue":   {"name": "Social Forms Innovation",     "rgb": "(0,   0,   255)", "label": "Produ"    ,   },
        "indigo": {"name": "Design / Strategy Talk",      "rgb": "(255, 0,   255)", "label": "Exa"      ,   },
        "violet": {"name": "Meta / Politics",             "rgb": "(255, 146, 147)", "label": "Iso"      ,   },
      },
  "tabindex": 0,
  "selectedColor": "red",

  // TODO: add hover issue summary
};

$(document).on
( "readystatechange",  
  () =>
  { if (document.readyState == "complete")
    { setTimeout
      ( () =>
        { if ( navigator.userAgent.toLowerCase().indexOf("webkit") == -1 )
          { $("body").html("<strong>ideas for a plan</strong> is currently only built for webkit-* compatible browsers (chromium, google-chrome and safari)");
            return;
          }


          //$('head > title').text("Ideas for a Plan - ideationBoard+");

          thePlan.markDownConverter = new showdown.Converter();

          thePlan.eschatonNaturalHeight = $(".eschaton").get(0).naturalHeight;
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


          // Work out how big the container should be in pixels. This works on chrome onlye
          thePlan.containerHeight = $(window).height() * window.devicePixelRatio;
          $(".thePlanContainer").css( {"height": thePlan.containerHeight-38, "width": thePlan.containerHeight * thePlan.eschatonRatio } );

          $(".thePlanContainer").on
            ( "click", ".dot", 
              (event) => 
              { var clickedDot = $(event.currentTarget).data("positionData");
                if (thePlan.currentDot == clickedDot)
                { if (thePlan.checkModalState())
                  { return;
                  }
                }
                // if (thePlan.checkModalState()) return;
                thePlan.currentDot = clickedDot;
                
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
      if (thePlan.hasOwnProperty("selectedColor") )
      { $(".newIssueColorResponsive").toggleClass(thePlan.selectedColor.color+"3", false);
      }
      thePlan.sideBar.toggleClass("commentList", false);
    }
    
    return toReturn;
  };
thePlan.closeModal = 
  () =>
  { $(".modal").toggleClass("open", false);

  thePlan.fullSizeModalSpinner.toggleClass(thePlan.selectedColor+"7", false)
  thePlan.newIssueTitleField.val("");
  $(".issueTypeColor").toggleClass("selected", false);
  $(".newIssueColorResponsive").toggleClass(thePlan.selectedColor.color+"3", false);
  thePlan.newIssueContainer.appendTo(thePlan.doubleBuffer);
  }

thePlan.openSideBar =
  () =>
  { thePlan.modalState = true;
    
    var dotIdentity = thePlan.currentDot;

    if (thePlan.issues.hasOwnProperty(dotIdentity.dictionaryKey))
    { thePlan.sideBar.toggleClass("commentList", true);
      thePlan.sideBarComponent.toggleClass("open", true);

      //window.open(thePlan.issues[dotIdentity.dictionaryKey].html_url);
      thePlan.newIssueContainer.appendTo(thePlan.doubleBuffer);

      thePlan.fullSizeModalSpinner.toggleClass("open", true).appendTo(thePlan.sideBar);
      thePlan.fullSizeModalSpinner.toggleClass(thePlan.selectedColor.color+"3", true)

      var ajaxOptions = 
      { "method": "POST",
        "url"   : "/",
        "data"  : 
          $.extend
          ( {}, 
            thePlan.currentDot, 
            { "operation": "getIssueComments",
            } 
          ),
        "dataType": "JSON",
      };
      $.ajax("/", ajaxOptions)
        .done
        ( (data) => 
          { console.log(data);
            thePlan.fullSizeModalSpinner.toggleClass("open", false);
            thePlan.fullSizeModalSpinner.toggleClass(thePlan.selectedColor.color+"3", false)
            // $(".issueIframe").attr("src", data.url);
            // var browserUrl = data.html_url;
            
            // thePlan.sideBar.empty();
            if (thePlan.hasOwnProperty("commentSideBarItemContainer"))
            { thePlan.commentSideBarItemContainer.remove();
            }
            thePlan.commentSideBarItemContainer = $("<div class='commentSideBarItemContainer' />");
            $("<div class='issueTitle commentSideBarItem'>" +thePlan.currentDot.issue.title+ "</div>").appendTo(thePlan.commentSideBarItemContainer);
            $("<div class='issueDescription commentSideBarItem'>"+ thePlan.markDownConverter.makeHtml(thePlan.currentDot.issue.body)+"</div>").appendTo(thePlan.commentSideBarItemContainer);

            thePlan.commentsContainer = $("<div class='commentsContainer' />");
            for (var i=0; i<data.length; i++)
            { $("<div class='comment commentSideBarItem'>"+thePlan.markDownConverter.makeHtml(data[i].body)+"</div>").appendTo(thePlan.commentsContainer);
            }

            thePlan.commentSideBarItemContainer.append(thePlan.commentsContainer);
            thePlan.sideBar.append(thePlan.commentSideBarItemContainer);

            var browserUrl = data.html_url;



            $("<div class='openGithubIssue'><div class='externalLinkSymbol' /> </div>")
              .appendTo(thePlan.commentSideBarItemContainer)
              .on
              ( "click",
                () =>
                { window.open(dotIdentity.issue.html_url, "_blank");
                }
              );
            thePlan.sideBar.toggleClass("show", true);
          }
        );

    }
    else
    { 
      if (thePlan.sideBar.hasClass("open"))
      { thePlan.checkModalState();
        return;
      }
      thePlan.sideBarComponent.toggleClass("open", true);


      if (thePlan.hasOwnProperty("commentSideBarItemContainer"))
      { thePlan.commentSideBarItemContainer.appendTo(thePlan.doubleBuffer);
      }

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
  { thePlan.fullSizeModalSpinner  = $("<div class='fullSizeModal spinner modal' />");
  	$("body").append(thePlan.fullSizeModalSpinner.toggleClass("open", true));

  	var ajaxOptions = 
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
            // if ( issue.state == "closed" && issue.body != null)
            //  { thePlan.issues[issue.xy] = issue;
            // } 
            console.log(issue.state);
          }

          thePlan.createDivs();
          thePlan.checkModalState();
          thePlan.fullSizeModalSpinner.toggleClass("open", false);
	        thePlan.fullSizeModalSpinner.toggleClass(thePlan.selectedColor.color+"3", false)
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
          currentDot.toggleClass(dictionaryKey.replace(/:/g, "_"), true);
          if (! thePlan.issues.hasOwnProperty(dictionaryKey) )
          { //currentDot.attr("title", "<input />");
            // currentDot.toggleClass("hasIssue", true);
          }
          else
          { var issue = thePlan.issues[dictionaryKey]
            currentDot.attr("title", "<strong>"+issue.title+"</strong><br><br>"+thePlan.markDownConverter.makeHtml(issue.body));
            var colorIndex = -1;
            if (issue.labels.length > 0)
            { for (var i=0; i<issue.labels.length; i++)
              { var labelIndex = thePlan.striationLabels.indexOf(issue.labels[i].name);
                if ( labelIndex > -1 )
                { colorIndex = 6 - labelIndex;
                  issue.dotColor = thePlan.striationOrder[colorIndex];
                  issue.dotStriationLabel = thePlan.striationLabels[labelIndex];
                  currentDot.toggleClass(issue.dotColor+"3", true);
                }
              }
            }
            if (colorIndex == -1)
            { currentDot.toggleClass("hasIssue", true);
            }
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

    thePlan.doubleBuffer          = $("<div class='doubleBuffer' />");
    
    $("body").append(thePlan.doubleBuffer);
      thePlan.doubleBuffer.append(thePlan.newIssueContainer);


      //issueTypeColorManager
      thePlan.issueTypeColorsContainer.on
          ( "click", ".issueTypeColor", 
            (event) => 
            { thePlan.selectedColor = $(event.currentTarget).data("thePlan.issueTypeColorData");

              $(".issueTypeColor").toggleClass("selected", false);
              $(event.currentTarget).toggleClass("selected", true);
            } 
          );
      thePlan.issueTypeColorsContainer.on
      ( "focus", ".issueTypeColor",
        (event) =>
        { $(".newIssueColorResponsive").toggleClass(thePlan.selectedColor.color+"3", false);
          thePlan.selectedColor = $(event.currentTarget).data("thePlan.issueTypeColorData");
          $(".newIssueColorResponsive").toggleClass(thePlan.selectedColor.color+"3", true);
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
          thePlan.fullSizeModalSpinner.toggleClass(thePlan.selectedColor.color+"3", true)

          var ajaxOptions = 
          { "method": "POST",
            "url"   : "/",
            "data"  : 
                $.extend
                ( {}, 
                  thePlan.currentDot, 
                  { "title":        newIssueTitle,
                    "dotColor":     thePlan.selectedColor.color,
                    "githubLabel":  thePlan.striationDict[thePlan.selectedColor.color].label,
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

                    var issue = data;

                    var dotCSSClass = issue.xy.replace(/:/g, "_");
                    var currentDot  = $("."+dotCSSClass);

                    currentDot.attr("title", "<strong>"+issue.title+"</strong><br><br>"+thePlan.markDownConverter.makeHtml(issue.body));
                    var colorIndex = -1;
                    if (issue.labels.length > 0)
                    { for (var i=0; i<issue.labels.length; i++)
                      { var labelIndex = thePlan.striationLabels.indexOf(issue.labels[i].name);
                        if ( labelIndex > -1 )
                        { colorIndex = 6 - labelIndex;
                          issue.dotColor = thePlan.striationOrder[colorIndex];
                          issue.dotStriationLabel = thePlan.striationLabels[labelIndex];
                          currentDot.toggleClass(issue.dotColor+"3", true);
                        }
                      }
                    }
                    if (colorIndex == -1)
                    { currentDot.toggleClass("hasIssue", true);
                    }
                    var splitLocation = issue.xy.split(":");
                    currentDot.data("positionData", {"striationLabel": issue.dotStriationLabel, "x": splitLocation[1], "y": splitLocation[2], "dictionaryKey": issue.xy, "issue": issue} );
                    currentDot.tooltip({
                        content: function () {
                            return $(this).prop('title');
                        }
                    });

                    thePlan.issues[issue.xy] = issue;

                    // thePlan.fullSizeModalSpinner.hide();
                    thePlan.checkModalState();
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
    thePlan.sideBarCloseButton = 
      $('<div class="sideBarCloseButton">X</div>')
        .on
        ("click",
          (event)=>
          { thePlan.checkModalState();
          }
        )
        .appendTo(thePlan.sideBar);


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
