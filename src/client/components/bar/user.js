import React from 'react';

export default function UserBar({ user }) {
  if (!user) return null;
  const { avatar, username } = user;

  return (
    <div className="user">
      <img src={avatar} alt="User" />
      <span>{username}</span>
    </div>
  );
}
