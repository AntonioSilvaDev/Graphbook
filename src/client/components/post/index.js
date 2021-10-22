import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PostHeader from './header';
import PostContent from './content';
import PostForm from './form';
import UpdatePostMutation from '../mutations/updatePost';

export default function Post(props) {
  const { post } = props;
  const [editing, setEditing] = useState(false);

  return (
    <div className={`post ${post.id < 0 ? 'optimistic' : ''}`}>
      <PostHeader post={post} changeState={setEditing} />
      {!editing && <PostContent post={post} />}
      {editing && (
        <UpdatePostMutation post={post}>
          <PostForm changeState={setEditing} />
        </UpdatePostMutation>
      )}
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
