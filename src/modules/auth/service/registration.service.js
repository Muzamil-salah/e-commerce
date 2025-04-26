import Users from '../../../DB/model/User.model.js'


export const signup=async(req,res,next)=>{
try{
    const {name , email, password , confirmationPassword} = req.body;
    if(password !== confirmationPassword){
        return res.status(400).json({message: 'password mismatch confirmation Password!!'})
    }

    // check if there's user with that email
    const ckeckUser=await Users.findOne({email})
    if(ckeckUser){
        return res.status(409).json({message: 'email already exists!!'})
    }

    // now we wil ad user to the database
    const user = await Users.create({name , email , password})

    return res.status(201).json({
        message:'Done',
        Users,
        user
    })
    
}catch(error){
    return res.status(500).json({message:'server error' ,error , msg:error.message })
}
}


export const login=async(req,res,next)=>{
    try{
        const { email, password} = req.body;
    
        // check if user exist
        const user=await Users.findOne({email , password})
        if(!user){
            return res.status(404).json({message: 'In-valid login data'})
        }
        return res.status(200).json({
            message:'Done',
            user
        })
        
    }catch(error){
        return res.status(500).json({message:'server error' ,error , msg:error.message })
    }
    }