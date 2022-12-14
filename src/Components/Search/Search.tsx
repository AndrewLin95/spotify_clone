import { FC, useEffect, useState, useMemo } from 'react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce } from 'lodash';
import TopResults from './Components/TopResults';
import TopSongs from './Components/TopSongs';
import TopArtists from './Components/TopArtists';
import TopAlbums from './Components/TopAlbums';
import getSearchItems from '../APICalls/getSearchItem';
import './style.css';

interface Props {
  token: string;
  handleAlbumClick: (value: any) => void;
  handleArtistClick: (artistID: string) => void;
}

const Search: FC<Props> = ({ token, handleAlbumClick, handleArtistClick }) => {
  const [query, setQuery] = useState<number | string>('');

  const [loading, setLoading] = useState(true);

  const artistInterface = [] as SpotifyApi.ArtistObjectFull[];
  const [artist, setArtist] =
    useState<SpotifyApi.ArtistObjectFull[]>(artistInterface);

  const albumInterface = [] as SpotifyApi.AlbumObjectFull[];
  const [album, setAlbum] =
    useState<SpotifyApi.AlbumObjectFull[]>(albumInterface);

  const tracksInterface = [] as SpotifyApi.TrackObjectFull[];
  const [tracks, setTracks] =
    useState<SpotifyApi.TrackObjectFull[]>(tracksInterface);

  const playlistInterface = [] as SpotifyApi.PlaylistObjectFull[];
  const [playlist, setPlaylist] =
    useState<SpotifyApi.PlaylistObjectFull[]>(playlistInterface);

  // when search query is updated, contacts the spotifyAPI endpoints to retrieve artists, albums and tracks
  useEffect(() => {
    async function getSearchResults() {
      if (query === '') {
        return;
      }
      const searchResults: any = await getSearchItems(token, query);
      console.log('SEARCH RESULTS', searchResults);
      setAlbum(searchResults.albums.items);

      // return only the top five tracks
      const topFiveTracks = [];
      let i = 0;
      while (i < 5) {
        topFiveTracks.push(searchResults.tracks.items[i]);
        i++;
      }
      setTracks(topFiveTracks);

      // return only the top five tracks
      const topTenArtists = [];
      let j = 0;
      while (j < 10) {
        topTenArtists.push(searchResults.artists.items[j]);
        j++;
      }
      setArtist(topTenArtists);

      setPlaylist(searchResults.playlists.items);
      setLoading(false);
    }
    getSearchResults();
  }, [query]);

  // updates the search state with the search parameters after a short debounce
  const handleSearch = (e: number | string) => {
    setQuery(e);
  };

  const debouncedSearch = useMemo(() => {
    return debounce(handleSearch, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  });

  return (
    <>
      <div id="headerSearchContainer">
        <FontAwesomeIcon id="headerSearchIcon" icon={faMagnifyingGlass} />
        <input
          onChange={(e) => {
            debouncedSearch(e.target.value);
          }}
          id="headerSearchInput"
          placeholder="What do you want to listen to?"
        ></input>
      </div>
      {!loading && (
        <div id="searchContentContainer">
          <div id="searchContentTopContainer">
            <TopResults artist={artist[0]} />
            <TopSongs
              tracks={tracks}
              handleAlbumClick={handleAlbumClick}
              handleArtistClick={handleArtistClick}
            />
          </div>
          <TopArtists artist={artist} handleArtistClick={handleArtistClick} />
          <TopAlbums album={album} handleAlbumClick={handleAlbumClick} />
        </div>
      )}
    </>
  );
};

export default Search;
