import { useContext, useState, FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { config } from '../config/config';

const URL = config.url;

const LoginUser: React.FC = () => {
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    function isError(err: any): err is Error {
        return err instanceof Error;
    }
    
    const loginUser = async () => {
        try {
            const response = await fetch(`${URL}/login`, {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: "include",
            });
        
            if (response.ok) {
                const result = await response.json();
                const userEmail = result.email;
                const userId = result.userId;
                const passwordCheck = result.passwordCheck;
        
                if (userId !== undefined && userEmail !== undefined && passwordCheck !== false) {
                    sessionStorage.setItem('email', userEmail);
                    sessionStorage.setItem('id', userId);
                    setEmail('');
                    setPassword('');
                    setUser(result);
                    navigate('/books', { state: { token: result.token } });
                } else {
                    handleFailedLogin();
                } 
            }
        } catch (err) {
            if (isError(err)) {
                console.log("login has failed")
                console.log("An unknown error occurred:", err);
            }
        }
    };

    const handleFailedLogin = () => {
        setErrorMessage("Login failed, password or email incorrect");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await loginUser();
    };

    return (  
            <div className="form-container-login">
                <form method="post" onSubmit={handleSubmit} encType="multipart/form-data" className="login-form">
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
                            type="password" 
                            name="password" 
                            placeholder="password"
                            onChange={e => setPassword(e.target.value)} />
                    </label>
                    <div className="error-message">{errorMessage}</div>
                    <input type="submit" value="Submit" className="primary-submit-button" />
                </form>
            </div>
    );
};

export default LoginUser;
