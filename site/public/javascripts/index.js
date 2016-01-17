paper.install(window);

var app = angular.module('myApp', [], function($interpolateProvider) {
          $interpolateProvider.startSymbol('<%');
          $interpolateProvider.endSymbol('%>');
  })
  .run(function($rootScope){
    //	paper initialization
    paper.setup("canvas");
    // paper.settings.handleSize = 7;
    // paper.settings.hitTolerance = 5.0;

  })
app.controller('AppCtrl', function($scope, $sce) {
  $('.shape').shape();
  $('.popup').popup();
  $('.image').popup();
  $('.shape').shape();
  $scope.flipBack = function(){
    $('.shape').shape('flip back');
  }
  //background
  // The amount of symbol we want to place;
  var count = 50;

  // Create a symbol, which we will use to place instances of later:
  var path = new Path.Circle({
  	center: [0, 0],
  	radius: 5,
  	fillColor: 'red',
  	strokeColor: 'white'
  });

  var symbol = new Symbol(path);
  var particles = [];
  // Place the instances of the symbol:
  for (var i = 0; i < count; i++) {
  	// The center position is a random point in the view:
  	var center = Point.random() * view.size;
  	var placed = symbol.place(center);
    particles.push(placed);
  	placed.scale(i / count + 0.001);
  	placed.data.vector = new Point({
  		angle: Math.random() * 360,
  		length : (i / count) * Math.random() / 5
  	});
  }

  var vector = new Point({
  	angle: 45,
  	length: 0
  });

  var mouseVector = vector.clone();



  // The onFrame function is called up to 60 times a second:
  view.onFrame = function onFrame(event) {
  	vector = vector.add(mouseVector.subtract(vector).divide(30));

  	// Run through the active layer's children list and change
  	// the position of the placed symbols:
  	for (var i = 0; i < count; i++) {
  		var item = particles[i];
  		var size = item.bounds.size;
  		var length = vector.length / 10 * size.width / 10;
  		item.position = item.position.add(vector.normalize(length).add(item.data.vector));
  		keepInView(item);
  	}
  }

  function keepInView(item) {
  	var position = item.position;
  	var viewBounds = view.bounds;
  	if (position.isInside(viewBounds))
  		return;
  	var itemBounds = item.bounds;
  	if (position.x > viewBounds.width + 5) {
  		position.x = -item.bounds.width;
  	}

  	if (position.x < -itemBounds.width - 5) {
  		position.x = viewBounds.width;
  	}

  	if (position.y > viewBounds.height + 5) {
  		position.y = -itemBounds.height;
  	}

  	if (position.y < -itemBounds.height - 5) {
  		position.y = viewBounds.height
  	}
  }
  // create a drawing tool
  var tool    = new Tool();
  tool.name   = "penTool";
  colors = ['#F38181', '#FCE38A', '#EAFFD0', '#95E1D3'];

  tool.on({
    mousedown: function(event){
    },
    mousedrag: function(event){
      color = _.sample(colors, 1);
      var radius = event.delta.length / 2;
      var circle = new Path.Circle(event.middlePoint, radius);
      circle.fillColor = color;
    },
    mouseup: function(event){
      socket.emit('update', project.exportJSON());
    },
    mousemove:function(event){
    }
  });
  tool.activate();

});
