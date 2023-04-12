const createbtn = document.querySelector('#createbtn')
const userId = sessionStorage.getItem('user_id')

const createPostHandler = async (event) => {
  event.preventDefault();

  try {
    const title = document.querySelector('#title-create').value.trim();
    const content = document.querySelector('#content-create').value.trim();
    const spotifyData = document.querySelector('#spotify-create').value.trim();
    const user_tag = document.querySelector('#selectTag').value;
    const tagId = parseInt(user_tag)+1

    console.log(tagId)

    let spotifyId;

    if (spotifyData.includes('spotify.com/playlist')) {
      const path = spotifyData.split('.com/')[1]
      const pathSplit = path.split('/')
      spotifyId = pathSplit[1];

      const accessTokenResponse = await fetch('/auth', {
        method: 'GET'
      });
      const accessTokenData = await accessTokenResponse.json();
      const access_token = accessTokenData.access_token;

      const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${spotifyId}/tracks?limit=25`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      })
      const data = await playlistResponse.json();
      const cover_img = data.items[0].track.album.images[0].url;

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          content: content,
          spotify_id: spotifyId,
          user_id: userId,
          tag_id: tagId,
          cover_img: cover_img,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      if (response.ok) {
        window.location.replace(`/`);
      } else {
        throw new Error('Unable to create new post');
      }
    }
  } catch (error) {
    console.error('Unable to connect to spotify API', error);
  }
};

createbtn.addEventListener('click', createPostHandler);
