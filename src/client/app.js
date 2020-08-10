import React from 'react';
// Webpack take the css, bundles and minifys it using the css rules in webpack,
// Doing this instead of putting in the head tag of the index.html, convienient!!
import '../../assets/css/style.css';
import { Helmet } from 'react-helmet';
import Feed from './feed';
import Chats from './chats';
import client from './apollo';

export default function App() {
  return (
    <div className="container">
      <Helmet>
        <title>Graphbook - Feed</title>
        <meta name="description" content="Newsfeed of all your friends on Graphbook" />
      </Helmet>
      <Feed />
      <Chats />
    </div>
  );
}
