import { FC } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material/styles';
import './style.css';
interface Props{
  userPlaylist: SpotifyApi.PlaylistObjectSimplified[]
}

const Home: FC<Props> = ({ userPlaylist }) => {
  // below is required to use custom mui themes
  const theme = useTheme();

  const Item = styled(Paper)({
    '&.MuiPaper-root': {
      backgroundColor: theme.customPalette.background.secondary1,
      color: theme.palette.grey[200],
    }
  })

  return (
    <div id='homeContainer'>
      <div id='homeAlbumHeader'>Albums</div>
      <Stack id="albumContainer">
        {Object.entries(userPlaylist).map(([key, value]) => {
          return(
            <Item className='homeAlbumContainer' key={key}>
              <img className='homeAlbumImage' src={value.images[0].url}></img>
              <div className='homeAlbumText'>{value.name}</div>
            </Item>
          )
        })}
      </Stack>
    </div>
  )
}

export default Home;