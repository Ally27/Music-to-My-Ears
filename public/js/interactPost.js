// interact box that exists on many webpages that gives posts/comments the basis for interactions 
const interact_box = document.querySelector('#interact_box')
// const commentbtn = document.querySelector('.commentbtn')
var userId = sessionStorage.getItem('user_id')

// add functionality for the button types that exist within interact box 
const interactionHandler = async (event) => {
    event.preventDefault();
    var element = event.target;

    // if the element matches a "Add Comment" button runs the code 
    if (element.matches(".commentbtn")) {
      
      // gets user id from session storage and adds it as the user_id for the person posting the comment 
        if (!userId) {
            window.location.replace(`/login`);
        }
        // gets data and postId info
        var postId = element.getAttribute("data");
        var post = parseInt(postId);
        const content = element.parentElement.querySelector('.commentbox').value.trim()
      
      // posts new comment to our api 
      try {
        const response = await fetch(`/api/comments`, {
            method: 'POST',
            body: JSON.stringify({
              content: content,
              post_id: post,
              user_id: userId
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
        
          // if response was ok, brings user to the post they commented on's page.
          if (response.ok) {
            window.location.replace(`/posts/${post}`);
          } else {
            alert('Could not add comment. Try again!');
          }
        } catch (error) {
            alert('Could not add comment. Try again!');
        }
    // if the element matches a "Go to Post" button runs the code 
  } else if (element.matches(".linkbtn")) {
    // gets post id and naviates to that post 
      const postId = element.getAttribute("data");
      const post = parseInt(postId);
      window.location.replace(`/posts/${post}`)
     // if the element matches a "Upvote" button runs the code 
    } else if (element.matches(".likebtn")) {
      // gets the post id and count from the button's handlebar 
      const postId = element.getAttribute("data");
      const countEl = element.getAttribute("data-count")
      const post = parseInt(postId);   
      const count= parseInt(countEl);
      // adds +1 to the count
      const newcount = count+1;
      // posts a new update with the upvotes +1 
      try {
        const response = await fetch(`/api/posts/upvote/${post}`, {
            method: 'PUT',
            body: JSON.stringify({
              upvotes: newcount
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
        
          // if response was ok, reloads current page to reflect new upvote total
          if (response.ok) {
            location.reload()
          } else {
            alert('Could not update user. Try again!');
          }
    } catch (error) {
        alert('Could not upvote post. Try again!');
      }
    // if the element matches a "Go to Spotify" button runs the code 
  } else if (element.matches(".spotifybtn")) {
    const spotifylink = element.getAttribute("data");
    // gets spotify link and opens it in a new window
    window.open(`https://open.spotify.com/playlist/${spotifylink}`)
  } 
}
interact_box.addEventListener("click",interactionHandler)