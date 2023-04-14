
const trending_playlists = document.querySelector('#trending_playlists')
const commentbtn = document.querySelector('.commentbtn')
var userId = sessionStorage.getItem('user_id')

const createCommentHandler = async (event) => {
    event.preventDefault();
    var element = event.target;

    if (element.matches(".commentbtn")) {

        if (!userId) {
            window.location.replace(`/login`);
        }

        var postId = element.getAttribute("data");
        var post = parseInt(postId);
        const content = element.parentElement.querySelector('.commentbox').value.trim()
      
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
        
          // if response was ok, brings user to login page.
          if (response.ok) {
            window.location.replace(`/posts/${post}`);
          } else {
            alert('Could not add comment. Try again!');
          }
        } catch (error) {
            alert('Could not add comment. Try again!');
        }
    }

    if (element.matches(".linkbtn")) {
      var postId = element.getAttribute("data");
      var post = parseInt(postId);
      window.location.replace(`/posts/${post}`)
    }
}

trending_playlists.addEventListener("click",createCommentHandler)