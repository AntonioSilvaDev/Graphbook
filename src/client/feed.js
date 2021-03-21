import React from 'react';
// Webpack take the css, bundles and minifys it using the css rules in webpack,
// Doing this instead of putting in the head tag of the index.html, convienient!!
import '../../assets/css/style.css';
import FeedList from './components/post/feedlist';
import PostsQuery from './components/queries/postsFeed';
import AddPostMutation from './components/mutations/addPost';
// import compose from 'lodash.flowright';
import PostForm from './components/post/form';

export default function Feed() {
  const queryVariables = { page: 0, limit: 10 };

  return (
    <div className="container">
      <AddPostMutation variable={queryVariables}>
        <PostForm />
      </AddPostMutation>
      <PostsQuery>
        <FeedList />
      </PostsQuery>
    </div>
  );
}
