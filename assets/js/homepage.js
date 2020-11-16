// let Remarkable = require('remarkable');
let md = new Remarkable();
let formatTime = d3.timeFormat("%b %d, %Y");
let parseTime = d3.timeParse('%Y-%m-%d');
let allPubs, allNews, allTravels;
let maxNews = 5;
let maxTravels = 5;
let maxCourses = 5;
let dataCond = null;
function strip(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

function formatDate(date){
    console.log(date);
    let temp = strip(date);
    if (temp=='TBD'){
        return temp;
    }else{
        return formatTime(parseTime(temp));
    }
}
Promise.all([
    'assets/files/news.csv',
    'assets/files/travels.csv',
    'assets/files/publications.csv',
    'assets/files/courses.csv',
    'assets/files/people.csv',
].map(url=>{
    return fetch(url).then(res=>
        res.ok ? res.text() : Promise.reject(res.status))
        .then(text=>d3.csvParse(text))
})).then(value=>{
    renderNews(allNews = value[0]);
    renderTravels(allTravels = value[1]);
    allPubs = value[2];
    let filter = document.querySelector('.chip.selected');
    dataCond = filter.dataset.cond;
    renderPubs(allPubs, dataCond);
    renderCourses(value[3]);

    renderPeople(value[4]);
});

function renderPeople(people){
    people = people.filter(d=>d.position!=="Principle Investigator");

    console.log('render people', people);

    let getURL = (image)=>{
        if (image===""){
            return 'assets/images/person.png';
        }else if (image.startsWith("http") && image.includes("drive.google.com")){
            const url = new URL(image); 
            const urlParams = new URLSearchParams(url.search);
            return `https://drive.google.com/uc?export=view&id=${urlParams.get("id")}`;
        }else{
            return image;
        }
    }


    let container = document.querySelector('.people');
    container.innerHTML='';
    people.filter(d=>d.status==="Present").forEach(item=>{
        let elem = document.createElement('div');
        elem.innerHTML=`
        <a target="_blank"href="${item.website!==""?item.website:item.linkedin}">
            <img src="${getURL(item.image)}"/>
            <div class="person-detail" style="display:none">${item.name}<br>${item.position}</div>
        </a>
        `
        
        container.appendChild(elem);
        elem.classList.add('item');
        elem.addEventListener("mouseenter", showPersonDetail);
        elem.addEventListener("mouseleave", hidePersonDetail);
    })

    container = document.querySelector('.alumni');
    container.innerHTML='';
    people.filter(d=>d.status==="Alumni").forEach(item=>{
        let elem = document.createElement('div');
        elem.innerHTML=`
        <a target="_blank" href="${item.website!==""?item.website:item.linkedin}">
            <img src="${getURL(item.image)}"/>
            <div class="person-detail"  style="display:none">${item.name}<br>${item.position}</div>
        </a>
        `
        
        container.appendChild(elem);
        elem.classList.add('item');
        elem.addEventListener("mouseenter", showPersonDetail);
        elem.addEventListener("mouseleave", hidePersonDetail);
    })
}

function showPersonDetail(event){
    const img = event.target.querySelector('img');
    img.style.width = "64px";
    img.style.height = "64px";
    img.classList.add('selected');

    const detail = event.target.querySelector('.person-detail');
    detail.style.display = "block";
}
function hidePersonDetail(event){
    const img = event.target.querySelector('img');
    img.style.width = "32px";
    img.style.height = "32px";
    img.classList.remove('selected');

    const detail = event.target.querySelector('.person-detail');
    detail.style.display = "none";
}

function renderPubs(pubs, cond){
    let filtered;
    switch(cond){
        case 'pub-all': 
        filtered = pubs;
        break;
        case 'pub-first-author':
        filtered = pubs.filter(item=>item.authors.startsWith('Nam Wook Kim'));
        break;
        case 'pub-featured':
        filtered = pubs.filter(item=>item.featured=='yes');
        break;
        case 'pub-thesis':// up to five years
        filtered = pubs.filter(item=>item.type.toLowerCase()=='thesis');
        break;
        // case 'pub-recent':// up to five years
        // let currentYear = (new Date()).getFullYear();
        // filtered = pubs.filter(item=>parseInt(item.year)>=(currentYear-3));
        // break;
        case 'pub-awards':
        filtered = pubs.filter(item=>item.award!='');
        break;
        case 'pub-journal':
        filtered = pubs.filter(item=>item.type.toLowerCase()=='journal');
        break;
        case 'pub-conference':
        filtered = pubs.filter(item=>item.type.toLowerCase()=='conference');
        break;
        default:
        filtered = pubs;
        
    }
    // console.log(pubs, cond);
    // let featured = pubs.filter(item=>item.featured=='yes');
    // console.log(featured);

    // filter by type
    let byType = document.querySelector('#by-time');
    console.log('render', filtered, cond);
    // console.log('byType',byType.checked);
    if (byType.checked){
        filtered = d3.nest()
        .key(item=>item.year)
        .sortValues((a,b)=>b.title.localeCompare(a.title))
        .entries(filtered);
        filtered.sort((a,b)=>b.key-a.key)
    }else{
        filtered = d3.nest()
        .key(item=>item.type)
        .sortValues((a,b)=>parseInt(b.year)-parseInt(a.year))
        .entries(filtered);
    }
    
    // featured.map(d=>d.key)
    let container = document.querySelector('.pubs');
    container.innerHTML='';
    
    filtered.forEach(group=>{
        // console.log('item',group);
        //website,slides,video,code,data,software,supplemental,media,abstract
        let html = group.values.reduce((html, d)=>{
            let path = `assets/files/publications/${d.type.toLowerCase()}/${d.title.replace(/\s/g, '-').replace(/[:?]/g, '').toLowerCase()}`;
            return html + `<div class='pub'>
                <div class='pub-teaser'
                    style='background-image:url(${path}/teaser.png);'>
                </div>
                <div class='pub-detail'>
                    <div class='pub-title'><strong>${d.title}</strong></div>
                    <div class='pub-authors'>${d.authors.replace('Nam Wook Kim', '<strong>Nam Wook Kim</strong>')}</div>
                    <div class='pub-venue'><em>${d.venue} ${d.venue_abbreviation?`(<strong>${d.venue_abbreviation}</strong>)`:''}, ${d.year}</em></div>
                    <div class='pub-award'><strong>${d.award}</strong></div>
                    <div class='pub-materials'>
                        ${renderPubMaterials(d, path)}
                    </div>

                </div>
            </div>`
        }, '');
        let elem = document.createElement('div');
        elem.innerHTML = `<h3 class='title'>${group.key}</h3>` + html;
        elem.classList.add('pub-group');
        container.appendChild(elem);
    });
}
function renderPubMaterials(d, path){
    // let path = `/files/publications/${group.key.toLowerCase()}/${d.title.replace(/\s/g, '-').replace(/:/g, '').toLowerCase()}`;
    let generate = (icon, link, label)=>`<div class='item'>
        <i class="${icon}"></i>
        <a href='${link}' target='_blank'>${label}</a>
    </div>`
    let html = generate('far fa-file-alt', `${path}/paper.pdf`, 'PAPER');
    if (d.website!=''){
        html+= generate('fas fa-globe', d.website, 'WEBSITE');
    }
    if (d.supplement=='yes'){
        html+= generate('far fa-file-alt', `${path}/supplement.pdf`, 'SUPPLEMENT');
    } else if (d.supplement=='zip'){
        html+= generate('far fa-file-alt', `${path}/supplement.zip`, 'SUPPLEMENT');
    }
    if (d.slides=='yes'){
        html+= generate('fas fa-chalkboard-teacher', `${path}/slides.pdf`, 'SLIDES');
    }else if (d.slides.startsWith('http')){
        html+= generate('far fa-file-alt', d.slides, 'SLIDES');
    }
    if (d.data!=''){
        html+= generate('fas fa-database', d.data, 'DATA');
    }

    if (d.code!=''){
        html+= generate('fas fa-code', d.code, 'CODE');
    }
    if (d.video!=''){
        html+= generate('fas fa-video', d.video.startsWith('http')?d.video:`${path}/video.mp4`, 'VIDEO');
    }
    if (d.software!=''){
        html+= generate('fas fa-desktop', d.software, 'SOFTWARE');
    }

    return html;
    // slides, video, code, data, software, supplemental, abstract

}
let conds = document.querySelectorAll('.filter .chip');

conds.forEach(cond=>cond.addEventListener('click', function(event){
    if (this.classList.contains('selected')==false){
        let selected = document.querySelector('.chip.selected');
        selected.classList.remove('selected');
        this.classList.add('selected');   
        console.log('filter', this.dataset.cond);
        dataCond = this.dataset.cond;
        renderPubs(allPubs, dataCond);
    }
}));
document.querySelector('#by-time').addEventListener('change', function(){
    renderPubs(allPubs, dataCond);
});



function renderNews(news){
    console.log('render news', news);
    let container = document.querySelector('.news');
    container.innerHTML='';
    const filtered = news.slice(0,maxNews);
    filtered.sort((a,b)=> parseTime(b.date) - parseTime(a.date));
    filtered.forEach(item=>{
        let elem = document.createElement('div');
        elem.innerHTML = `
                ${md.render(item.headline)}
                 <span class='date'>${formatDate(item.date)}</span>
            `;
        
        container.appendChild(elem);
        elem.classList.add('item');
    })
}
function renderTravels(travels){
    console.log('render travels', travels);
    let container = document.querySelector('.travels');
    container.innerHTML='';
    const filtered = travels.slice(0,maxTravels);
    filtered.sort((a,b)=> parseTime(b.end) - parseTime(a.end));
    filtered.forEach(item=>{
        let elem = document.createElement('div');
        elem.innerHTML = `
                ${md.render(item.headline)}
                 <span class='date'>${formatDate(item.start)}</span> ${item.start!=item.end?'~':''} 
                 <span class='date'>${item.start!=item.end?formatDate(item.end):''}</span>  
                 <span class='location'>@ ${writeAddress(item)}</span>
            `;
        
        container.appendChild(elem);
        elem.classList.add('item');
    })
}
function renderCourses(courses){
    console.log('render courses', courses);
    let container = document.querySelector('.courses');
    const filtered = courses.slice(0,maxCourses);
    filtered.sort((a,b)=> `${b.when}, ${b.year}` - `${a.when}, ${a.year}`);
    filtered.forEach(item=>{
        let elem = document.createElement('div');
        elem.innerHTML = `
                ${md.render(item.name)}
                 <span class='date'>${item.when}, ${item.year}</span>
                 <span class='location'>@ ${item.where}</span>
            `;
        
        container.appendChild(elem);
        elem.classList.add('item');
    })
}
function writeAddress(item){
    if (item.country=='USA'){
        return item.city + ', ' +  item.state;
    }
    if (item.city!=''){
        return item.city + ', ' + item.country
    }
    return item.country
    
}

document.querySelector('.email').addEventListener('click', event=>{
    let email = event.currentTarget.innerHTML.replace(/\s/g, '').replace('at', '@');
    var copyText = document.createElement("input");
    copyText.setAttribute('type', 'text');
    copyText.value = email;
    document.body.appendChild(copyText);
    copyText.select();
    document.execCommand("copy");
    document.body.removeChild(copyText);
})
// let seeMore = document.querySelector('.see-more');

// seeMore.addEventListener('click', function(){
    
//     let bioDetail = document.querySelector('.bio-detail');
//     if (bioDetail.classList.contains('hidden')) {
//         bioDetail.classList.remove('hidden');
//         bioDetail.classList.add('show');
//     } else {
//         bioDetail.classList.remove('show');
//         bioDetail.classList.add('hidden');
//     }
// });

let newsSearch = document.querySelector('.search input[name="news"');

newsSearch.addEventListener('input', function(event){
    // renderNews(allNews.filter(''))
    // console.log('value', this.value);
    if (this.value!=''){
        let filtered = allNews.filter(d=>{
            
            var tmp = document.createElement("div");
            tmp.innerHTML = md.render(d.headline);
            let date = formatDate(d.date)
            let text = (tmp.textContent || tmp.innerText || "") + date;
            console.log(text.toLowerCase(),this.value.toLowerCase());
            return text.toLowerCase().includes(this.value.toLowerCase());
        })
        renderNews(filtered);
    }else{
        renderNews(allNews);
    }
});

let travelSearch = document.querySelector('.search input[name="travel"');

travelSearch.addEventListener('input', function(event){
    if (this.value!=''){
        let filtered = allTravels.filter(d=>{
            


            var tmp = document.createElement("div");
            tmp.innerHTML = md.render(d.headline);
            let start = formatDate(d.start)
            let end = formatDate(d.end)
            let address = writeAddress(d);
            
            let text = (tmp.textContent || tmp.innerText || "") + start + (start!=end?(' ~ ' + end):'') + ' @ ' + address;
            console.log(text.toLowerCase(),this.value.toLowerCase());
            return text.toLowerCase().includes(this.value.toLowerCase());
        })
        renderTravels(filtered);
    }else{
        renderTravels(allTravels);
    }
});

let profileImage = document.querySelector('.profile-image');

let numImages = 11;
let randIdx  = Math.floor(Math.random()*numImages)+1;
profileImage.src = `/assets/images/profile/photo${randIdx}.png`;
profileImage.addEventListener('mousemove', function(event){
    let x = event.clientX - this.offsetLeft;
    let y = event.clientY-this.offsetTop;
    let idx =  Math.floor(x/(this.width/numImages))+1;
    if (idx>=1 && idx<=numImages){
        profileImage.src = `/assets/images/profile/photo${idx}.png`;
    }
    
});

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
// let openNewsArchive = document.querySelector('.open_news_archive');

// openNewsArchive.addEventListener('click', function(){
    
//     let newsArchive = document.querySelector('.news_archive');
//     console.log(newsArchive.style.display);
//     if (newsArchive.style.display === "block") {
//         newsArchive.style.display = "none";
//     } else {
//         newsArchive.style.display = "block";
//     }
// });
