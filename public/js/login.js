const loginFormHandler = async (event) => {
  // prevents the default action when we click on login buttin 
  event.preventDefault();

  // grabs form data from our login and password fields and trims it and formats into something we can use 
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    // makes an api post request to user/login with the inputted data and checks to see if it matches the response. if so it directs the user to the homepage. otherwise the user gets an error. 
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      alert('Failed to log in');
    }
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);
