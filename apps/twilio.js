var assert = require("assert");

var app =  require("../app.js");

// var AtRoot = require("../atSrc/at.js");

var atRoot    = app.atRoot;
var ls        = atRoot.ls;
var namespace = atRoot.namespace;

var twilio    = require("twilio");

var atStore   = app.db.get('@.twilio');

atStore.index("id");

var dead = 
  () =>
  { process.exit(1);
  }

atStore.find({}).then( docs => { ls("documents:", docs); } );

var traveller       = {};
var addTestCallback = {};

atRoot
  .initialiseAtStore(atStore)
  .then
  ( () =>
    { return atStore
        .insert
        ( { "id": "twilio", "sid": "AC13e6155ff75d193c486f166ac7a27b2c", "authToken": "e3a500a97727d0705b41a4863e451cec" }
        )
        .then
        ( result =>
          { console.log("new @.twilio initialised with _id=", result);
          }
        )
    }
  )
  .catch 
  ( error =>
    { ls("ERROR: ", error.toString());
      // assert(false, "atRoot.connectedAtStore was no initialised");
    }
  )
  .then
  ( () => 
    { ls("running connectAtStore");
      
      return atStore
        .find( {"id": "twilio"} )
        .then
        ( docs =>
          { ls("@.twilio", docs);
            if ( (docs.length != 1) || ! docs[0].hasOwnProperty("sid") )
            { ls("@.twilio collection is malformed. Exiting");
              dead();
            }
          }
        )
        .then
        ( () =>
          { return atRoot.connectAtStore(atStore)
          }
        );
    }
  )
  .catch
  ( error => 
    { ls("checking if connected: ", atRoot.connectedAtStore == atStore);
      assert(atRoot.connectedAtStore == atStore);
    }
  )
  .catch 
  ( error =>
    { ls("ERROR: ", error.toString());
    }
  )
  .then
  ( () =>
    { return atStore.insert( { "id": "commitChanges"} );
    }
  )
  .then
  ( () =>
    { var addTestedCallback = function(done, reject)
      { //create a simple adder context that adds 1 to test.x
        namespace (addTestCallback, "traveller");
        addTestCallback.traveller.codeBlock = 
        () =>
        { traveller.traveller.callback = 
            (traveller) => 
            { ls("\n\n\n", "testResults");
              ls("\n  ", "traveller:\n  ", traveller);

              //set final test success value
              var success = true;

              //get the test asset conditions in the traveller
              var conditions = namespace(traveller, "traveller.mocha.assertConditions", null, true);
              //run through conditions, set success to false if any fail
              ls("\n  ","\n  ","traveller.mocha: conditions:");
              for (var key in conditions)
              { var pass      = true;
                var message   = "";
                // var operator  = "==";
                // if (conditions[key].hasOwnProperty("not")) operator = "!=";
                // var left  = [traveller].concat(conditions[key].left)
                // var right = [traveller].concat(conditions[key].right);
                // eval( "pass = namespace.apply(null, left) "+operator+" namespace.apply(null, right)" );
                try
                { eval(conditions[key]);
                }
                catch (e)
                { pass = false;
                  message = ": "+ e.toString();
                }
                if (pass) { pass = "passed"; } else { pass = "failed"; success = false; }
                ls("  " + pass + "  " + key + "  " + message);
                var resultLog = namespace(traveller, "traveller.mocha.results.assertConditions."+key);
                resultLog.pass = pass
                resultLog.message = message;
              }

              //call the customCallback, which can set success too
              // customCallback = namespace(traveller, "traveller.mocha.customCallback", null, true);
              // if (customCallback)
              // { customCallback(traveller, success);
              // }
              // namespace.rm(traveller, "traveller.mocha.customCallback");

              //complete mocha test
              namespace.rm(traveller, "traveller.mocha.assertConditions");
              if (success)
              { namespace.rm(traveller, "traveller.mocha.done")();
              }
              else
              { namespace.rm(traveller, "traveller.mocha.reject")();
              }
            };
        }
        addTestCallback.traveller.codeBlock = addTestCallback.traveller.codeBlock.toString().slice(6);

        // should just pass since there are no conditions given.
        namespace(traveller, "traveller.mocha");

        traveller.traveller.mocha.done    = done;
        traveller.traveller.mocha.reject  = reject;
        traveller.traveller.mocha.assertConditions = 
            { "x==2": "pass = traveller.test.x == 2",
              "x!=3": "pass = traveller.test.x != 3",
            };

        namespace(traveller, "test").x = 2;

        atRoot.traverse(traveller, addTestCallback);
      };

      return new Promise( addTestedCallback );
    }
  )
  .then
  ( () =>
    { return new Promise
      ( (done, reject) =>
        { //going to have to persist some things in the database so we can use a graph to make a graph NICE

          // does this:
          // defines four nodes which make up the "createGraph" graph
          // 1.
          // var createGraph
          // var addNodesToSaveQueue
          // var buildGraph
          // var runInits


          // 2.
          // these lines:
          // createGraph.traveller.exit          = "createGraph.addNodesToSaveQueue";
          // addNodesToSaveQueue.traveller.exit  = "createGraph.buildGraph";
          // buildGraph.traveller.exit           = "createGraph.runInits";

          // set up the branches between the nodes using the hardcoded (since createGraph doesnt exist yet when it is written to the store)


          // 3.
          // then uses the namespace defined by the createGraph graph to nodeDefinitions a graph with three nodes, called: start, printer and end (which dont need hard coded id's because createGraph graph knows what their global unique id's are and can tell them, so that they can use their localNamespace names to refer to each other)


          // 4.
          // this line:
          // adds the createGraph nodes to the atStore namespace, so that the first time the traveller encounters a node, it writes those
          //   objects into the atStore with the hardCoded id's

          // 5. 
          // configures the traveller.mocha namespace to add this test's async "done" function, and the required assertions

          // 6.
          // sets the traveller's suggestedExit to "createGraph" (the hardcoded start point of the not yet existing createGraph graph
          // 7.
          // sends the traveller into the addTestCallback node (which uses the mocha namespace to configure the callback function
          //   whilst the createGraph graph data stored in the atStore namespace is written to the atStore before the addTestCallback
          //   traveler.codeBlock is run, so that when the traveller completes the addTestCallback node, it travells to the
          //   newly written "createGraph" node.
          //    That createGraph node then uses the traveller.createGraph.nodeDefinitions namespace to create a graph
          //    which has the three nodes, start, print, end in it.
          //   then finally the assert conditions placed into the mocha namespace check the traveller.createGraph.results namespace
          //   to see if the createGraph graph has indeed caused the creation of the three nodes.


          // 1.
          var createGraph       = new atRoot.AtNode();
          createGraph.id        = "createGraph"; //awesome :)
          namespace(createGraph, "traveller");
              var codeBlock = 
                () =>
                { var nodeDefinitions = namespace(traveller, "traveller.createGraph.nodeDefinitions", null, true) || [];

                  // this needs to be thought about carefully. Basically the traveller should have to copy the results of the createGraph behaviour pretty quick sharp
                  //   perhaps that is what traveller.results is for? It is writable, by nodes, but acts like a tmp directory.
                  if (nodeDefinitions.length != 0)
                  { namespace(traveller, "traveller.createGraph");
                    traveller.traveller.createGraph.results = {};
                  }

                  nodeDefinitions.forEach
                  ( (nodeDefinition) =>
                    { namespace(traveller, "atRoot");
                      traveller.atRoot[nodeDefinition.name] = { "newAtNode": [] };
                    }
                  );
                };
          createGraph.traveller.codeBlock = codeBlock.toString().slice(6);

          // we can factor this out to work ina single loop, by changing the atStore code to run a promise.All
          var addNodesToSaveQueue = new atRoot.AtNode();
          addNodesToSaveQueue.id        = "createGraph.addNodesToSaveQueue"; //awesome :)
          namespace(addNodesToSaveQueue, "traveller");
              var codeBlock = 
                () =>
                { var nodeDefinitions = namespace(traveller, "traveller.createGraph.nodeDefinitions", null, true) || [];
                  var insertList = [];

                  nodeDefinitions.forEach
                  ( (nodeDefinition) =>
                    { //there must be things in here since because :) namespaces are awesome :)
                      insertList.push(traveller.results.atRoot[nodeDefinition.name])
                    }
                  );
                  if (insertList != [])
                  { namespace(traveller, "atStore");
                    traveller.atStore["createGraph.savedNodes"] = {"insert": [ insertList ]};
                  }
                };
          addNodesToSaveQueue.traveller.codeBlock = codeBlock.toString().slice(6);

          var buildGraph = new atRoot.AtNode();
          buildGraph.id        = "createGraph.buildGraph"; //awesome :)
          namespace(buildGraph, "traveller");
              var codeBlock = 
                () =>
                { var nodeDefinitions = namespace(traveller, "traveller.createGraph.nodeDefinitions", null, true) || [];
                  var graph;
                  var updateList = [];

                  nodeDefinitions.forEach
                  ( (nodeDefinition) =>
                    { graph = namespace(traveller, "traveller.createGraph.results.graph");
                      //there must be things in here since because :) namespaces are awesome :)
                      var name = nodeDefinition.name;
                      var node = graph[name] = traveller.results.atRoot[name];
                      for (var key in nodeDefinition)
                      { namespace(node, key, ["leafNode:"], nodeDefinition[key]);
                      }                        
                    }
                  );
                  for (var name in graph)
                  { node = graph[name];
                    //loop through nodes and set their "exit" to the id's of the newly saved nodes.
                    if (namespace(node, "traveller.exit", null, true) )
                    { node.traveller.exit = graph[node.traveller.exit].id;
                    }
                    traveller.atStore["createGraph.savedNodes."+name] = {"update": [ {"id":node.id}, node ]};

                    //store all the node addresses in this graph in every node, so that they can access each other.
                    // TODO this needs to change so that there is one "graph" node in the store, which has
                    //      has this data in it, and each node on the graph references that "graph" node
                    //      from which they can all look up each other's addresses
                    var addressGraph = namespace(node, "graph");
                    for (var name2 in graph)
                    { addressGraph[name2] = graph[name2].id;
                    }
                  }

                  ls("\n\n\n", "createGraph.buildGraph: results:", graph);
                };
          buildGraph.traveller.codeBlock = codeBlock.toString().slice(6);

          var runInits = new atRoot.AtNode();
          runInits.id  = "createGraph.runInits";
          namespace(runInits, "traveller");
              var codeBlock =
                () =>
                { var graph = traveller.traveller.createGraph.results.graph;

                  for (var name in graph)
                  { var node = context = graph[name];
                    if (node.hasOwnProperty("init") )
                    { eval(node.init);
                    }
                    traveller.atStore["createGraph.initNodes."+name] = {"update": [ {"id":node.id}, node ]};
                  }

                  traveller.traveller.suggestedExit = "commitChanges";
                };
          runInits.traveller.codeBlock = codeBlock.toString().slice(6);

          // 2.
          //link the two nodes into a graph, using namedNodes
          createGraph.traveller.exit          = "createGraph.addNodesToSaveQueue";
          addNodesToSaveQueue.traveller.exit  = "createGraph.buildGraph";
          buildGraph.traveller.exit           = "createGraph.runInits";


          //Once the nodes are saved, we can use the nodeDefinitions to build the graph, by attaching branches using the node id's
          //  We hard code the ID's (i.e. namedNodes) of THESE nodes, because they are the ones we need to build graphs, which we can then namespace automaticeasily

          // 3.
          // Make some Nodes with this stuff
          namespace(traveller, "traveller.createGraph");
          traveller.traveller.createGraph.nodeDefinitions =
          [ { "name"                : "start",
              "traveller.exit"      : "printer",
            },
            { "name"                : "printer",
              "traveller.codeBlock" : "ls('createGraph: printer: ', traveller.test.x); traveller.test.createGraphPrinterRan = true;",
              "traveller.exit"      : "end",
            },
            { "name": "end",
            },
          ];
          
          // 4.
          // at the same time as we install the callback, also save the two nodes we have just made above, into the atStore, so we can traverse to them
          //  using suggestedExit, as below :) #namedNodes #12
          namespace(traveller, "atStore").bootstrapGraphBuilder = { "insert": [ [ createGraph, addNodesToSaveQueue, buildGraph, runInits ] ]};

          // 5.
          //configre the mocha callback
          namespace(traveller, "traveller.mocha");
          traveller.traveller.mocha.done    = done;
          traveller.traveller.mocha.reject  = reject;
          traveller.traveller.mocha.assertConditions = 
          { "createGraph.threeNodesCreated" :
              ` message   = Object.keys(traveller.traveller.createGraph.results.graph);
                pass      = namespace.contains(traveller, "traveller.createGraph.results.graph", ["start", "printer", "end"]);
              `,
          }
          
          //6.
          //exit onto "createGraph" our new node, when the callback is installed (this is gaffy, but will do for now)
          traveller.traveller.suggestedExit = "createGraph";
          //7.
          atRoot.traverse(traveller, addTestCallback);
        }
      )
    }
  );

// dead();