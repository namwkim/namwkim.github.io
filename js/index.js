// window.onload = function() {
// 	var see = document.getElementById('see-old-news');
//
//   see.addEventListener('click', function() {
//     var elem = document.getElementById('news-archive');
//
//   	if (elem.style.display === 'none') {
//   		elem.style.display = 'block';
//       see.innerHTML = 'Hide old news';
//   	} else {
//   		elem.style.display = 'none';
//       see.innerHTML = 'See old news';
//   	}
// 	});
//
// }
let openNewsArchive = document.querySelector('.open_news_archive');

openNewsArchive.addEventListener('click', function(){
    
    let newsArchive = document.querySelector('.news_archive');
    console.log(newsArchive.style.display);
    if (newsArchive.style.display === "block") {
        newsArchive.style.display = "none";
    } else {
        newsArchive.style.display = "block";
    }
});