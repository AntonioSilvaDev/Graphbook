import React, {Component} from 'react';

export default class UserBar extends Component {
  render(){
    const {user} = this.props;
    if !user return null;

    return(
      <div className="user">
        <img src={user.avatar} alt="User Photo" />
        <span>{user.username}</span>
      </div>
    )
  }
}
