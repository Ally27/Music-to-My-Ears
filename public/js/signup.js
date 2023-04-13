const createbtn = document.querySelector('#createbtn')

const signUpHandler = async (event) => {
  event.preventDefault();

  // get html form elements from page's values 
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();
    const checkpassword = document.querySelector('#password2').value.trim();
    const username = document.querySelector('#name').value.trim();
    const location = document.querySelector('#location').value.trim();
    const bio = document.querySelector('#bio').value.trim();
    const facebook = document.querySelector('#facebook').value.trim();
    const twitter = document.querySelector('#twitter').value.trim();
    const instagram = document.querySelector('#instagram').value.trim();

    // checks password length and that the password and checkpassword are the same 
    if (password.length<8){
        alert('Your password must be longer than 8 characters!')
        return;
    } else if (password!==checkpassword) {
        alert('Your passwords do not match!')
    }

    // makes a post fetch to api/users with info in the form 
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({
              email: email,
              name: username,
              password: password,
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
        
          // if response was ok, brings user to login page.
          if (response.ok) {
            window.location.replace(`/login`);
          } else {
            alert('Could not create new user. Try again!');
          }
    } catch (error) {
        alert('Could not create new user. Try again!');
      }
      
};

createbtn.addEventListener('click', signUpHandler);
