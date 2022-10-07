import { FC, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './style.css';
import { getTokenFromUrl, loginUrl } from '../Spotify/Spotify';

interface Props{
  sendToken: (token: string) => void
}

const Login:FC <Props> = ({ sendToken }) => {
  const [token, setToken] = useState<undefined | string>();

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = '';
    const _token = hash.access_token;

    if (_token) {
      setToken(_token);
    }
  }, []);

  switch (typeof(token)) {
    case "undefined":
      return (
        <div id='loginContainer'>
          <img 
            id="spotifyLoginLogo"
            src={`${process.env.PUBLIC_URL}/assets/Spotify_Logo_RGB_Green.png`} 
            alt="spotifylogo"
          />
          <a className="loginBtn" href={loginUrl}>Login with Spotify</a>
        </div>
      );

      // TODO: create a more intuitive access screen
    case "string":
      return (
        <div id='loginContainer'>
          <img 
            id="spotifyLoginLogo"
            src={`${process.env.PUBLIC_URL}/assets/Spotify_Logo_RGB_Green.png`} 
            alt="spotifylogo"
          />
          <Link onClick={() => {sendToken(token)}} className="loginBtn access" to="/home">Click here to Access Spotify</Link>
        </div>
      )
  }
}

export default Login;