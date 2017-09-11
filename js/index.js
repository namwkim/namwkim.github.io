window.onload = function() {
	var see = document.getElementById('see-old-news');

  see.addEventListener('click', function() {
    var elem = document.getElementById('news-archive');

  	if (elem.style.display === 'none') {
  		elem.style.display = 'block';
      see.innerHTML = 'Hide old news';
  	} else {
  		elem.style.display = 'none';
      see.innerHTML = 'See old news';
  	}
	});

}
