const express = require('express');

const server = express();
server.use(express.json());
var count = 0;
var projects = [];

//MIDDLEWARE

server.use((req,resp,next) => {
    count++;
    console.log(`Req number ${count}`);
    return next();
})

server.use('/projects/:id', (req,resp,next) => {
    const {id} = req.params;
    var found = false;
    for(var i =0; i<projects.length;i++){
        if(projects[i].id==id) found = true;
    }
    if(!found) return resp.json({error: "ID NOT FOUND"});
    return next();
})



//GET

server.get('/projects', (req,res) =>{
    return res.json(projects);
})

//POST
    //ADD PROJECT
server.post('/projects', (req,res) => {
    var errTasks = false;
    const {id} = req.body;
    const {title} = req.body;
    if(id==null) return res.json({error: "ID cannot be null"});
    if(title==null) return res.json({error: "Title cannot be null"});
    if(req.body.tasks != undefined) {
        if(Array.isArray(req.body.tasks)){
            var tasks = req.body.tasks;
        }
        else {
            var tasks = [];
            errTasks = true;
        }
    }
    else {
        var tasks = [];
        errTasks = true;
    }
    var idAlreadyExists = false;
    for(var i =0; i<projects.length;i++){
        if(projects[i].id==id) idAlreadyExists = true;
    }
    if(!idAlreadyExists){
        projects.push({"id": id, "title":title, "tasks": tasks})
        if(!errTasks) return res.json(projects);
        else return res.json({projects: projects, tasksError: errTasks});
    }else return res.json({error: "ID already exists!"});
})
    //ADD TASK
server.post('/projects/:id/tasks', (req,res)=>{
    const {id} = req.params;
    const {title} = req.body;
    if(!Number.isInteger(parseFloat(id))) return res.status(400).json({err: "ID must be integer"});
    if(title==null)return res.status(400).json({err: "Title cannot be null"});
    var found = -1;
    for(var i=0;i<projects.length;i++){
        if(projects[i].id==id){
            projects[i].tasks.push(title);
            found = i;
        }
    }
    if(found==-1){
        return res.status(404).json({error: "Project not found!"});
    }else{
        return res.json(projects[found]);
    }

})

//DELETE
    server.delete('/projects/:id', (req,res) => {
        const {id} = req.params;
        var index = -1;
        for(var i=0; i<projects.length; i++){
            if(id==projects[i].id) index = i;
        }
        console.log(index);
        projects.splice(index,1);
        return res.json(projects);
    })

    //DELETE TASK
    server.delete('/projects/:id/tasks/:tid', (req,res) => {
        const {id} = req.params;
        const {tid} = req.params;
        var index = -1;
        for(var i=0; i<projects.length; i++){
            if(id==projects[i].id) index = i;
        }
        projects[index].tasks.splice(tid,1);
        return res.json(projects);
    })

//PUT

    server.put('/projects/:id', (req,res) => {
        const {id} = req.params;
        const {title} = req.body;
        var index = -1;
        for(var i=0; i<projects.length; i++){
            if(id==projects[i].id) index = i;
        }
        projects[index].title = title;
        return res.json(projects);
    })









server.listen(3000);