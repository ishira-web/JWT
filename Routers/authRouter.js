import express from 'express'


const router = express.Router();

router.post('/signup', (req,res)=>{
    res.json({message : "Signup Successfully"})
});


export default router;