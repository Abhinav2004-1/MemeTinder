import express from 'express';
import redis from 'redis';
import RequestCache from '../Middleware/redis-request-cache.js';
import RegisterModel from '../Models/register-model.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const cache = redis.createClient();

router.get('/:Username', RequestCache, (req, res)=>{
    const Username = req.params.Username;
    RegisterModel.find().where("Username").equals(Username).then((response)=>{
        if(response.length === 1){
            cache.set(`friend-req/${Username}`, JSON.stringify(response[0].Requests), ()=>{
                return res.json(response[0].Requests);
            })
        }else{
            cache.set(`friend-req/${Username}`, JSON.stringify({no_requests: true}), ()=>{
                return res.json({no_requests: true});
            })
        }
    })
})

router.put('/', (req, res)=>{
    const YourName = req.body.YourName;
    const FriendName = req.body.FriendName;
    const YourProfile = req.body.YourProfile;

    RegisterModel.findOne({ Username: FriendName }).exec().then((receiver)=>{
        const receiver_data = [...receiver.Requests];
        const data_redundancy = receiver_data.findIndex((element)=>{
            return element.sender === YourName;
        })
        if(data_redundancy === -1){
            receiver_data.push({sender: YourName, ProfilePicture: YourProfile});
            receiver.Requests = receiver_data;
            cache.set(`friend-req/${FriendName}`, JSON.stringify(receiver_data), ()=>{
                receiver.save().then(()=>{
                    return res.json({ request_sent: true });                    
                })
            })
        }else{
            return res.json({ request_redundant: true });
        }
    }).catch(()=>{
        return res.json({error: true});
    })

})

router.post('/', (req, res)=>{
    const MyName = req.body.MyName;
    const RequestName = req.body.RequestName;
    RegisterModel.findOne({ Username: MyName }).exec().then((profile)=>{
        const Requests = profile.Requests.filter(element=> element.sender !== RequestName)
        profile.Requests = Requests;
        cache.set(`friend-req/${MyName}`, JSON.stringify(profile.Requests), ()=>{
            profile.save().then(()=>{
                return res.json({request_removed: true});
            })
        });
    }).catch(()=>{
        return res.json({error: true});
    })
})

export default router;