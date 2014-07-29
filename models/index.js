var fs        = require('fs')
  , path      = require('path')
  , Sequelize = require('sequelize')
  , lodash    = require('lodash')
  , env       = process.env.NODE_ENV || 'development'
  , config    = require(__dirname + '/../config/config.json')[env]
  , sequelize = new Sequelize(config.database, config.username, config.password, config)
  , db        = {}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})


// Associations

db.author.hasMany(db.post);
db.post.belongsTo(db.author);

db.author.create({name: "William"});
db.post.create({name: "I write the stuff"})
  .success(function(post){
    db.author.find({where: {name: "William"}}).success(function(author){
      console.log(author)
      author.setPosts([post])
        .success(function(author){
         console.log(author)
      })
    });
});


module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db)