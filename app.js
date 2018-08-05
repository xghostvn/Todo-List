var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Todo = require('./models/Todo')(mongoose);



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/Todo');

app.listen(3000,()=>{
    console.log('Sever start on port 3000');
    
});

app.set('view engine','hbs');
app.use(express.static('public')); // html css
app.set('views','./views'); // view


app.use( function( req, res, next ) {
    // this middleware will call for each requested
    // and we checked for the requested query properties
    // if _method was existed
    // then we know, clients need to call DELETE request instead
    if ( req.query._method == 'DELETE' ) {
        // change the original METHOD
        // into DELETE method
        req.method = 'DELETE';
        // and set requested url to /user/12
        req.url = req.path;
    }else {
        if(req.query._method=='PUT'){
            req.method='PUT';
            req.url=req.path;
        }
    }       
    next(); 
});

app.get('/',(req,res)=>{
    var messages = [];

    Todo.find().then((result)=>{
      
            if(!result){

          
             messages.push("Nothing on Todo list");
            }else {
              
                  for(var i=0;i<result.length;i++){
                      messages.push(result[i]);
                  }

                  res.render('index',{

                    messages:messages
            
                });
            }
  
   

    }).catch((err)=>{
            messages.push("Nothing on Todo list");
    });


  

});


app.post('/add/todo',(req,res)=>{
        var todo = new Todo({
            name : req.body.name,
            createAt : Date.now()
        });
        todo.save().then((result)=>{
           
                if(!result){
                    console.log(result);
                    return Promise.reject();
                }else {
                    console.log(req.body);
                    res.redirect('/');
                }
        }).catch((err)=>{
            console.log('Cannot save todo ');
            res.status(404).send();
        });
});

app.delete('/todo/:id',(req,res)=>{

    var id = req.params.id;

    Todo.remove({_id : id}).then((result)=>{

            if(!result){
                 return Promise.reject();
            }else {
                    res.redirect('/');
            }

    }).catch((err)=>{
            res.status(404).send();
    });

});

app.put('/todo/:id',(req,res)=>{

        var body = req.body;

        Todo.updateOne({'_id':body._id},{
            $set:{'name':body.name}
        },{new : true}).then((result)=>{

                if(!result){
                    return Promise.reject();
                }else {
                        res.redirect('/');
                }




        }).catch((err)=>{
                res.status(404).send();
        });



});


