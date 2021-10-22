import React, { useState } from 'react';
import Error from './error';
import LoginMutation from './mutations/login';
import RegisterMutation from './mutations/signup';

function LoginForm(props) {
  const { login, error } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const logIn = (event) => {
    event.preventDefault();
    login({ variables: { email, password } });
  };

  return (
    <div className="login">
      <form onSubmit={logIn}>
        <label htmlFor="email">
          Email
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label htmlFor="password">
          Password
          <input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <input type="submit" value="Login" />
      </form>
      {error && (
        <Error>
          <p>There was an error logging in!</p>
        </Error>
      )}
    </div>
  );
}

function RegisterForm(props) {
  const { error } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const signUp = (event) => {
    event.preventDefault();

    signup({ variables: { email, password, username } });
  };

  return (
    <div className="signup">
      <form onSubmit={signUp}>
        <label htmlFor="email">
          Email
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label htmlFor="password">
          Password
          <input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <br />
        <label htmlFor="username">
          Username
          <input
            type="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </label>
        <input type="submit" value="Signup" />
      </form>
      {error && (
        <Error>
          <p>There was an error signing in!</p>
        </Error>
      )}
    </div>
  );
}

export default function LoginRegisterForm({ setLoggedIn }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="authModal">
      {showLogin && (
        <LoginMutation setLoggedIn={setLoggedIn}>
          <LoginForm />
          <a onClick={() => setShowLogin(false)}>Want to Sign Up?</a>
        </LoginMutation>
      )}
      {!showLogin && (
        <div>
          <RegisterMutation>
            <RegisterForm />
            <a onClick={() => setShowLogin(true)}>Want to log in?</a>
          </RegisterMutation>
        </div>
      )}
    </div>
  );
}
