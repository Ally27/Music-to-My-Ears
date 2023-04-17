const createbtn = document.querySelector('#createbtn')
const userId = sessionStorage.getItem('user_id')

// checks if theres a session storage id for "user_id" (session ends after 1 hour to prevent spotify api misfires)
// if theres no user_id in session storage, logs user out to have them sign in again
if (!userId) {
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    // if the response comes back ok, then the user is logged out and redirected to the login page. 
    document.location.replace('/login');
  } else {
    alert('Failed to log out');
  }
}

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
    
      // takes user to all recent posts page if POST is created. If not an alert is shown to prompt them to try again.
      if (response.ok) {
        window.location.replace(`/posts/`);
      } else {
        alert ("Unable to create post, try again!")
      }
    } else {
      // checks that the user is uploading a spotify playlist
      alert("You must link to a spotify playlist!")
    }
    // catches an error in connecting to spotify api 
  } catch (error) {
    console.error('Unable to connect to spotify API', error);
  }
};

createbtn.addEventListener('click', createPostHandler);
