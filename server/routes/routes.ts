import express, { Request, Response } from 'express';
import { Router } from 'express';
import newUserTemplateCopy from '../models/users';
import newBookTemplateCopy from '../models/books';
import Books from '../models/books';
import Users from '../models/users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import authMiddleware from './auth';

const routes: Router = express.Router();

routes.get('/', (req: Request, res: Response) => {
res.send('Hello world');
});

routes.get('/check-auth', (req: Request, res: Response) => {
    const accessToken = req.cookies.accessToken;
    console.log("access token:", accessToken)
    
        if (!accessToken) {
            return res.status(401).json({ authenticated: false });
            }
            
            jwt.verify(accessToken, 'accessTokenSecret', (err: any, decoded: any) => {
            if (err) {
                return res.status(403).json({ authenticated: false });
            }
        
            const userId = decoded.userId;
            const userEmail = decoded.userEmail;

            res.status(200).json({
                authenticated: true,
                userId: userId,
                userEmail: userEmail,
            });
        });
    });

// User Routes
routes.post('/signup', (req: Request, res: Response) => {
    bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
        const user = new newUserTemplateCopy({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hashedPassword,
        imageUrl: req.body.imageUrl,
        public_id: req.body.publicId,
        });

        user
        .save()
        .then((result) => {
            res.status(201).send({
            message: 'User Created Successfully',
            result,
            });
        })
        .catch((error) => {
            res.status(500).send({
            message: 'Error creating user',
            error,
            });
        });
    })
    .catch((e) => {
        res.status(500).send({
        message: 'Password was not hashed successfully',
        e,
        });
    });
});

routes.post('/login', (req: Request, res: Response) => {
    console.log('login route triggered');

    Users.findOne({ email: req.body.email })
        .then((user) => {
        console.log('user object:', user);

        if (!user) {
            res.status(404).send({
            message: 'Email not found',
            });
            return;
        }

        bcrypt
            .compare(req.body.password, user.password)
            .then((passwordCheck) => {
            console.log('password check object:', passwordCheck);

            if (passwordCheck === false) {
                console.log('No password provided or wrong password');
                res.status(200).send({
                    message: 'Login Failed',
                    email: user.email,
                    userId: user._id,
                    passwordCheck
                });
            } else {

                const refreshToken = jwt.sign(
                    {
                        userId: user._id,
                        userEmail: user.email,
                    },
                    'refreshTokenSecret',
                    { expiresIn: '7d' } 
                );

                const accessToken = jwt.sign(
                    {
                        userId: user._id,
                        userEmail: user.email,
                        refreshToken: refreshToken,
                    },
                    'accessTokenSecret',
                    { expiresIn: '24h' }
                );
                console.log("login route: token ->",accessToken)
                console.log("Login route: refreshToken ->",refreshToken)
                
                res.cookie("accessToken", accessToken, {
                    httpOnly: true, 
                    sameSite: "none",
                    secure: true, 
                    maxAge: 300000,
                });
                
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 300000,
                });
                
                res.status(200).send({
                    message: 'Login Successful',
                    email: user.email,
                    userId: user._id,
                    accessToken,
                    refreshToken
                });
            }
            })
            .catch((error) => {
            res.status(400).send({
                message: 'Passwords do not match',
                error,
            });
            });
        })
        .catch((e) => {
        res.status(500).send({
            message: 'An error occurred',
            error: e,
        });
        });
    });  

routes.post('/logout', (req, res) => {
        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'none', secure: true, path: '/' });
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true, path: '/' });
        res.status(200).json({ message: 'Logout successful' });
    });

routes.get('/user/show/:id', authMiddleware, (req: Request, res: Response) => {
    const userId = req.params.id;
    console.log('GET SINGLE USER RECORD:', userId);

    Users.findOne({ _id: userId }).then((data) => res.json(data));
    });

routes.put('/user/update/:id', authMiddleware, (req: Request, res: Response) => {
    const userId = req.params.id;
    console.log('update user id route', userId);

    Users.updateOne(
    { _id: userId },
    {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        imageUrl: req.body.imageUrl,
        public_id: req.body.publicId,
    }
    ).then((data) => res.json(data));
    });

routes.delete('/user/delete/:id', authMiddleware, (req: Request, res: Response) => {
    const userId = req.params.id;
    console.log(userId, ':delete route');
    
    Users.deleteOne({ _id: userId }, function (err: Error | null, _result: any) {
        if (err) {
        res.status(400).send(`Error deleting listing with id ${userId}!`);
        } else {
        console.log(`${userId} document deleted`);
        }
    });
    
    cloudinary.v2.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET,
    });
    
    const publicId = req.params.public_id;
    console.log('cloudinary check public_id for delete:', publicId);
    
    cloudinary.v2.uploader
        .destroy(publicId)
        .then((result) => console.log('cloudinary delete', result))
        .catch((_err) => console.log('Something went wrong, please try again later.'));

    res.clearCookie('accessToken', { httpOnly: true, sameSite: 'none', secure: true, path: '/' });
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true, path: '/' });
    res.status(200).json({ message: 'Logout successful' });

    });
    

// Book Routes

routes.post('/book/add', authMiddleware, (req: Request, res: Response) => {
    const newBook = new newBookTemplateCopy({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    public_id: req.body.publicId,
    user: req.body.user,
    });
    newBook
    .save()
    .then((data) => {
        res.json(data);
        console.log('Send request successful:', data);
    })
    .catch((error) => {
        res.json(error);
        console.log('Send request failed', error);
    });
    });

routes.get('/books/show/:id', authMiddleware, (req: Request, res: Response) => {
    const bookId = req.params.id;
    console.log('GET SINGLE RECORD:', bookId);

    Books.findOne({ _id: bookId }).then((data) => res.json(data));
    });

routes.get('/books', (req: Request, res: Response) => {
    Books.find().then((data) => res.json(data));
    });

routes.put('/book/update/:id', authMiddleware, (req: Request, res: Response) => {
    const bookId = req.params.id;
    console.log('update book id route', bookId);

    Books.updateOne({ _id: bookId },
    {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        public_id: req.body.publicId,
    }
    ).then((data) => res.json(data));
    });

routes.delete('/book/delete/:id/:public_id/user/:user_id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const bookId = req.params.id;
        const book = await Books.findById(bookId);

        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        const bookUser = book.user.toString();
        const loggedInUser = req.params.user_id;
        const loggedInUserTest = req.params;
        console.log('do these numbers match?:', bookUser, ':', loggedInUser);

        // Check if the user is allowed to delete the book
        if (bookUser !== loggedInUser) {
            return res.status(401).json({ msg: 'Not authorized to delete this book' });
        }

        await Books.deleteOne({ _id: bookId });

        cloudinary.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
        });

        const publicId = req.params.public_id;
        console.log('cloudinary check public_id for delete:', publicId);

        cloudinary.v2.uploader
            .destroy(publicId)
            .then((result) => console.log('cloudinary delete', result))
            .catch((err) => console.log('Something went wrong, please try again later.', err));

        res.json({ msg: 'Book deleted' });
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server Error');
    }
});

export default routes;
