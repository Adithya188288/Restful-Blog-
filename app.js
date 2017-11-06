//import all npm packages
var express           =   require("express"),
    mongoose          =   require("mongoose"),
    bodyParser        =   require("body-parser"),
    //use method override because a form does not accepts a put request .so overcome thod we keep it as post and override to the put route
    methodOverride    =   require("method-override"),
    //adding sanitizer to make sure script tag dosent run 
    expressSanitizer  =   require("express-sanitizer"),
    //make our app use express
    app = express();
    
    
    
//establish mongoose connection
mongoose.connect("mongodb://localhost/restful_blog");
// setting the default route files
app.set("view engine","ejs");
// added body paser to our app
app.use(bodyParser.urlencoded({extended:true}));
//adding sanitizer to our body
app.use(expressSanitizer());
// telling the app to server the public directory also whenever the app is loaded. 
app.use(express.static("public"));
//telling our app to use method-override
app.use(methodOverride("_method"));
//Blog Schema 
var BlogSchema = new mongoose.Schema({
    
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now()}
});

// wraping up mongoose method for blogSchema

    var Blog = mongoose.model("Blog",BlogSchema);


//creating a single blog element
//  Blog.create(
//      {
//         title: "An Awesome SunRising",
//         image:"https://images4.alphacoders.com/209/thumb-350-209098.jpg",
//         body:"The line is not that big"
//  },function (err , blog)
//  {
//     if(err){
//         console.log("err in creation");
//     }else{
        
//         console.log(blog);
//     }    
     
     
//  });

// home Routes
app.get("/",function(req,res){
   res.redirect("/blogs");
});


// INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
       if(err){
           console.log(" error While getting data");
       } else{
            res.render("index",{blogs:blogs});        
       }
    });
    
});

// NEW ROUTE 
app.get("/blogs/new",function(req,res){
   res.render("new"); 
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
   
  
   req.body.blog.body = req.sanitize(req.body.blog.body);
     
      Blog.create(req.body.blog,function(err,blog){
      if(err){
          res.render("new");
      }else{
          res.redirect("/blogs");
      }
       
   });
    
});

//SHOW ROUTE

app.get("/blogs/:id",function(req,res){
   
   Blog.findById(req.params.id,function(err,blog){
      if(err){
       console.log("error in show route");   
      }
      else{
       res.render("show",{blog:blog});   
      }
   })
    
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
       if(err){
           console.log("error in edit route");
       }else {
            res.render("edit",{blog:blog});       
       }
    });
    
});

//UPDATE Route
app.put("/blogs/:id",function(req,res)

    {
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){
      if(err){
          console.log("error in update route");
      } else{
          res.redirect("/blogs/"+ req.params.id);
      }
   });
});

//DELETE route
app.delete("/blogs/:id",function(req,res){
   
   Blog.findByIdAndRemove(req.params.id,function(err){
      if(err){
          res.redirect("/blogs");
      } else{
        res.redirect("/blogs"); 
      }
   });
    
}); 

//setting the app to listen to particular port and ip
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("The blog Server has started"); 
});

    
