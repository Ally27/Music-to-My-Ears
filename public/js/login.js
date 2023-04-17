const loginFormHandler = async (event) => {
  event.preventDefault();

  //gets inputs from page
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  // checks to make sure both email and password are entered. does a post to /login to check it against the database
  if (email && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    // if response ok, gets user_id to save in session storage and sends user to authenticate their spotify account
    if (response.ok) {
      const userData = await response.json();
      const user_id = userData.user.id
      // Set user.id in session storage
      sessionStorage.setItem('user_id', user_id);

      const uri_local = "http%3A%2F%2Flocalhost%3A3001%2Fauth"
      const uri_heroku = "https%3A%2F%2Fmusic-to-my-ears1.herokuapp.com%2Fauth"
     

      window.location.href = `https://accounts.spotify.com/authorize?client_id=44dd607d18f74af59288c28ecbb77a63&response_type=code&redirect_uri=${uri_local}&scope=user-top-read`;
    } else {
      alert('Failed to log in');
    }
  }
};

document.querySelector('.forgot-btn').addEventListener('click', function(event){
  event.preventDefault
  window.location.replace(`/updatepassword`);


})

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
