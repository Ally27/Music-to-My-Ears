var userId = sessionStorage.getItem('user_id')
const string = "blank"

const logout = async () => {

  // removes access_token from user data model
  const clear_access_token = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ access_token: string }),
    headers: { 'Content-Type': 'application/json' },
  });

    // post requeset to users/logout 
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    // if the response comes back ok, then the user is logged out and redirected to the login page. 
    document.location.replace('/login');
  } else {
    alert('Failed to log out');
  }
};

document.querySelector('#logout').addEventListener('click', logout);
