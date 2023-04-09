const loginFormHandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const userData = await response.json();
      const user_id = userData.user.id
      // console.log(user_id)
      
      // Set user.id in session storage
      sessionStorage.setItem('user_id', user_id);

      window.location.href = 'https://accounts.spotify.com/authorize?client_id=44dd607d18f74af59288c28ecbb77a63&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth&scope=user-top-read';
    } else {
      alert('Failed to log in');
    }
  }
};

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
