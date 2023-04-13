const searchbtn = document.querySelector('#searchbtn');
const input = document.querySelector('#searchbar');

searchbtn.addEventListener('click', function (event) {
    event.preventDefault();
    const searchQuery = input.value;
    window.location.href = `/search/${searchQuery}`;
});
