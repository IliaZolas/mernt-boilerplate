import {Link} from 'react-router-dom';
import './navbar.css';
import Cookies from "universal-cookie";
import { useContext } from 'react';
import { UserContext } from '../UserContext';

const Navbar = () => {
    const { user, setUser } = useContext(UserContext);

    const logout = () => {
        const cookies = new Cookies();
        cookies.remove("TOKEN", { path: "/" });
        localStorage.clear();
        // isLoggedIn(false);
        setUser(null);
        };
    
    const id = localStorage.getItem('id');

    return (
        <div className="navbar">
            {user  ? (
            <div className="navbar logged-in">    
                <div className="navitems">
                    <div className="nav-item">
                        <Link to="/books" className="item">
                            Books
                        </Link>
                    </div>
                    <div className="nav-item">
                        <Link to="/new-book" className="item">
                            Add a book
                        </Link>
                    </div>
                    <div className="user-navitem">
                        User
                        <div className='nav-dropdown'>
                            <div className="dropdown-item">
                                <Link to={`/user/show/${id}`} className="item-in-dropdown">
                                    Profile
                                </Link>
                            </div>
                            <div className="dropdown-item"> 
                                <a href='/' onClick={() => logout()} className="item-in-dropdown">
                                    Logout
                                </a>    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="navitems">
                <div className="nav-item">
                    <Link to="/" className="item">
                        Home
                    </Link>
                </div>
                <div className="nav-item">
                    <Link to="/login" className="item">
                        Login
                    </Link>
                </div>
                <div className="nav-item nav-cta">
                    <Link to="/signup" className="item">
                        Signup
                    </Link>
                </div>
            </div>
        )}
        </div>
    );
};

export default Navbar;