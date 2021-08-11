const express = require('express')
const router  =  new express.Router()
const Fav  =  require('../models/addtofav')
const auth = require('../middleware/auth')
const Task = require('../models/blog')
router.post('/', auth , async(req,res)=>{
    //const tasks = new Task(req.body)
    const checkPost = await Task.findOne({ title : req.body.title , description : req.body.description,imageUrl: req.body.imageUrl})
    
    
    if(checkPost){
        const fav = new Fav ({
            ...req.body,
            _id :  req.body.id,
            owner  : req.user._id
        })
        try{
            await fav.save()
    
            res.status(201).send(fav)
    
        }catch(err){
            res.status(400).send({error : 'please authenticate'})
    
        }

    }else{
        res.status(400).send({error : 'post not found'})
    }

    
    

    
})


router.get('/favblog',auth ,  async(req,res)=>{
    try{
        const match  =  {}
        
        
        await req.user.populate({
            path : 'favs',
            match,
           
        }).execPopulate()
        //http://localhost:5000/tasks?limit=2
        res.send(req.user.favs)

    }catch(err){
        res.status(500).send(err)

    }
})

router.delete('/favblog/:id', auth , async (req,res)=>{
    const id  = req.params.id
    try{
        const fav = await Fav.findOneAndDelete({ _id : id})
        if(!fav){
            return res.status(404).send({err : 'err'})

        }
        res.send(fav)


    }catch(e){
        res.status(500).send({err : 'server'})

    }
})
module.exports = router