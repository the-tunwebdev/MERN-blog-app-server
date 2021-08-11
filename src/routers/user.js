const express = require('express')
const router  =  new express.Router()
const User  =  require('../models/user')
const auth =  require('../middleware/auth')

const sendmail =  require('../account/account')

router.post('/register', async(req,res)=>{
    
    const user  =  new User(req.body)
    try{
        await user.save()
        

        const token = await user.generateAuthToken()
        sendmail.sendGreeting(user.email,user.name,user.id)

        res.status(201).send({user , token})
    }catch(err){
        res.status(400).send(err)

    }
    

})
router.get('/confirmation/:id',async (req,res)=>{
    const id  = req.params.id
    try{
        const user_id =  await  User.findById(id)
        if(!user_id){
            return res.status(404).send()

        }
        user_id.verified =  true
        await user_id.save()
        res.send(user_id)
        
        return res.redirect('http://localhost:5000/')



    }catch(err){
        res.status(500).send()


    }    
})
router.post('/forget',async (req,res)=>{
    
    try{
        
        const user =  await  User.findOne({email : req.body.email})
        if(!user){
            return res.status(404).send({err : 'email doesnt exist'})

        }
        
        res.send(user)
        sendmail.sendResetPassword(user.email,user.name,user._id)
        
        



    }catch(err){
        res.status(500).send({err: 'err in the server'})


    }    
})
router.get('/resetpass/:id',async (req,res)=>{
    const _id  =  req.params.id
    try{
        const checkid =  await User.findById(_id)
        if(!checkid){
            return res.status(404).send({err : 'id doesnt exist'})

        }
        res.send(checkid)

    }catch(err){
        res.status(500).send({err: 'err in the server'})
    }
})
router.patch('/resetpass/:id', async (req,res)=>{
    const _id = req.params.id
    try{
        
        const checkid =  await User.findById(_id)
        if(!checkid){
            return res.status(404).send({err : 'id doesnt exist'})

        }
        checkid.password = req.body.password
        await checkid.save()
        res.send(checkid)

    }catch(err){
        res.status(500).send({err: 'err in the server'})
    }

    

})
router.post('/login',async(req,res)=>{
    try{
        const user =  await User.findByCredentials(req.body.email, req.body.password)
        
        if(!user.verified === false){
            const token = await user.generateAuthToken()
            
        
            res.send({user , token})


        }else{
            res.status(400).send({error : 'must verify your account'})

        }

        
    }catch(err){
        res.status(400).send({error : 'wrong credentials'})

    }
})

//logout from one session
router.post('/logout',auth , async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send({message : 'logout with sucess'})

    }catch(err){
        res.status(500).send()

    }

})
//logout from all sessions

router.post('/users/logoutAll',auth , async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send({message : 'logout with sucess'})


    }catch(e){
        res.status(500).send()
    }

})
router.get('/users/me',auth,  async (req,res)=>{
    res.send(req.user)
    
})
router.get('/users/:id',async (req,res)=>{
    const id  = req.params.id
    try{
        const user_id =  await  User.findById(id)
        if(!user_id){
            return res.status(404).send()

        }
        res.send(user_id)



    }catch(err){
        res.status(500).send()


    }    
})
router.patch('/users/me',auth , async (req,res)=>{
    const id = req.params.id

    const updates = Object.keys(req.body)
    const allowedUpdates =  ['name','email','password']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
    if(!isValidOperation){
        return  res.status(400).send({error:'invalid updates '})
    }
    try{
       
        updates.forEach((update)=> req.user[update] = req.body[update]
        )
        await req.user.save()
        
        
        res.send(req.user)



    }catch(err){
        res.status(500).send(err)

    }
})
router.delete('/users/me',auth , async (req,res)=>{
    try{
        
        await req.user.remove()
        res.send(req.user)

    }catch(e){
        res.status(500).send()

    }
})

module.exports =  router  