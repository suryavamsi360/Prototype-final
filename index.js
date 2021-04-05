const { request, response } = require('express');
const Joi = require("joi");
const express = require('express');  
const app=express();

app.use(express.json());
const port=process.env.PORT||3000

const courses=[
    {   id:1,name:'course1'},
    {   id:2,name:'course2'},
    {   id:3,name:'course3'}
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

//GET a specific course
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

//UPDATE a course
app.put('/api/courses/:id',(request,response)=>{
    //NOT FOUND 404
    const course=courses.find(c=>c.id===parseInt(request.params.id));
    if(!course) return response.status(404).send("The course is not available");
    //VALIDATE
    const {error} =validateCourse(request.body);
    if(error) return response.status(400).send(error.details[0].message)
    
    //Everything is fine, so update
    course.name=request.body.name;
    response.send(course)

});

//DELETE
app.delete('/api/courses/:id',(request,response)=>{
    //If not exits 404 not found
    const course=courses.find(c=>c.id===parseInt(request.params.id));
    if(!course) return response.status(404).send("The course is not available");
     
    const index=courses.indexOf(course);
    courses.splice(index,1);

    response.send(course)
});



function validateCourse(course){
    const schema ={
        name:Joi.string().min(3).required()
    }
    return Joi.validate(course,schema);
}

