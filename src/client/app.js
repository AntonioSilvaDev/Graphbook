import React, { useState, useEffect } from 'react';
// Webpack take the css, bundles and minifys it using the css rules in webpack,
// Doing this instead of putting in the head tag of the index.html, convienient!!
import '../../assets/css/style.css';
import { Helmet } from 'react-helmet';
import LoginRegisterForm from './components/loginregister';
import SearchBar from './components/bar/index';
import Feed from './feed';
import Chats from './chats';
import './components/fontawesome';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (token) {
      setLoggedIn(true);
    }
  });

  return (
    <div className="container">
      {loggedIn ? (
        <>
          <Helmet>
            <title>Graphbook - Feed</title>
            <meta name="description" content="Newsfeed of all your friends on Graphbook" />
          </Helmet>
          <SearchBar />
          <Feed />
          <Chats />
        </>
      ) : (
        <LoginRegisterForm setLoggedIn={setLoggedIn} />
      )}
    </div>
  );
}
