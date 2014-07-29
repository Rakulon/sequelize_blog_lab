var express = require("express"),
db = require("./models/index.js"),
app = express();

app.set("view engine", "ejs")
app.get("/authors/:id", function(req, res) {
	db.author.find(req.params.id).success(function(author){
		db.post.findAll({ where: {authorId: author.id} }).success(function(posts) {
			res.render("index", {author: author, posts: posts})
		})
	})
})

app.listen(3000, function(){
	console.log("server listening on port 3000")
})