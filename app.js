//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

//let posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.locals._ = _;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb+srv://fx:3373380mongodb@cluster0.ewlt8jq.mongodb.net/blogPostsDB?retryWrites=true&w=majority");
  const postsSchema = new mongoose.Schema({
    title: String,
    body: String
  });
  const Post = mongoose.model("Post", postsSchema);

  app.get("/", async function(req, res){
    const currentPosts = await Post.find();
    res.render("home", {startingContent: homeStartingContent, posts: currentPosts});
  });
  
  app.get("/about", function(req, res){
    res.render("about", {aboutContent: aboutContent});
  });
  
  app.get("/contact", function(req, res){
    res.render("contact", {contactContent: contactContent});
  });
  
  app.get("/compose", function(req, res){
    res.render("compose");
  });
  
  app.post("/compose", function(req, res){
    const newPost = new Post({
      title: req.body.postTitle,
      body: req.body.postBody
    });
    newPost.save();
    // const post = {
    //   postTitle: req.body.postTitle,
    //   postBody: req.body.postBody,
    //   postTruncate: _.truncate(req.body.postBody, {"length": 300, "omission": "..."})
    // };
    //posts.push(post);
    res.redirect("/");
  });
  
  app.get("/posts/:postID", async function(req,res){
    const requestedID = req.params.postID;
    const foundPost = await Post.findOne({_id: requestedID});
    if(foundPost) {
      res.render("post", {postTitle: foundPost.title, postBody: foundPost.body});
    } else {
      res.send("Not Found");
    }
    // posts.forEach(function(item) {
    //   const storedTitle = _.lowerCase(item.postTitle);
    //   const storedContent = item.postBody;
    //   if(storedTitle === requestedTitle) {
    //     res.render("post", {postTitle: item.postTitle, postBody: storedContent});
    //   }
    // });
  });
  
  


}



app.listen(3000, function() {
  console.log("Server started on port 3000");
});

module.exports = app;
