const  express=require("express");
const ejs = require("ejs");
const bodyParser =require("body-parser");

const app=express();


app.set('view engine', 'ejs');


//this help us in sending data in body using form_urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(express.static("public"));   



const mongoose=require("mongoose");

 mongoose.set('strictQuery', true);

// const { stringify } = require("querystring");
// app.use(express.json());


mongoose.connect("mongodb://127.0.0.1:27017/wikidb",
{


useNewUrlParser:true,
useUnifiedTopology:true
// },(err)=>{
// if(!err)
// {
//     console.log("connected to db")
// }

// else
// {
//     console.log(err)
// }
 })

 const articleSchema={
    title:String,
    content:String
 };

//making modal
 const Article=mongoose.model("Article",articleSchema);


 
   app.route("/articles")
///////////////////////////////////////////REQUIEST FOR ALL DATA 
   .get(function(req,res){
    Article.find((err,foundArticles)=>{
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }

  
    })
})


.post(function(req,res){
    console.log(req.body.title),
    console.log(req.body.content)

   const newArticle= new Article({
       title:req.body.title,
       content:req.body.content
   })

       newArticle.save(function(err){
           if(!err){
               res.send("Successfully added a new article.")
           }else{
               res.send(err);
           }
       });
   })
   
   
   .delete(function(req,res){
    Article.deleteMany(function(err){
     if(!err){
         res.send("Sucessfully deleted all articles")
     }else{
         res.send(err);
     }
    })

})

/////////////////////////////REQUIEST FOR A PARTICULAR DATA 

app.route("/articles/:articleTitle")
.get(function(req,res){

Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if (foundArticle){
        res.send(foundArticle);
    }else{
        res.send("No articles matching that title was found");
    }
})
})

.put(function(req,res){
    Article.findOneAndUpdate(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content}, 
       
        {overwrite:true},
        function(err){
      if(!err){
        res.send("successfully updated artitle.");
      }else{
        res.send(err);
      }

        }
          

    )
})

.patch(function(req,res){
    Article.updateOne(
        {title:req.params.articleTitle},
       // for set value {$set:{content:"",title:""}}, 

       {$set:req.body}, 
       
        
        function(err){
      if(!err){
        res.send("successfully updated artitle.");
      }else{
        res.send(err);
      }

        }
          

    )
})


      

app.listen(3000,()=>{
    console.log("port is running at 3000")
    })