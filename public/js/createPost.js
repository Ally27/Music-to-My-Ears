const createForm = document.querySelector('.create-form');

const createPostHandler = async (event) => {
  event.preventDefault();

  try {
    const title = document.querySelector('#title-create').value.trim();
    const content = document.querySelector('#content-create').value.trim();
    const spotifyData = document.querySelector('#spotify-create').value.trim();
    const tagId = document.querySelector('#selectTag').value;

    let postType;
    let spotifyId;

    if (spotifyData.includes('spotify.com/')) {
      const path = spotifyData.split('.com/')[1]
      const pathSplit = path.split('/')
      postType = pathSplit[0];
      spotifyId = pathSplit[1];
    }

    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        content: content,
        spotify_id: spotifyId,
        post_type: postType,
        user_id: 1,
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

createForm.addEventListener('submit', createPostHandler);
