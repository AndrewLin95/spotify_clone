import { FC, useState, useEffect } from 'react';
import ArtistHeader from "./ArtistHeader/ArtistHeader";
import ArtistContent from './ArtistContent/ArtistContent';
import getArtist from '../APICalls/getArtist';
import getArtistTopTrack from '../APICalls/getArtistTopTrack';

interface Props{
  artistID: string,
  token: string,
  handleTrackPress: (trackURI: string, key: string) => void,
}

const Artists:FC<Props> = ({ artistID, token, handleTrackPress }) => {
  const artistDataInterface = {} as SpotifyApi.ArtistObjectFull    
  const [artistData, setArtistData] = useState<SpotifyApi.ArtistObjectFull>(artistDataInterface);

  const trackObjectInterface = {} as {tracks: SpotifyApi.TrackObjectFull[]}
  const [artistTopTracks, setArtistTopTracks] = useState<{tracks: SpotifyApi.TrackObjectFull[]}>(trackObjectInterface);

  const [loadingData, setLoadingData] = useState<boolean>(true);

  useEffect(() => {
    setLoadingData(true);
    async function getArtistInfo() {
      const _artistData = await getArtist(artistID, token);
      const _artistTopTracks = await getArtistTopTrack(artistID, token);

      console.log('artist toptracks', _artistTopTracks);

      setArtistData(_artistData);
      setArtistTopTracks(_artistTopTracks);
      setLoadingData(false);
    }
    getArtistInfo();
  }, [artistID])

  if (loadingData){
    return null;
  }

  return (
    <div className="mainContainer">
      <ArtistHeader artistData={artistData}/>
      <ArtistContent artistTopTracks={artistTopTracks} handleTrackPress={handleTrackPress}/>
    </div>
  )
}

export default Artists;