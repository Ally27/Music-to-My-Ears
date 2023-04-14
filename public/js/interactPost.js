const interact_box = document.querySelector('#interact_box')
// const commentbtn = document.querySelector('.commentbtn')
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
    } else if (element.matches(".linkbtn")) {
      const postId = element.getAttribute("data");
      const post = parseInt(postId);
      window.location.replace(`/posts/${post}`)
    } else if (element.matches(".likebtn")) {
      const postId = element.getAttribute("data");
      const countEl = element.getAttribute("data-count")
      const post = parseInt(postId);   
      const count= parseInt(countEl);
      const newcount = count+1;
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
        
          // if response was ok, brings user to login page.
          if (response.ok) {
            window.location.replace(`/`);
          } else {
            alert('Could not update user. Try again!');
          }
    } catch (error) {
        alert('Could not upvote post. Try again!');
      }
  }

    
}

interact_box.addEventListener("click",createCommentHandler)