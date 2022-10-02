export const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = "https://localhost:3000/";
const clientId = "44531b7506a649129f802b598710dfab";

const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state",
];


export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;