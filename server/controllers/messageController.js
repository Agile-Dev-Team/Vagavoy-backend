import mongoose from "mongoose";

import User from "../models/user.js";
import Message from "../models/message.js";
import user from "../models/user.js";
import message from "../models/message.js";

const findUsers = async (req, res) => {
    const search = req.params.searchText;
    const userId = req.params.userId;
    const filteredUsers = await User.find({
        "email": {
            "$regex": search,
            '$options': 'i'
        }
    });
    let users = [];
    for (let k = 0; k < filteredUsers.length; k++) {
        const message = await Message.find({
            'receiverId': userId,
            'senderId': filteredUsers[k]._id
        }).exec();
        let user = {
            id: filteredUsers[k]._id,
            name: filteredUsers[k].mainInfo.name,
            avatar: filteredUsers[k].profileImage
        }
        if (message && message.length > 0) {
            user['unreadNumber'] = message.filter(item => item.isWatched === false).length;
            user['content'] = message[message.length - 1].content;
            user['time'] = message[message.length - 1].time;
        }
        users.push(user);
    }
    res.status(200).json(users);
}

const getUser = async (id) => {
    return await User.findById(id);
}

const getAddress = async (req, res) => {
    const userId = req.params.id;
    const messages = await Message.find({
        $or: [{
                'receiverId': userId
            },
            {
                'senderId': userId
            }
        ]
    })
    let users = [];
    for (let k = 0; k < messages.length; k++) {
        if (messages[k].senderId.toHexString() === userId) {
            if (users.filter(item => item.id === messages[k].receiverId.toHexString()).length === 0) {
                let user = await getUser(messages[k].receiverId.toHexString());

                users.push({
                    id: messages[k].receiverId.toHexString(),
                    name: user.mainInfo.name,
                    content: messages[k].content,
                    time: messages[k].time,
                    unreadNumber: 0
                })
            } else {
                users.map(item => {
                    let newUser = {
                        ...item,
                        content: messages[k].content,
                        time: messages[k].time,
                        unreadNumber: 0
                    };
                    return newUser;
                })
            }
        } else {
            if (users.filter(item => item.id === messages[k].senderId.toHexString()).length === 0) {
                let user = await getUser(messages[k].senderId.toHexString());
                
                users.push({
                    id: messages[k].senderId.toHexString(),
                    name: user.mainInfo.name,
                    content: messages[k].content,
                    time: messages[k].time,
                    unreadNumber: messages[k].isWatched ? 0 : 1
                })
                
            } else {
                users.forEach(element => {
                    if(element.id === messages[k].senderId.toHexString()){
                        element.content = messages[k].content;
                        element.time = messages[k].time;
                        element.unreadNumber += 1;
                    }
                });
            }
        }
    }
    console.log(users);
    res.status(200).json(users);
}
const getMessages = async (req, res) => {
    //await Message.deleteMany();
    const {
        userId,
        partnerId
    } = req.body;
    const messages = await Message.find({
        $or: [{
                'receiverId': userId,
                'senderId': partnerId
            },
            {
                'senderId': userId,
                'receiverId': partnerId
            }
        ]
    });
    for (let k = 1; k < messages.length; k++) {
        if(messages[k].receiverId.toHexString() === userId){
            await Message.findByIdAndUpdate(messages[k]._id.toHexString(),{isWatched: true})
        }
    }
    if (messages.length === 0) {
        res.status(200).json([]);
        return;
    }
    
    const data = [
        {
            date:messages[0].time.toISOString().split('T')[0],
            messagePack: [{
                direction: userId === messages[0].senderId.toHexString() ? true : false,
                message: [{
                    content: messages[0].content,
                    time: messages[0].time
                }]
            }]
        }
    ];
    for (let k = 1; k < messages.length; k++) {
        
        let date = messages[k].time.toISOString().split('T')[0];
        if(date === messages[k-1].time.toISOString().split('T')[0]){
            if (messages[k].senderId.toHexString() === messages[k - 1].senderId.toHexString()) {
                data[data.length - 1].messagePack[data[data.length - 1].messagePack.length-1].message.push({
                    content: messages[k].content,
                    time: messages[k].time
                })
            } else {
                data[data.length - 1].messagePack.push({
                    direction: userId === messages[k].senderId.toHexString() ? true : false,
                    message: [{
                        content: messages[k].content,
                        time: messages[k].time
                    }]
                })
            }
        }
        else{
            data.push({
                date:messages[k].time.toISOString().split('T')[0],
                messagePack: [{
                    direction: userId === messages[k].senderId.toHexString() ? true : false,
                    message: [{
                        content: messages[k].content,
                        time: messages[k].time
                    }]
                }]
            })
        }
        
    }
    // console.log('getmessages-', data);
    res.status(200).json(data);

}
const messageController = {
    findUsers,
    getAddress,
    getMessages,

}

export default messageController;