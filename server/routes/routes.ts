//for simplicity we will put book and user routes in the same file though it is
//normal to seperate these routes into their own book-routes.js and user-routes.js
//files 

const express = require('express')
const routes = express.Router()
const newUserTemplateCopy = require('../models/users')
const newBookTemplateCopy = require('../models/books')
const Books = require('../models/books')
const Users = require('../models/users')
const cloudinary = require('cloudinary')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./auth");


// Index Routes

routes.get('/', (req, res) => {
    res.send('Hello world');
})

// User Routes

routes.post('/signup', (req, res) =>{

    bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
    const user = new newUserTemplateCopy({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hashedPassword,
        imageUrl: req.body.imageUrl,
        public_id: req.body.publicId
    })

    user
        .save()
        .then((result) => {
        res.status(201).send({
            message: "User Created Successfully",
            result,
        });
        })
        .catch((error) => {
        res.status(500).send({
            message: "Error creating user",
            error,
        });
        });
    })
    .catch((e) => {
    res.status(500).send({
        message: "Password was not hashed successfully",
        e,
    })
    })
})


routes.post('/login', (req, res) => {
    console.log("login route triggered")

        Users.findOne({ email: req.body.email })
        .then((user) => {
            console.log("user object:",user)
        bcrypt
            .compare(req.body.password, user.password)
            .then((passwordCheck) => {
                console.log("password check object:", passwordCheck)
                if(!passwordCheck ) {
                    console.log( "No password provided")
                }
                const token = jwt.sign(
                    {
                    userId: user._id,
                    userEmail: user.email,
                    },
                    "RANDOM-TOKEN",
                    { expiresIn: "24h" }
                )
                res.status(200).send({
                    message: "Login Successful",
                    email: user.email,
                    userId: user._id,
                    token,
                })
            })
            .catch((error) => {
            res.status(400).send({
                message: "Passwords do not match",
                error,
            });
            });
        })
        .catch((e) => {
        res.status(404).send({
            message: "Email not found",
            e,
        })
        })
    
})


routes.get('/user/show/:id', (req, res) => {
    const userId = req.params.id;
    console.log("GET SINGLE USER RECORD:", userId)

    
    Users.findOne({_id: userId})
    .then(data => res.json(data))
})

routes.put('/user/update/:id', auth, (req, res) => {
    const userId = req.params.id
    console.log("update user id route", userId)

    Users.updateOne({_id: userId},
        {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        imageUrl: req.body.imageUrl,
        public_id: req.body.publicId
        })
        .then(data => res.json(data))

})

routes.delete('/user/delete/:id', (req, res) => {
    const userId = req.params.id
    console.log(userId,":delete route")

    Users.deleteOne({_id: userId}, function (err, _result) {
        if (err) {
            res.status(400).send(`Error deleting listing with id ${userId}!`);
        } else {
            console.log(`${userId} document deleted`);
        }
    })
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET
    })

    const publicId = req.params.public_id
    console.log("cloudinary check public_id for delete:", publicId)
    
    cloudinary.v2.uploader
            .destroy(publicId)
            .then(result=>console.log("cloudinary delete", result))
            .catch(_err=> console.log("Something went wrong, please try again later."))

})

// Book Routes

// Cloudinary
routes.post('/book/upload', (req,res) => {
    
})

routes.post('/book/add', (req, res) =>{
    const newBook = new newBookTemplateCopy({
        title:req.body.title,
        description:req.body.description,
        imageUrl: req.body.imageUrl,
        public_id: req.body.publicId,
        user: req.body.user 
    })
    newBook.save()
    .then(data =>{
        res.json(data)
        console.log("Send request successful:", data)
    })
    .catch(error => {
        res.json(error)
        console.log("Send request failed", error)
    }) 
})

routes.get('/books/show/:id', (req, res) => {
        const bookId = req.params.id
        console.log("GET SINGLE RECORD:", bookId)

        Books.findOne({_id: bookId})
        .then(data => res.json(data))
        
})

routes.get('/books', (req, res) => {
    Books.find()
    .then(data => res.json(data))
})

routes.put('/book/update/:id',auth, (req, res) => {
    const bookId = req.params.id
    console.log(bookId, "update book id route")

    Books.updateOne({_id: bookId},
        {
        title:req.body.title,
        description:req.body.description,
        imageUrl: req.body.imageUrl,
        public_id: req.body.publicId 
        })
        .then(data => res.json(data))
})

routes.delete('/book/delete/:id/:public_id/user/:user_id', auth, async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Books.findById(bookId);

        if (!book) {
        return res.status(404).json({ msg: 'Book not found' });
        }

        const bookUser = book.user.toString();
        const loggedInUser = req.params.user_id;
        console.log("do these numbers match?:", bookUser ,":", loggedInUser)

        // Check if the user is allowed to delete the book
        if (bookUser !== loggedInUser) {
        return res.status(401).json({ msg: 'Not authorized to delete this book' });
        }

        await Books.deleteOne(book);

        cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET
        })

        const publicId = req.params.public_id
        console.log("cloudinary check public_id for delete:", publicId)

        cloudinary.v2.uploader
        .destroy(publicId)
        .then(result => console.log("cloudinary delete", result))
        .catch(err => console.log("Something went wrong, please try again later.", err))

        res.json({ msg: 'Book deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = routes