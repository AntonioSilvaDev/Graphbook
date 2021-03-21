import React, { useState } from 'react';
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
