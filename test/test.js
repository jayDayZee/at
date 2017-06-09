var assert = require("assert");

var app =  require("../app.js");

// var AtRoot = require("../atSrc/at.js");

var atRoot = app.atRoot;
var atStore = app.atStore;

// atRoot.connectAtStore(atStore);


// console.log(AtRoot);



var testObject = {};
var ls = atRoot.ls;

ls(atRoot);

describe
( "test namespace functions",
  function()
  { var testObject = {};

    describe
    ( "create.nested.namespace.here",
      function()
      { it
        ( "should create a complex object structure using the namespace function",
          function()
          { atRoot.namespace(testObject, "create.nested.namespace.here", ["toReturn = {}", "toReturn = {}", "toReturn = {}", "toReturn = ''"]);
            
            var createdObjectString = JSON.stringify(testObject);
            ls("command: \n", "  ", `atRoot.namespace(testObject, "create.nested.namespace.here", ["toReturn = {}", "toReturn = {}", "toReturn = {}", "toReturn = ''"]);`);
            ls("output: \n" , "  ", createdObjectString);
            
            assert.equal(createdObjectString, `{"create":{"nested":{"namespace":{"here":""}}}}` );
          }
        );
      }
    );

    describe
    ( "extend existing namespace",
      function()
      { it
        ( "extend that namespace with something else",
          function()
          { atRoot.namespace(testObject, "create.nested.alternateNamespace.here", ["toReturn = {}", "toReturn = {}", "toReturn = {}", "toReturn = ''"]);
            
            var createdObjectString = JSON.stringify(testObject);
            ls("command: \n", "  ", `atRoot.namespace(testObject, "create.nested.alternateNamespace.here", ["toReturn = {}", "toReturn = {}", "toReturn = {}", "toReturn = ''"]);`);
            ls("output: \n" , "  ", createdObjectString);
            
            assert.equal(createdObjectString, `{"create":{"nested":{"namespace":{"here":""},"alternateNamespace":{"here":""}}}}` );
          }
        );
      }
    );

    describe
    ( "test namespaceExists true",
      function()
      { it
        ( "",
          function()
          { var result = atRoot.namespaceExists(testObject, "create.nested.alternateNamespace.here");
            assert.equal(result, true);
          }
        );
      }
    );

    describe
    ( "test namespaceExists false",
      function()
      { it
        ( "",
          function()
          { var result = atRoot.namespaceExists(testObject, "create.nested.alternateNamespace.here.should.be.false");
            assert.equal(result, false);
          }
        );
      }
    );

    describe
    ( "test namespace exists using namespace checkExists parameter",
      function()
      { it
        ( "",
          function()
          { var result = atRoot.namespace(testObject, "create.nested.alternateNamespace.here.should.be.false", null, true);
            assert.equal(result, false);
          }
        );
      }
    );

    describe
    ( "test default defaultList",
      function()
      { it
        ( "",
          function()
          { atRoot.namespace(testObject, "create.just.objects");
            result = Object.keys(testObject.create.just.objects).length === 0 && testObject.create.just.objects.constructor === Object;
            assert.equal(result, true);
          }
        );
      }
    );
    describe
    ( "test nonLeafNodes",
      function()
      { it
        ( "",
          function()
          { atRoot.namespace(testObject, "create.using.nonLeafNodes.going.on.forever", ["nonLeafNodes: {'proof':'true'}", "'someFunnyComment'"]);
            console.log("testObject\n  ", JSON.stringify(testObject));
            console.log(testObject.create.using.nonLeafNodes.going.on.forever);
            console.log(testObject.create.using.nonLeafNodes.going.on.proof);
            console.log(testObject.create.using.nonLeafNodes.going.on.forever == "someFunnyComment" && testObject.create.using.nonLeafNodes.going.on.proof);
            var result = 
                (testObject.create.using.nonLeafNodes.going.on.forever == "someFunnyComment") && testObject.create.using.nonLeafNodes.going.on.proof;

            assert.equal(result, "true");
          }
        );
      }
    );
    describe
    ( "test leafNode",
      function()
      { it
        ( "",
          function()
          { atRoot.namespace(testObject, "create.using.leafNode.going.on.for.a.while", ["leafNode: 'someFunnyComment'"]);
            console.log("testObject\n  ", JSON.stringify(testObject));
            console.log(JSON.stringify(testObject.create.using.leafNode.going.on.for.a));
            var result = 
                (testObject.create.using.leafNode.going.on.for.a.while == "someFunnyComment") && JSON.stringify(testObject.create.using.leafNode.going.on.for.a) == `{"while":"someFunnyComment"}` ;

            assert.equal(result, true);
          }
        );
      }
    );
    describe
    ( "test namespace.rm",
      function()
      { it
        ( "",
          function()
          { atRoot.namespace(testObject, "create.using.leafNode.going.on.for.a.while", ["leafNode: 'someFunnyComment'"]);
            console.log("testObject\n  ", JSON.stringify(testObject));
            console.log(JSON.stringify(testObject.create.using.leafNode.going.on.for.a));
            var removed = atRoot.namespace.rm(testObject, "create.using.leafNode.going.on.for.a.while");
            assert
            (     removed =="someFunnyComment"
              &&
                  ! testObject.create.using.leafNode.going.on.for.a.hasOwnProperty("while")
            );
          }
        );
      }
    );
    //First implement them properly. Then make the tests
    // describe
    // ( "test namespace.mv",
    //   function()
    //   { it
    //     ( "",
    //       function()
    //       { atRoot.namespace(testObject, "create.using.leafNode.going.on.for.a.while", ["leafNode: 'someFunnyComment'"]);
    //         console.log("testObject\n  ", JSON.stringify(testObject));
    //         console.log(JSON.stringify(testObject.create.using.leafNode.going.on.for.a));
    //         var removed = atRoot.namespace.rm(testObject, "create.using.leafNode.going.on.for.a.while");
    //         assert
    //         (     removed =="someFunnyComment"
    //           &&
    //               ! testObject.create.using.leafNode.going.on.for.a.hasOwnProperty("while")
    //         );
    //       }
    //     );
    //   }
    // );
    // describe
    // ( "test namespace.rm",
    //   function()
    //   { it
    //     ( "",
    //       function()
    //       { atRoot.namespace(testObject, "create.using.leafNode.going.on.for.a.while", ["leafNode: 'someFunnyComment'"]);
    //         console.log("testObject\n  ", JSON.stringify(testObject));
    //         console.log(JSON.stringify(testObject.create.using.leafNode.going.on.for.a));
    //         var removed = atRoot.namespace.rm(testObject, "create.using.leafNode.going.on.for.a.while");
    //         assert
    //         (     removed =="someFunnyComment"
    //           &&
    //               ! testObject.create.using.leafNode.going.on.for.a.hasOwnProperty("while")
    //         );
    //       }
    //     );
    //   }
    // );
  }
);

describe
( "create a simple node, and move onto persistance",
  function()
  { var context   = new atRoot.AtNode();
    var traveller = new atRoot.AtNode();

    namespace = atRoot.namespace;

    describe
    ( "create value 'x' = 0",
      function()
      { it
        ( "should result in the traveller having traveller.test.x = 0",
          function(done)
          { namespace( context, "traveller.codeBlock")
            context.traveller.codeBlock = 
            ` namespace(traveller, "test.x", ["leafNode: 0"]);
              ls("traveller:\\n  ", traveller)\;
            `;
            
            namespace(traveller, "traveller.callback");
            traveller.traveller.callback = 
              function(traveller)
              { ls("\n\n\n\n", "testResults");
                ls("traveller:\n  ", traveller);
                ls("context:\n  ", context);
                assert.equal(traveller.test.x, 0);
                done();
              };

            atRoot.traverse(traveller, context);
          }
        );
      }
    );

    describe
    ( "persist the traveller and the node, check if they are there",
      function()
      { it
        ( "should put the thing in the database",
          function(done)
          { atStore.insert([ context, traveller ]);
            
            atStore
              .find(context)
              .then
              ( function(docs)
                { ls ("length of contextDocs:", docs.length);

                  atStore.find(traveller)
                  .then
                  ( function(docs2)
                    { ls ("length of traveller docs:", docs2.length);

                      done(assert(docs.length==1 && docs2.length ==1) );                      
                    }
                  )

                }
              );
          }
        );
      }
    );

    describe
    ( "delete the traveller and the context,  check they are not there",
      function()
      { it
        ( "should delete the things from database",
          function(done)
          { atStore.remove(context);
            atStore.remove(traveller);
            
            atStore
              .find(context)
              .then
              ( function(docs)
                { ls ("length of contextDocs:", docs.length);

                  atStore.find(traveller)
                  .then
                  ( function(docs2)
                    { ls ("length of traveller docs:", docs2.length);

                      done(assert(docs.length==0 && docs2.length ==0) );                      
                    }
                  )

                }
              );
          }
        );
      }
    );

    describe
    ( "re add the context to the database",
      function()
      { it
        ( "should put the context in the database",
          function(done)
          { atStore.insert([ context ]);
            
            atStore
              .find(context)
              .then
              ( function(docs)
                { ls ("length of contextDocs:", docs.length);

                  done( assert(docs.length == 1) );                      
                }
              );
          }
        );
      }
    );

    describe
    ( "check there is only on doc in the DB altogether, by looking for ALL documents. Must be the same as the document above. I.e. only the context we just added",
      function()
      { it
        ( "should result in docs.length == 1",
          function(done)
          { atStore
              .find({})
              .then
              ( function(docs)
                { ls ("length of All Docs:", docs.length);
                  ls ("contents of Docs:", docs);

                  done( assert(docs.length == 1) );                      
                }
              );
          }
        );
      }
    );
    
    describe
    ( "connect an unintialised atStore. Should fail",
      function()
      { it
        ( "should result in some atStore sanity check error",
          function(done)
          { atRoot.connectAtStore(atStore)
              .then
              ( () => { done(assert( false, "this should never run" )); }
              )
              .catch 
              ( error =>
                { ls("ERROR: ", error.toString());
                  assert ( error.toString() == "atStore sanity check. docs.length !=1. https://github.com/christopherreay/at/wiki/Errors#atstoreconnect1" );
                  assert ( ! atRoot.connectedAtStore );
                  ls("atRoot.connectedAtStore is still empty");
                  done();
                }
              )
          }
        );
      }
    );

    describe
    ( "initialise the non-empty DB. Should fail",
      function()
      { it
        ( "should result in some atStore initialise sanity check error",
          function(done)
          { atRoot.initialiseAtStore(atStore)
              .then
              ( () => { done(assert( false, "this should never run" )); }
              )
              .catch 
              ( error =>
                { ls("ERROR: ", error.toString());
                  assert ( error.toString() == "atStore sanity check. store not empty. https://github.com/christopherreay/at/wiki/Errors#atstoreinitialise1" )
                  done();
                }
              )
          }
        );
      }
    );

    describe
    ( "delete the context document (to make DB empty for initialisation)",
      function()
      { it
        ( "should leave DB enpty",
          function(done)
          { atStore
              .remove(context)
              .then
              ( () =>
                { atStore
                    .find({})
                    .then
                    ( docs =>
                      { ls("DOCS\n", docs);
                        done(assert(docs.length==0) );                      
                      }
                    ) 
                }
              );
            
          }
        );
      }
    );

    describe
    ( "initialise the NOW empty DB. Should pass, and allow atRoot.connectAtStore",
      function()
      { it
        ( "should result in having a storeID document",
          function(done)
          { atRoot.initialiseAtStore(atStore)
              .then
              ( () => 
                { ls("running connectAtStore");
                  return atRoot.connectAtStore(atStore)
                }
              )
              .then
              ( () => 
                { ls("checking if connected: ", atRoot.connectedAtStore == atStore);
                  done( assert(atRoot.connectedAtStore == atStore) ); 
                }
              )
              .catch 
              ( error =>
                { ls("ERROR: ", error.toString());
                  done( assert(false, "atRoot.connectedAtStore was no initialised") );
                }
              )
          }
        );
      }
    );

    //TODO: replace this with real security testing
    
    describe
    ( "create a node in the database that wraps the monk functionality, and give it a special name. This should FAIL since the atStore is not accessible except through direct access managed by the traverse function",
      function()
      { it
        ( "should find all the documents in the database",
          function(done)
          { var monkContext = {};
            
            namespace( monkContext, "traveller.codeBlock")
            monkContext.traveller.codeBlock = 
            ` var atStoreFunction = namespace(traveller, "traveller.atStore.functionName",    ["leafNode:'find'"]);
              var findParameters  = namespace(traveller, "traveller.atStore.findParameters");
              // var findOptions     = namespace(traveller, "traveller.atStore.findOptions",   ["leafNode:null"]);
              // var findCallback    = namespace(traveller, "traveller.atStore.findCallback",  ["leafNode:null"]);

              try
              { atStore[atStoreFunction].apply(null, findParameters)
                    .then
                    ( function(docs)
                      { traveller.traveller.atStore.result = docs;
                        ls("traveller:\\n  ", traveller);
                      }
                    )
              }
              catch (error)
              { //ls(error);
                ls("ERROR STRING\\n", JSON.stringify(error.toString()) );
                traveller.traveller.atStore.result  = error.toString();
                traveller.traveller.atStore.error   = atStore == null;
              }
              
            `;
            
            
            var monkTraveller = {};
            namespace(monkTraveller, "traveller.atStore");
            monkTraveller.traveller.atStore.findParameters = [ {}, "id" ];

            namespace(monkTraveller, "traveller.callback");
            monkTraveller.traveller.callback = 
              function(completedTraveller)
              { ls("\n\n\n\n", "testResults");
                ls("traveller:\n  ", completedTraveller);
                ls("context:\n  ",   monkContext);
                
                assert
                (   completedTraveller.traveller.atStore.result == "TypeError: Cannot read property 'find' of null"
                  &&
                    completedTraveller.traveller.atStore.error  == true
                );

                done();
              };

            atRoot.traverse(monkTraveller, monkContext);
          }
        );
      }
    );

    describe
    ( "test the built in db access, now in the traverse function. This also has the wonderfulness of allowing a db access call and an eval block in one single pass",
      function()
      { it
        ( "find all, return one single @ root with storeID",
          function(done)
          { var monkTraveller = {"atStore": { "myFirstDBAccess": { "find": [ {} ] } } };

            namespace(monkTraveller, "traveller.callback");
            monkTraveller.traveller.callback = 
              function(completedTraveller)
              { ls("\n\n\n\n", "testResults");
                ls("traveller:\n  ", completedTraveller);
                
                assert
                (   completedTraveller.results.atStore.myFirstDBAccess.length == 1
                  &&
                    completedTraveller.results.atStore.myFirstDBAccess[0].hasOwnProperty("storeID")
                );

                done();
              };

            atRoot.traverse(monkTraveller, {});
          }
        );
      }
    );

    describe
    ( "check if there is only ONE at root id=@ in the db. (there were two when this test was created. This should be a prerequisite sanity check anyway",
      function()
      { it
        ( "deliberately find just that one record, using the id",
          function(done)
          { var monkTraveller = {"atStore": { "thereIsOnlyOne": { "find": [ {"id":"@"} ] } } };

            namespace(monkTraveller, "traveller.callback");
            monkTraveller.traveller.callback = 
              function(completedTraveller)
              { ls("\n\n\n\n", "testResults");
                ls("traveller.results.atStore:\n  ", completedTraveller.results.atStore);
                
                assert
                (   completedTraveller.results.atStore.thereIsOnlyOne.length == 1
                );

                done();
              };

            atRoot.traverse(monkTraveller, {});
          }
        );
      }
    );
  }

);

describe
( "travelling around a graph",
  function()
  { var context   = new atRoot.AtNode();
    var traveller = new atRoot.AtNode();

    namespace = atRoot.namespace;

    describe
    ( "create a single node for the traveller",
      function()
      { it
        ( "should result in the traveller having traveller.test.x = 0",
          function(done)
          { namespace( context, "traveller.codeBlock")
            context.traveller.codeBlock = 
            ` namespace(traveller, "test.x", ["leafNode: 0"]);
              ls("traveller:\\n  ", traveller)\;
            `;
            
            namespace(traveller, "traveller.callback");
            traveller.traveller.callback = 
              function(traveller)
              { ls("\n\n\n\n", "testResults");
                ls("traveller:\n  ", traveller);
                ls("context:\n  ", context);
                assert.equal(traveller.test.x, 0);
                done();
              };

            atRoot.traverse(traveller, context);
          }
        );
      }
    );

    var adder     = new atRoot.AtNode();
    describe
    ( "travel along one branch on a graph",
      function()
      { it
        ( "make traveller.test.x = 1",
          function(done)
          { //create a simple adder context that adds 1 to test.x
            namespace (adder, "traveller.codeBlock");
            adder.traveller.codeBlock = 
            ` traveller.test.x = traveller.test.x + 1;
              ls("traveller:\\n  ", traveller);
            `;
            
            //The idea is that the traveller should automatically follow the id along the graph.
            //  this definately wont work, since its not implemented :)
            // Works now :)
            context.traveller.exit = adder.id;

            namespace(traveller, "traveller.callback");
            traveller.traveller.callback = 
              function(traveller)
              { ls("\n\n\n\ntestResults");
                ls("traveller:\n  ", traveller);
                ls("context:\n  ", context);
                assert.equal(traveller.test.x, 1);
                done();
              };

            atStore
              .insert( adder )
              .then
              ( ()  =>
                { atRoot.traverse(traveller, context);
                }
              );
          }
        );
      }
    );

    var adder2     = new atRoot.AtNode();
    describe
    ( "use the traveller atStore command to add the new adder2 object to the atStore",
      function()
      { it
        ( "make traveller.test.x = 2",
          function(done)
          { //create a simple adder context that adds 1 to test.x
            namespace (adder2, "traveller.codeBlock");
            adder2.traveller.codeBlock = 
            ` traveller.test.x = traveller.test.x + 1;
              ls("traveller:\\n  ", traveller);
            `;
            
            //add adder2 to the atStore using the traveller DB phase
            traveller.atStore = {"add adder2": {"insert":[adder2]} };
            context.traveller.exit = adder2.id;

            namespace(traveller, "traveller.callback");
            traveller.traveller.callback = 
              function(traveller)
              { ls("\n\n\n\ntestResults");
                ls("traveller:\n  ", traveller);
                ls("context:\n  ", context);
                assert.equal(traveller.test.x, 2);
                done();
              };

            atRoot.traverse(traveller, context);
          }
        );
      }
    );

    var addTestCallback = new atRoot.AtNode();
    describe
    ( "make traveller.traveller.callback do stuff and call done",
      function()
      { it
        ( "returns a traveller with its callback set to the passed done function",
          function(done)
          { //create a simple adder context that adds 1 to test.x
            namespace (addTestCallback, "traveller");
            addTestCallback.traveller.codeBlock = 
            ` traveller.traveller.callback = 
                (traveller) => 
                { ls("\\n\\n\\n", "testResults");
                  ls("\\n  ", "traveller:\\n  ", traveller);
                  ls("\\n  ", "context:  \\n  ", context  );
                  var conditions = namespace(traveller, "traveller.mocha.assertConditions", null, true);
                  var success = true;
                  ls("\\n  ","\\n  ","traveller.mocha: conditions:");
                  for (key in conditions)
                  { var pass      = true;

                    var operator  = "==";
                    if (conditions[key].hasOwnProperty("not")) operator = "!=";
                    eval( "pass = namespace.apply(null, conditions[key].left) "+operator+" namespace.apply(null, conditions[key].right)" );
                    if (pass) { pass = "passed"; } else { pass = "failed"; success = false; }
                    ls("  ", key, pass);
                  }
                  namespace.rm(traveller, "traveller.mocha.done")(assert(success));
                };
            `
            
            // should just pass since there are no conditions given.
            namespace(traveller, "traveller.mocha");

            traveller.traveller.mocha.done = done;
            traveller.traveller.mocha.assertConditions = 
                { "x==2": { "left": [traveller, "test.x"], "right": [2] },
                  "x!=3": { "left": [traveller, "test.x"], "right": [3], "not": true } 
                };

            atRoot.traverse(traveller, addTestCallback);
          }
        );
      }
    );

    describe
    ( "test the atRoot access",
      function()
      { it
        ( "Just creates an empty node, and checks that it has an id property",
          function(done)
          { traveller.atRoot = 
            { "myNewNode": { "newAtNode": [] },
            }

            traveller.traveller.mocha.done = done;
            traveller.traveller.mocha.assertConditions["containsNewNode"] = { "left": [traveller, "atRootResults.myNewNode.id"], "right": [null], "not":true }

            atRoot.traverse(traveller, addTestCallback);

          }
        );
      }
    );

    describe
    ( "make a graph, using a traveller config",
      function()
      { it
        ( "should accept sensible config, and build graphs too. Graphs are dependency dependent like",
          function(done)
          { //going to have to persist some things in the database so we can use a graph to make a graph NICE
            var createGraph       = new atRoot.AtNode();
            createGraph.id        = "createGraph"; //awesome :)
            namespace(createGraph, "traveller");
                var codeBlock = 
                  () =>
                  { var nodeDefinitions = namespace(traveller, "traveller.createGraph.nodeDefinitions", null, true) || [];

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

                    nodeDefinitions.forEach
                    ( (nodeDefinition) =>
                      { graph = namespace(traveller, "traveller.createGraph.results.graph");
                        //there must be things in here since because :) namespaces are awesome :)
                        var name = nodeDefinition.name;
                        var node = graph[name] = traveller.results.atRoot[name];
                        for (key in nodeDefinition)
                        { namespace(node, key, ["leafNode:"], nodeDefinition[key]);
                        }                        
                      }
                    );
                    for (name in graph)
                    { node = graph[name];
                      if (namespace(node, "traveller.exit", null, true) )
                      { debugger;
                        node.traveller.exit = graph[node.traveller.exit].id;
                      }
                    }

                    ls("\n\n\n", "createGraph.buildGraph: results:", graph);
                  };
            buildGraph.traveller.codeBlock = codeBlock.toString().slice(6);

            //link the two nodes into a graph, using namedNodes
            createGraph.traveller.exit          = "createGraph.addNodesToSaveQueue";
            addNodesToSaveQueue.traveller.exit  = "createGraph.buildGraph";


            //Once the nodes are saved, we can use the nodeDefinitions to build the graph, by attaching branches using the node id's
            //  We hard code the ID's (i.e. namedNodes) of THESE nodes, because they are the ones we need to build graphs, which we can then namespace automaticeasily

            //Make some Nodes with this stuff
            namespace(traveller, "traveller.createGraph");
            traveller.traveller.createGraph.nodeDefinitions =
            [ { "name"                : "start",
                "traveller.exit"      : "printer",
              },
              { "name"                : "printer",
                "traveller.codeBlock" : "ls('createGraph: printer: ', traveller.test.x)",
                "traveller.exit"      : "end",
              },
              { "name": "end",
              },
            ];
            
            //at the same time as we install the callback, also save the two nodes we have just made above, into the atStore, so we can traverse to them
            //  using suggestedExit, as below :) #namedNodes #12
            traveller.atStore.bootstrapGraphBuilder = { "insert": [ [ createGraph, addNodesToSaveQueue, buildGraph ] ]};

            //configre the mocha callback
            traveller.traveller.mocha.done = done;
            // traveller.traveller.mocha.assertConditions["containsNewNode"] = { "left": [traveller, "atRootResults.myNewNode.id"], "right": [""], "not":true }
            
            //exit onto "createGraph" our new node, when the callback is installed (this is gaffy, but will do for now)
            traveller.traveller.suggestedExit = "createGraph";
            atRoot.traverse(traveller, addTestCallback);

          }
        );
      }
    );

    describe
    ( "create one to ten counter",
      function()
      { it
        ( "should log counting to 0 to 9 ten then complete",
          function(done)
          { 
          }
        );
      }
    );
    // describe
    // ( "create graph builder context",
    //   function()
    //   { it
    //     ( "should accept a traveller defining a graph it would like to construct, and build the graph, and put the result in the traveller",
    //       function(done)
    //       { 
    //       }
    //     );
    //   }
    // );

    //Theres something very narly to do with types going to happen pretty soon. Something about dimensions of travel.
  }
);

describe
  ( "DESTROY THE AT COLLECTION DO NOT DO THIS",
    function()
    { it
      ( "DETROY",
        function(done)
        { atStore.drop().then( () => done() );


        }
      );
    }
  );

describe
  ( "Check the DB is empty",
    function()
    { it
      ( "should find a length of 0 documents in the database",
        function(done)
        { var monkTraveller = {"atStore": { "checkEmptyDB": {"find":[{}]} } };

          namespace(monkTraveller, "traveller.callback");
          monkTraveller.traveller.callback = 
            function(completedTraveller)
            { ls("testResults\n\n\n\n");
              ls("traveller:\n  ", completedTraveller);
              
              ls("completedTraveller.results.atStore.checkEmptyDB.length", completedTraveller.results.atStore.checkEmptyDB.length);
              assert
              (   completedTraveller.results.atStore.checkEmptyDB.length == 0
              );

              done();
            };

          atRoot.traverse(monkTraveller, {});
        }
      );
    }
  );
