
  
// async function count(event) {
//     event.preventDefault();
//     console.log("hello", event.target.id)

//     try{
//         console.log("res", response);
//         let count = parseInt(document.querySelector(".counter-display").value);
//         const newCount = count + 1;
//         console.log("here it is", newCount);
//         const response = await fetch(`/api/posts/upvotes/${event.target.id}`,{
//             method: 'PUT',
//             body: JSON.stringify({
    
//             })
//         })
//     }catch{
//     }
// }


const trending_playlists = document.querySelector('#trending_playlists')
let heart_btn = document.querySelector(".heart-btn");
var userId = sessionStorage.getItem('user_id')

const count= async (event) => {
    event.preventDefault();
    var element = event.target;
    
    if (element.matches(".counter-display")) {
        let count = parseInt(document.querySelector(".counter-display").value);
        var postId = element.getAttribute("data");
        var post = parseInt(postId);      
        // try{
        //     console.log("res", response);
        //     let count = parseInt(document.querySelector(".counter-display").value);
        //     const newCount = count + 1;
        //     console.log("here it is", newCount);
        //     const response = await fetch(`/api/posts/upvotes/${event.target.id}`,{
        //         method: 'PUT',
        //         body: JSON.stringify({
        
            //         })
        //     })
        //   // if response was ok, brings user to login page.
        //   if (response.ok) {
            //     window.location.replace(`/posts/${post}`);
        //   } else {
        //     alert('Could not add comment. Try again!');
        //   }
        // } catch (error) {
            //     alert('Could not add comment. Try again!');
            // }
            console.log("here", count, post)
        }
        
        if (element.matches(".linkbtn")) {
            var postId = element.getAttribute("data");
            var post = parseInt(postId);
            window.location.replace(`/posts/${post}`)
    }
}

trending_playlists.addEventListener("click",createCommentHandler)
// heart_btn.addEventListener("click",count)
