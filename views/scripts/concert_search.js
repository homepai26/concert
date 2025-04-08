const search_btn = document.getElementById('concert-search-button');

search_btn.addEventListener('click', () => {
    let search = document.getElementById('concert-search');

    let concerts = concert_list.querySelectorAll('.card');
    concerts.forEach((concert) => {
	console.log(search.value);
	let concert_name = concert.querySelector('.card-title').textContent.toLowerCase();
	if (concert_name.includes(search.value.toLowerCase())) {
	    if (concert.classList.contains('d-none'))
		concert.classList.remove('d-none');
	} else {
	    concert.classList.add('d-none');
	}
    });
});
