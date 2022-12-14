import { FC } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import './style.css';
import MusicTracksPlaylist from './MusicTracksPlaylist/MusicTracksPlaylist';
import MusicTracksAlbum from './MusicTracksAlbum/MusicTracksAlbum';
import { tracksInterface, tracksInterfaceAlbum, currPlaylistAlbumInterface } from '../../Util/modals';

// TODO: Interface for Tracks to support both playlist and album

interface Props{
  tracks: tracksInterface[],
  albumTracks: tracksInterfaceAlbum[],
  handleTrackPress: (trackURI: string, key: string) => void,
  currPlaylistAlbum: currPlaylistAlbumInterface,
  handleAlbumClick: (value: any) => void,
  handleArtistClick: (artistID: string) => void,
}

const MusicTracks:FC<Props> = ({ tracks, handleTrackPress, currPlaylistAlbum, handleAlbumClick, albumTracks, handleArtistClick }) => {
  return(
    <TableContainer>
      <Table className='tableMain'>
        {currPlaylistAlbum.type === 'playlist' ? 
          <MusicTracksPlaylist 
            tracks={tracks}
            handleTrackPress={handleTrackPress}
            trackUri={currPlaylistAlbum.uri}
            handleAlbumClick={handleAlbumClick}
            handleArtistClick={handleArtistClick}
          /> : 
          <MusicTracksAlbum 
            albumTracks={albumTracks}
            handleTrackPress={handleTrackPress}
            trackUri={currPlaylistAlbum.uri}
            handleArtistClick={handleArtistClick}
          />
        }
      </Table>
  </TableContainer>
  )
}

export default MusicTracks;