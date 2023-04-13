const searchbtn = document.querySelector('#searchbtn');
const input = document.querySelector('#searchbar');

// get input from search bar and run search route
searchbtn.addEventListener('click', function (event) {
    event.preventDefault();
    const searchQuery = input.value;
    window.location.href = `/search/${searchQuery}`;
});
