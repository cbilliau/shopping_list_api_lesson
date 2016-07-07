var express = require('express');

var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {
        name: name,
        id: this.id
    };
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.remove = function(targetId) {

		var targetIndex;

		// Iterate over arr (items) objs & indexes
		var targetItem = this.items.find(function(currentItem, currentIndex)	{

			// var = true is obj (item) id match targetId
			var answer = (currentItem.id === targetId);

			// if var is true, indx of obj (item) in arr (items) = targetIndex
			if (answer) {
				targetIndex = currentIndex;
				return answer
			}
		})

		// if targetIndex <> undef then remove that obj
		if (targetIndex !== undefined) this.items.splice(targetIndex, 1);

		return targetItem;
};

Storage.prototype.edit = function (targetId, targetName) {

		var targetIndex;

		var targetItem = this.items.find(function(currentItem, currentIndex)	{
			var answer = (currentItem.id == targetId);
			if (answer) {
				targetIndex = currentIndex;
				return answer
			}
		})

		// if targetIndex <> undef then replace name
		if (targetIndex !== undefined) this.items[targetIndex].name = targetName;

		return targetItem;
};


var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();

app.use(express.static('public'));

// GET
app.get('/items', function(req, res) {
    res.json(storage.items);

});

// POST
app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

// DELETE
app.delete('/items/:id', jsonParser, function(req, res) {

		// make id an int
		var id = +req.params.id;
		// call remove func with id
		var item = storage.remove(id);

		// if item exists
		if (item) {
			// send back item
			return res.status(201).json(item);
		} else {
			// else send 404
      return res.sendStatus(404).json("Item not found.");
		}
});

// PUT
app.put('/items/:id', jsonParser, function(req, res) {

		// convert id to int
		var id = +req.body.id;
		// assign name to var
		var name = req.body.name;
		// call edit func with id and name
		var item = storage.edit(id, name);

		// if item exists
		if (item) {
			// send back item
			return res.status(200).json(item);
		} else {
			// else send 404
			return res.sendStatus(404).json("Item not found.");
		}
});


// Listener
app.listen(process.env.PORT || 8080);

// Export

exports.app = app;
exports.storage = storage;
