import { Link, useNavigate  } from 'react-router-dom';
import Cookies from "universal-cookie";
import { useContext } from 'react';
import { UserContext, UserContextProps} from '../UserContext';
import { config } from '../config/config';

const URL = config.url;

const Navbar: React.FC = () => {
  const { user, setUser } = useContext<UserContextProps>(UserContext);
  const navigate = useNavigate();

  const logout = async () => {
    console.log('Logout button clicked');
    try {
      const response = await fetch(`${URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        const cookies = new Cookies();
        cookies.remove("accessToken", { path: "/", domain: "localhost", secure: true });
        cookies.remove("refreshToken", { path: "/", domain: "localhost", secure: true });
        sessionStorage.clear();
        setUser(null);
        console.log('Logout successful');
        navigate('/')
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const id = sessionStorage.getItem('id');

  return (
    <div className="navbar">
      {user ? (
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
