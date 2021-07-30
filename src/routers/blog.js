const express = require('express')
const router  =  new express.Router()
const Task  =  require('../models/blog')
const auth = require('../middleware/auth')
router.post('/addblog', auth , async(req,res)=>{
    //const tasks = new Task(req.body)
    const tasks = new Task ({
        ...req.body,
        owner  : req.user._id
    })
    try{
        await tasks.save()

        res.status(201).send(tasks)

    }catch(err){
        res.status(400).send(err)

    }
    

    
})
router.get('/',auth ,  async(req,res)=>{
    try{
        const match  =  {}
        
        const tasks = await  Task.find({})
        
        res.send(tasks)

    }catch(err){
        res.status(500).send(err)

    }
})
//find blog post using id
router.get('/blog/:id',auth ,  async (req,res)=>{
    const _id  = req.params.id
    try{
        //const task_id = await Task.findById(id)
        const task = await Task.findOne({_id , owner : req.user._id})
        if(!task){
            return res.status(404).send()

        }
        res.send(task)

    }catch(err){
        res.status(500).send()

    }
   
}) 
router.get('/me',auth ,  async(req,res)=>{
    try{
        const match  =  {}
        
        
        await req.user.populate({
            path : 'tasks',
            match,
           
        }).execPopulate()
        //http://localhost:5000/tasks?limit=2
        res.send(req.user.tasks)

    }catch(err){
        res.status(500).send(err)

    }
})

router.patch('/blog/:id',auth ,async (req,res)=>{
    
    const updates = Object.keys(req.body)
    const allowedUpdates =  ['title' ,'imageURL', 'description']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
    if(!isValidOperation){
        return  res.status(400).send({error:'invalid updates '})
    }
    try{
        const task = await Task.findOne({ _id :  req.params.id , owner : req.user._id})
       
        
        
        //const update = await Task.findByIdAndUpdate(id, req.body, {new : true , runValidators :true})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=> task[update] = req.body[update]
        )
        await task.save()
        
        res.send(task)



    }catch(err){
        res.status(500).send(err)

    }
})
router.delete('/blog/:id', auth , async (req,res)=>{
    const id  = req.params.id
    try{
        const task = await Task.findOneAndDelete({ _id : id , owner : req.user._id})
        //const task  =  await Task.findOneAndDelete(id)
        if(!task){
            return res.status(404).send()

        }
        res.send(task)


    }catch(e){
        res.status(500).send()

    }
})
module.exports = router