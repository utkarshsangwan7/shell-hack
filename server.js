const express= require('express');
const app= express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use('/code',require('./routes/code'));

app.get('/',(req,res)=>{
    res.send("Helo World");
})

app.listen(port,()=>{
    console.log(`server started on ${port}`)
})