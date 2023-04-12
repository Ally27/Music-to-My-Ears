const createbtn = document.querySelector('#createbtn')
const userId = sessionStorage.getItem('user_id')
const access_token = sessionStorage.getItem('access_token')
console.log(userId, access_token)

const createPostHandler = async (event) => {

  event.preventDefault();

  try {
    const title = document.querySelector('#title-create').value.trim();
    const content = document.querySelector('#content-create').value.trim();
    const spotifyData = document.querySelector('#spotify-create').value.trim();
    const tagId = document.querySelector('#selectTag').value;

    let spotifyId;

    if (spotifyData.includes('spotify.com/playlist')) {
      const path = spotifyData.split('.com/')[1]
      const pathSplit = path.split('/')
      spotifyId = pathSplit[1];
      const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${spotifyId}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      
      console.log(playlistResponse);
    } else {
      alert("You must include a link to a spotify playlist!")
    }

    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        content: content,
        spotify_id: spotifyId,
        user_id: userId,
        tag_id: tagId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const newPost = await response.json();
      console.log('New post created:', newPost);
      // Redirect the user to the newly created post's page
      window.location.replace(`/`);
    } else {
      throw new Error('Unable to create new post');
    }
  } catch (error) {
    console.error('Unable to create new post', error);
  }
};

createbtn.addEventListener('click', createPostHandler);
