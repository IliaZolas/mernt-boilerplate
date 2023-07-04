import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../components/book-form.css"
import Cookies from "universal-cookie";
import { UserContext } from '../UserContext';
import { config } from '../config/config';

const cookies = new Cookies();

const URL = config.url;

const LoginUser = () => {
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState(false);
    const [token, setToken] = useState('');
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    
// login incorrect, its allowing any type of input to access
    const loginUser = async ( email, password ) => {
        await fetch(`${URL}/login`, {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}` 
        },
        })
        .then( async (response) => { 
            const result = await response.json();
            const userEmail = result.email;
            const userId = result.userId;
            if (userId !== undefined && userEmail !== undefined) {
                cookies.set("TOKEN", result.token, {
                    path: "/"
                    });
                localStorage.setItem('email', userEmail);
                localStorage.setItem('id', userId);
                setEmail();
                setPassword();
                setLogin(true);
                setToken(result.token);
                setUser(result);
            }
        })
        .catch((err) => {
        console.log(err.message , ":error message");
    });
    navigate('/books');
};

const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password);
};

    return (
    <div className="form-container-login fade-page">
        <form method="post" onSubmit={handleSubmit} enctype="multipart/form-data" className="login-form">
            <label className="labels">
                Email
                <input 
                    type="text" 
                    name="email" 
                    placeholder="email"
                    onChange={e => setEmail(e.target.value)} />
            </label>
            <label className="labels">
                Password
                <input 
                    type="text" 
                    name="password" 
                    placeholder="password"
                    onChange={e => setPassword(e.target.value)} />
            </label>
            <input type="submit" value="Submit" className="primary-submit-button" />
        </form>
    </div>
    )
};

export default LoginUser;
