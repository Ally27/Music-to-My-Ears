const updatebtn = document.querySelector('#updatebtn')
// gets user id from session storage to update the correct user's profile
const userId = sessionStorage.getItem('user_id')

// event handler for whenever use clicks on update button 
const signUpHandler = async (event) => {
  event.preventDefault();

  // get html form elements from page's values 
    const username = document.querySelector('#name').value.trim();
    const location = document.querySelector('#location').value.trim();
    const bio = document.querySelector('#bio').value.trim();
    const facebook = document.querySelector('#facebook').value.trim();
    const twitter = document.querySelector('#twitter').value.trim();
    const instagram = document.querySelector('#instagram').value.trim();

    // makes a put fetch to api/users with info in the form to update user 
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({
              name: username,
              location: location,
              bio: bio,
              twitter: twitter,
              instagram: instagram,
              facebook: facebook,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
        
          // if response was ok, brings user to account page.
          if (response.ok) {
            window.location.replace(`/account`);
          } else {
            alert('Could not update user. Try again!');
          }
    } catch (error) {
        alert('Could not update user. Try again!');
      }
      
};

updatebtn.addEventListener('click', signUpHandler);
