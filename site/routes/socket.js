module.exports = function(io, db){
	var connectedUsers = 0;
  var dateFromObjectId = function (objectId) {
  	return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
  };
  function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }
  function dayDiff(d1, d2) {
    return Math.round((d2-d1)/(1000*60*60*24));
  }

	io.on('connection', function (socket) {
    var today = new Date();
		connectedUsers++;
    io.emit("update-users", connectedUsers);
    // retrieve the most recent record
    db.collection('canvas').find().sort({ _id : -1 }).limit(1)
    .toArray(function(err, results){
      var canvas = null;
			console.log("current canvas count: "+results.length)
      if (results.length!=0){
        var date = dateFromObjectId(results[0]._id.toString());
        console.log(date)
        var diff = dayDiff(date, today);
				console.log("day difference: "+ diff)
        if (diff>7){
          db.collection('canvas').insert({project:null}, function(err, result) {
            if (err) {
                return console.log(new Date(), 'insert error', err);
            }
          });
        }else{
          canvas = results[0].project;
        }
        // console.log(results[0]._id)
        // console.log("canvas"  + canvas);

      }else{
        db.collection('canvas').insert({project:null}, function(err, result) {
            if (err) {
                return console.log(new Date(), 'insert error', err);
            }
        });
      }
      socket.emit("initialization", canvas);
    });

		console.log("socket.io connection established!");
  	socket.on('update', function (canvas) {
  		console.log('broadcast new canvas');
      //save into the most recent record
      db.collection('canvas').find().sort({ _id : -1 }).limit(1)
      .toArray(function(err, results){
				console.log("update canvas:")
				console.log(canvas)
        if (results.length!=0){
          // console.log(results[0]._id)
          db.collection('canvas').update({_id:results[0]._id},
            {
              '$set': { project: canvas }
            }, function(err, result){
              if (err) {
                  return console.log(new Date(), 'insert error', err);
              }
          })
        }
      });

			socket.broadcast.emit('update-canvas', canvas);
		});

		socket.on('disconnect', function(socket){
			connectedUsers--;
			io.emit("update-users", connectedUsers);
		});
	});

}
