//IMPORTING MODULES
const { request, response } = require('express');
const Joi = require("joi");
const express = require('express');  
//Strarting the express server and setting up the port
const app=express();

app.use(express.json());
const port=process.env.PORT||3000
//Creating a temporary data to work with
const courses=[
    {   id:1,name:'Machine Learning/AI'},
    {   id:2,name:'Computer Networking'},
    {   id:3,name:'OS'},
    {   id:4,name:'Data Sciences'},
    {   id:5,name:'Software testing'},
    {   id:6,name:'Data Structure and Algorithms'},
    {   id:7,name:'JAVA'},
    {   id:8,name:'DBMS'},
    {   id:9,name:'React JS/Web Technologies'},
    {   id:10,name:'Software Design'}
]
app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})


//GET default page
app.get('/',(request,response)=>{
    response.send("Hello World");
});

//GET all courses
app.get('/api/courses',(request,response)=>{
    response.send(courses);
});

//GET a specific course based on id
app.get('/api/courses/:id',(request,response)=>{
    const course=courses.find(c=>c.id===parseInt(request.params.id));
    if(!course) return response.status(404).send("The course is not available");
    response.send(course);
});

//POST a course
app.post('/api/courses',(request,response)=>{

    const {error} =validateCourse(request.body);
    if(error) return response.status(400).send(error.details[0].message);
    
    const course={
        id:courses.length+1,
        name:request.body.name
    };
    courses.push(course);
    response.send(course);

});

//UPDATE a course based on id
app.put('/api/courses/:id',(request,response)=>{
    //NOT FOUND 404
    const course=courses.find(c=>c.id===parseInt(request.params.id));
    if(!course) return response.status(404).send("The course is not available");
    //VALIDATE the entry
    const {error} =validateCourse(request.body);
    if(error) return response.status(400).send(error.details[0].message)
    
    //If Everything is fine, update the value
    course.name=request.body.name;
    response.send(course)

});

//DELETE based on id
app.delete('/api/courses/:id',(request,response)=>{
    //If not found with the specified id, 404 not found
    const course=courses.find(c=>c.id===parseInt(request.params.id));
    if(!course) return response.status(404).send("The course is not available");
     
    const index=courses.indexOf(course);
    courses.splice(index,1);

    response.send(course)
});


//Validation to make sure user entered a valid course name
function validateCourse(course){
    const schema ={
        name:Joi.string().min(3).required()
    }
    return Joi.validate(course,schema);
}

