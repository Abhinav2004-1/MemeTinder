import express from 'express';
import RegistrationModel from '../Models/register-model.js';
import redis from 'redis';
const cache = redis.createClient();

const router = express.Router();

router.post('/:Username', (req, res)=>{
    console.log(true);
    const ProfilePicture = req.body.ProfilePicture;
    const Username = req.params.Username;
    const MainPost = req.body.MainPost;
    RegistrationModel.findOne({Username}, (err, response)=>{
        if(!err){
            if(ProfilePicture.length >= 10 && MainPost.length >= 10){
                response.ProfilePicture = ProfilePicture;
                response.MainPost = MainPost;
                response.save().then(()=>{
                    cache.set(`profile-pic/${Username}`, ProfilePicture, ()=>{
                        console.log('added')
                        return res.json({profile_added: true});
                    })
                })
            }else{
                return res.json({invalid_pictures: true})
            }
        }else{
            return res.json({error: true});
        }
    })
})

export default router;