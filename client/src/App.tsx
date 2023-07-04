import React from 'react';
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
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import { UserContext } from "./UserContext";
import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { config } from './config/config';

const URL = config.url;
console.log("URL shown in App.js",URL)
console.log("What environment has been detected? :)", process.env.NODE_ENV)

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('id');

    if (id !== null) {
      console.log("condition true")
    fetch(`${URL}/user/show/${id}`, {
        method: 'GET',
        })
        .then((response) => response.json())
        .then((data) => {
            setUser(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
    }},
    []);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <Router>
      <UserContext.Provider value={value}>
        <div className="App">
          <Navbar />
          <Routes>
            <Route 
                path="/" 
                element={<Home />} 
                />
              <Route 
                path="/books" 
                element={<Books />} 
              />
              <Route 
                path="/book/show/:id" 
                element={<ShowBook />} 
                />
              <Route 
                path="/signup" 
                element={<AddUser />} 
                />
              <Route 
                path="/login" 
                element={<LoginUser />} 
                />
              <Route element={<ProtectedRoutes/>}>
                <Route
                  path="/new-book" 
                  element={
                    <NewBook />   
                  }
                  />
                <Route
                  path="/book/update/:id" 
                  element={
                    <UpdateBook />
                  }
                  />
                <Route
                  path="/user/show/:id" 
                  element={
                    <ShowUser />
                  }
                />
                <Route
                  path="/user/update/:id" 
                  element={
                    <UpdateUser />
                  }
                  />
              </Route>
          </Routes>
        </div>
      </UserContext.Provider>
    </Router>
  );
};

export default App;