module.exports =(mongoose) =>{

    var TodoSchema = mongoose.Schema({

            name : {type :String,required:true},
            createAt : {type:Date}

    });      


    return mongoose.model('Todo',TodoSchema);

};