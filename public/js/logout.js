const logout = async () => {
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
