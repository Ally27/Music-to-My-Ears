const createbtn = document.querySelector('#createbtn')
const userId = sessionStorage.getItem('user_id')

// gets access token stored in user data for the current session
const get_access_token = await fetch(`/api/users/${userId}`, {
  method: 'GET'
})

// turn access token into a form we can work with it in
const data = await get_access_token.json();
const access_token = data.access_token;
const access_token_stringified = JSON.stringify(access_token);

// event handler function for creating a post 
const createPostHandler = async (event) => {
  event.preventDefault();

  // get html form elements from page's values 
  try {
    const title = document.querySelector('#title-create').value.trim();
    const content = document.querySelector('#content-create').value.trim();
    const spotifyData = document.querySelector('#spotify-create').value.trim();
    const user_tag = document.querySelector('#selectTag').value;
    const tagId = parseInt(user_tag)+1
    let spotifyId;

    // gets spotifyId from the url they provide + checks they are uploading a playlist from spotify
    if (spotifyData.includes('spotify.com/playlist')) {
      const path = spotifyData.split('.com/')[1]
      const pathSplit = path.split('/')
      spotifyId = pathSplit[1];

      // creates new post using all parameters from page + cover_img from api call 
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          content: content,
          spotify_id: spotifyId,
          user_id: userId,
          tag_id: tagId
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      // returns user to home if POST is created. If not an alert is shown to prompt them to try again.
      if (response.ok) {
        window.location.replace(`/`);
      } else {
        alert ("Unable to create post, try again!")
      }
    }
    // catches an error in connecting to spotify api 
  } catch (error) {
    console.error('Unable to connect to spotify API', error);
  }
};

createbtn.addEventListener('click', createPostHandler);
