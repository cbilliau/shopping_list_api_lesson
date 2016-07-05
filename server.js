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

Storage.prototype.remove = function(index) {
    return this.items.splice(index, 1);
};

Storage.prototype.edit = function (index, newName) {
		var name = storage.items[index].name;
		Object.defineProperty(storage.items[index], newName, Object.getOwnPropertyDescriptor(storage.items[index], name));
		delete storage.items[index][name];
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
		console.log(storage.items);
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

		// If incorrect data or id does not match a param
    if (!req.params || storage.items[req.params.id] > -1) {
        return res.sendStatus(400);
    }

		// convert id to int
    var id = +req.params.id;

		// iterate over items, if match then call remove func
    storage.items.forEach(function(val, index, arr) {
        if (val.id === id) {
						console.log(index);
            var item = storage.remove(index);
						return res.status(201).json(item);
        }
    });
});

// PUT
app.put('/items/:id', jsonParser, function(req, res) {

	// If incorrect data or id does not match a param
	if (!req.params || storage.items[req.params.id] > -1) {
			return res.sendStatus(400);
	}

	// convert id to int
	var id = +req.body.id;
	var name = req.body.name;
	console.log(id, name);

	// iterate over items, if match then call remove func
	storage.items.forEach(function(val, index, arr) {
			if (val.id === id) {
					var item = storage.edit(index, name);
					return res.status(201).json(item);
			}
	});
});

// Listener
app.listen(process.env.PORT || 8080);
