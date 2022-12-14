import { FC, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Components/Util/muiThemes';
import Header from './Components/Header/Header';
import LeftSideBar from './Components/LeftSideBar/LeftSideBar';
import Footer from './Components/Footer/Footer';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import Artists from './Components/Artists/Artists';
import { spotifyAPI } from './Components/Spotify/Spotify';
import {
  currPlaylistAlbumInterface,
  dataHomePageInterface
} from './Components/Util/modals';

import useRetrieveToken from './Components/Util/useRetrieveToken';
import pullHomePageData from './Components/APICalls/pullHomePageData';
import Playlists from './Components/Music/Playlists';
import Search from './Components/Search/Search';

const App: FC = () => {
  const [token, setToken] = useState<any>();
  // TODO: fix the any type for user (SpotifyApi.CurrentUsersProfileResponse)
  const [user, setUser] = useState<any>();
  const [auth, setAuth] = useState<boolean>(false);

  const _dataHomePageInterface = {} as dataHomePageInterface;
  const [dataHomePage, setDataHomePage] = useState<dataHomePageInterface>(
    _dataHomePageInterface
  );

  const currPlaylistInterface = {} as currPlaylistAlbumInterface;
  const [currPlaylistAlbum, setCurrPlaylistAlbum] = useState<any>({
    currPlaylistInterface
  });

  const [spotifyURI, setSpotifyURI] = useState<string>('');
  const [playlistAlbumKey, setPlaylistAlbumKey] = useState<string>('');

  const [artistID, setArtistID] = useState<string>('');

  // on mount, take token from url and store in state to be used for SpotifyAPI authentication
  useEffect(() => {
    const _token = useRetrieveToken();

    if (_token) {
      setToken(_token);
      // sets the access token to be used for API calls
      spotifyAPI.setAccessToken(_token);
      spotifyAPI
        .getMe()
        .then((u) => {
          setUser(u);
        })
        .then(() => {
          async function pullHPData() {
            const data: any = await pullHomePageData(user, _token);
            setDataHomePage(data);
          }
          pullHPData();
        });
    }
  }, []);

  const accessSite = (authStatus: boolean) => {
    setAuth(authStatus);
  };

  const handleTrackPress = (spotifyURI: string, key: string) => {
    setSpotifyURI(spotifyURI);
    setPlaylistAlbumKey(key);
  };

  // handles playlist click from Home page
  const handlePlaylistClick = (value: SpotifyApi.PlaylistObjectSimplified) => {
    setCurrPlaylistAlbum({
      image: value.images[0].url,
      type: value.type,
      name: value.name,
      owner_name: value.owner.display_name,
      totalTracks: value.tracks.total,
      uri: value.uri,
      urlID: value.id
    });
  };

  // TODO: Interface for value below
  const handleAlbumClick = (value: any) => {
    setCurrPlaylistAlbum({
      image: value.images[0].url,
      type: value.type,
      name: value.name,
      owner_name: value.artists[0].name,
      totalTracks: value.total_tracks,
      uri: value.uri,
      urlID: value.id
    });
  };

  const handleArtistClick = (artistID: string) => {
    setArtistID(artistID);
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <div id="left">
          {auth ? (
            <LeftSideBar
              dataPlaylist={dataHomePage.dataHomePagePlaylist}
              handlePlaylistClick={handlePlaylistClick}
            />
          ) : null}
          <div>
            {auth ? <Header /> : null}
            <Routes>
              <Route
                path=""
                element={<Login token={token} accessSite={accessSite} />}
              />
              {auth ? (
                <>
                  <Route
                    path="/home"
                    element={
                      <Home
                        user={user}
                        handlePlaylistClick={handlePlaylistClick}
                        handleArtistClick={handleArtistClick}
                        dataHomePage={dataHomePage}
                      />
                    }
                  />
                  <Route
                    path="/playlist"
                    element={
                      <Playlists
                        currPlaylistAlbum={currPlaylistAlbum}
                        token={token}
                        handleTrackPress={handleTrackPress}
                        handleAlbumClick={handleAlbumClick}
                        handleArtistClick={handleArtistClick}
                      />
                    }
                  />
                  <Route
                    path="/artists"
                    element={
                      <Artists
                        artistID={artistID}
                        token={token}
                        handleTrackPress={handleTrackPress}
                        handleAlbumClick={handleAlbumClick}
                      />
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <Search
                        token={token}
                        handleArtistClick={handleArtistClick}
                        handleAlbumClick={handleAlbumClick}
                      />
                    }
                  />
                </>
              ) : (
                <Route
                  path=""
                  element={<Login token={token} accessSite={accessSite} />}
                />
              )}
              {/* page not found route */}
              <Route
                path="*"
                element={<Login token={token} accessSite={accessSite} />}
              />
            </Routes>
          </div>
        </div>
        {auth ? (
          <Footer
            token={token}
            spotifyURI={spotifyURI}
            playlistAlbumKey={playlistAlbumKey}
          />
        ) : null}
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
