import express from 'express';
import ProfilePictureCache from '../Middleware/redis-profile-cache.js';
import RegistrationModel from '../Models/register-model.js';

const router = express.Router();

router.get('/:Username', ProfilePictureCache, (req, res)=>{
    const Username = req.params.Username;
    RegistrationModel.findOne({ Username: Username }).exec().then((response)=>{
        const ProfilePicture = response.ProfilePicture;
        if(ProfilePicture.length >= 10){
            return res.json(ProfilePicture);
        }else{
            return res.json(ProfilePicture);
        }
    }).catch(()=>{
        return res.json({error: true});
    })
})

export default router;