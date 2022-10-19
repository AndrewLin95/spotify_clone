import { FC, useEffect, useState } from 'react';
import MusicHeader from './MusicHeader/MusicHeader';
import MusicTracks from './MusicTracks/MusicTracks';
import { tracksInterface } from '../Util/modals';
import pullPlaylistTracks from '../APICalls/pullPlaylistTracks';

interface Props{
  currPlaylistAlbum: {
    image: string,
    type: string,
    name: string,
    owner_name: string,
    totalTracks: string,
    uri: string,
    urlID: string,
  },
  token: string,
  handleTrackPress: (trackURI: string, key: string) => void,
  handleAlbumClick: (value: any) => void;
}

const Playlists:FC<Props> = ({ currPlaylistAlbum, token, handleTrackPress, handleAlbumClick }) => {
  const pagingObject = {} as tracksInterface
  const [tracks, setTracks] = useState<tracksInterface>(pagingObject);
  const [loadingTracks, setLoadingTracks] = useState<boolean>(true);

  useEffect(() =>{
    setLoadingTracks(true);

    async function getPlaylistTrackInfo() {
      const data = await pullPlaylistTracks(currPlaylistAlbum.urlID, token, currPlaylistAlbum.type);
      if (currPlaylistAlbum.type === 'playlist'){
        setTracks(data.transformedData)
      } else if (currPlaylistAlbum.type === 'album'){
        setTracks(data.transformedData)
      }
      setLoadingTracks(data._loadingTracks);
    }

    getPlaylistTrackInfo();
  }, [currPlaylistAlbum]);


  return (
    <div className="mainContainer">
      <MusicHeader currPlaylistAlbum={currPlaylistAlbum} />
      {loadingTracks ? 
        null : 
        <MusicTracks 
          currPlaylistAlbum={currPlaylistAlbum} 
          tracks={tracks} 
          handleTrackPress={handleTrackPress} 
          handleAlbumClick={handleAlbumClick}
        />
      }
    </div>
  )
}

export default Playlists; 