import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import './App.css';
import Navbar from './components/navbar';
import Home from './pages/home';
import Books from './pages/books';
import NewBook from './pages/addBook';
import UpdateBook from './pages/updateBook';
import ShowBook from './pages/ShowBook';
import AddUser from './pages/signup';
import LoginUser from './pages/login';
import ShowUser from './pages/showUser';
import UpdateUser from './pages/updateUser';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import { User, UserContext, UserContextProps } from './UserContext';
import { config } from './config/config';
import "./styles/main.scss"

const URL = config.url;

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem('id');
  
    if (id) {
      fetch(`${URL}/user/show/${id}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.authenticated) {
            setUser(data);
          } else {
            console.log('User not authenticated');
          }
        })
        .catch((err) => {
          console.error(err.message);
        });
    }
  }, []);

  const value: UserContextProps = useMemo(
    () => ({ user, setUser: setUser as Dispatch<SetStateAction<User | null>> }),
    [user, setUser]
  );

  return (
    <Router>
      <UserContext.Provider value={value}>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/book/show/:id" element={<ShowBook />} />
            <Route path="/signup" element={<AddUser />} />
            <Route path="/login" element={<LoginUser />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/new-book" element={<NewBook />} />
              <Route path="/book/update/:id" element={<UpdateBook />} />
              <Route path="/user/show/:id" element={<ShowUser />} />
              <Route path="/user/update/:id" element={<UpdateUser />} />
            </Route>
          </Routes>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
