
let allPubs, allNews, allTravels;

let dataCond = null;

let newsContainer = document.querySelector('.news');
let courseContainer = document.querySelector('.courses');
let peopleContainer = document.querySelector('.people');
let travelContainer = document.querySelector('.travels');
let md = new Remarkable();

import {formatDate, getURL, getImgURL, renderNews, renderTravels, renderCourses, writeAddress} from './common.js';

Promise.all([
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRiEYYD3rIzHcyFpugw6fF8EbO2EVjClWyoHf49rU7nJCVa-YjXJ6vJ4VMwgRIFyaVHSgfBswDhU5-B/pub?output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSQ9qDvzFADgd4bP6GK6Ql3fHmpi9Ur4h2ulOi6C5PduoUg2r-5QRm5fxuM24asKxmRp1vzA8lPGdWE/pub?output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuAr9AcdSeiXGGKUyqT5e-P0i5MXJB3d8bN0_9ujbVmyNbC0cZIMkE4JL_b29XR4Y_jzLAp4ZDWNWi/pub?output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSbSAg-v5C7XlV5VZ0OB_3xwTuc0D9DmkkblCsVTlwlxAy3y7OcGmNkQl_nsweJTkwxTmiyABSoO6WR/pub?output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQVrB2GEn9fEm1aWMys8h4FE0KG_a65VeULWBsV_l1xMCfgsDOJNn66t-yAWyLGvR1cb2YATyF9i62-/pub?output=csv',
].map(url=>{
    return fetch(url).then(res=>
        res.ok ? res.text() : Promise.reject(res.status))
        .then(text=>d3.csvParse(text, d=>{
            const record = {...d};
            // console.log("Record", record);
            for (const prop in record){
                record[prop] = record[prop]==="" || record[prop]==="na"? null: record[prop];
            }
            return record;
        }))
})).then(value=>{
    renderNews(allNews = value[0], newsContainer);
    renderTravels(allTravels = value[1], travelContainer);
    allPubs = value[2];
    // console.log("allPubs", allPubs);
    let filter = document.querySelector('.chip.selected');
    dataCond = filter.dataset.cond;
    renderPubs(allPubs, dataCond);
    renderCourses(value[3], courseContainer);
    // console.log('people', value[4]);
    renderPeople(value[4], peopleContainer);
});


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
        filtered = pubs.filter(item=>item.award);
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
        filtered = filtered.reduce((acc, d)=>{
            if (!acc[d.year]){
                acc[d.year] = [];
            }
            acc[d.year].push(d);
            return acc;
        }, {});
        // console.log("ACC", Object.entries(filtered));
        filtered = Object.entries(filtered).map(group=>{
            group[1].sort((a,b)=>b.title.localeCompare(a.title));
            return group;
        });
        
        // d3.nest()
        // .key(item=>item.year)
        // .sortValues((a,b)=>b.title.localeCompare(a.title))
        // .entries(filtered);
        filtered.sort((a,b)=>b[0]-a[0]);
        // console.log("ACC", filtered);
        document.querySelector("#by-time-switch").setAttribute("aria-pressed", true);

    }else{
        // filtered = d3.nest()
        // .key(item=>item.type)
        // .sortValues((a,b)=>parseInt(b.year)-parseInt(a.year))
        // .entries(filtered);
        filtered = filtered.reduce((acc, d)=>{
            if (!acc[d.type]){
                acc[d.type] = [];
            }
            acc[d.type].push(d);
            return acc;
        }, {});
        
        // console.log("ACC", Object.entries(filtered));
        filtered = Object.entries(filtered).map(group=>{
            group[1].sort((a,b)=>parseInt(b.year)-parseInt(a.year));
            return group;
        });

        // filtered =  filtered.reduce((acc, d, i)=>{
        //     if (!acc[d.type]){
        //         acc[d.type] = {
        //             key:d.type,
        //             values:[]
        //         }
        //     }
        //     acc[d.year].values.push(d);
        // }, {}).map(group=>group.values);
        document.querySelector("#by-time-switch").setAttribute("aria-pressed", false);
        
    }
    console.log("filtered publications", filtered);
    // featured.map(d=>d.key)
    let container = document.querySelector('.pubs');
    container.innerHTML='';
    
    filtered.forEach(group=>{
        // console.log('item',group);
        //website,slides,video,code,data,software,supplemental,media,abstract
        let html = group[1].reduce((html, d)=>{

            // let path = ;
            // let path = `assets/files/publications/${d.type.toLowerCase()}/${d.title.replace(/\s/g, '-').replace(/[:?|,]/g, '').toLowerCase()}`;
            return html + `<div class='pub' role="listitem">
                <div class='pub-teaser'
                    style='background-image:url(${getImgURL(d.teaser)});'>
                </div>
                <div class='pub-detail'>
                    <div class='pub-title'><strong>${d.title}</strong></div>
                    <div class='pub-authors'>${d.authors.replace('Nam Wook Kim', '<strong>Nam Wook Kim</strong>')}</div>
                    <div class='pub-venue'><em>${d.venue} ${d.venue_abbreviation?`(<strong>${d.venue_abbreviation}</strong>)`:''}, ${d.year}</em></div>
                    <div class='pub-award'><strong>${d.award?d.award:""}</strong></div>
                    <div class='pub-materials' role="list" aria-label="Publication Materials">
                        ${renderPubMaterials(d)}
                    </div>

                </div>
            </div>`
        }, '');
        let elem = document.createElement('div');
        // elem.setAttribute('role', 'listitem')
        elem.innerHTML = `<h3 class='title' aria-hidden="true">${group[0]}</h3>
            <div role="list" aria-label="${group[0]} Publications">${html}
            </div>`;
        elem.classList.add('pub-group');
        container.appendChild(elem);
    });
}
function renderPubMaterials(d){
    // let path = `/files/publications/${group.key.toLowerCase()}/${d.title.replace(/\s/g, '-').replace(/:/g, '').toLowerCase()}`;
    let generate = (icon, link, label)=>`<div class='item' role="listitem">
        <i class="${icon}"></i>
        <a href='${link}' target='_blank'>${label}</a>
    </div>`
    let html = '';
    if (d.paper){
        html+= generate('far fa-file-alt', `${getURL(d.paper)}`, 'PAPER');
    }
    if (d.website){
        html+= generate('fas fa-globe', d.website, 'WEBSITE');
    }
    if (d.supplement){
        html+= generate('far fa-file-alt', `${getURL(d.supplement)}`, 'SUPPLEMENT');
    }
    if (d.slides){
        html+= generate('fas fa-chalkboard-teacher', `${getURL(d.slides)}`, 'SLIDES');
    }
    if (d.data){
        html+= generate('fas fa-database',`${getURL(d.data)}`,'DATA');
    }

    if (d.code){
        html+= generate('fas fa-code', `${getURL(d.code)}`, 'CODE');
    }
    if (d.video){
        html+= generate('fas fa-video', `${getURL(d.video)}`, 'VIDEO');
    }
    if (d.software){
        html+= generate('fas fa-desktop',`${getURL(d.software)}`, 'SOFTWARE');
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
        renderNews(filtered, newsContainer);
    }else{
        renderNews(allNews, newsContainer);
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
        renderTravels(filtered, travelContainer);
    }else{
        renderTravels(allTravels, travelContainer);
    }
});

let pubSearch = document.querySelector('.search input[name="publication"');

pubSearch.addEventListener('input', function(event){

    if (this.value!=''){
        let filtered = allPubs.filter(d=>{
            return d.title.toLowerCase().includes(this.value.toLowerCase());
        })
        renderPubs(filtered);
    }else{
        renderPubs(allPubs);
    }
});


let profileImage = document.querySelector('.profile-image');

let numImages = 13;
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


function renderPeople(people, container, maxPeople = 20) {
    people = people.filter((d) => d["Position"] !== "Principal Investigator");

    // console.log('render people', people);

    const positions = [
        "Postdoctoral Fellow",
        "Research Associate",
        "Undergraduate Assistant",
    ];
    container.classList.add("people");
    container.innerHTML = "";
    people.sort((a, b) => {
        if (
            positions.indexOf(a["Position"]) > positions.indexOf(b["Position"])
        ) {
            return 1;
        }
        if (
            positions.indexOf(a["Position"]) < positions.indexOf(b["Position"])
        ) {
            return -1;
        }
        return 0;
    });

    people
        .filter((d) => d["Status"] === "Present")
        .slice(0, maxPeople)
        .forEach((item) => {
            let elem = document.createElement("div");
            elem.setAttribute("role", "listitem");
            console.log("item", item);
            elem.innerHTML = `
        <a target="_blank"href="${
            item["Website"] ? item["Website"] : item["LinkedIn"]
        }">
            <img src="${
                !item["Photo"]
                    ? "assets/images/person.png"
                    : getImgURL(item["Photo"])
            }" alt="${item["Name"]}, ${item["Position"]}"/>
            <div class="person-detail" style="display:none">${
                item["Name"]
            }<br>${item["Position"]}</div>
        </a>
        `;

            container.appendChild(elem);
            elem.classList.add("item");
            elem.addEventListener("mouseenter", showPersonDetail);
            elem.addEventListener("mouseleave", hidePersonDetail);
        });

    const alumni = document.createElement("section");
    alumni.innerHTML = `
        <h4>Alumni</h4>
        <div class="alumni" role="list"></div>
    `;

    container.parentNode.insertBefore(alumni, container.nextSibling);
    // container.parentNode.appendChild(alumni);
    container.classList.add("alumni");

    container = alumni.querySelector(".alumni");
    container.innerHTML = "";
    people
        .filter((d) => d["Status"] === "Alumni")
        .slice(0, maxPeople)
        .forEach((item) => {
            let elem = document.createElement("div");
            elem.setAttribute("role", "listitem");
            elem.innerHTML = `
        <a target="_blank"href="${
            item["Website"] ? item["Website"] : item["LinkedIn"]
        }">
            <img src="${
                !item["Photo"]
                    ? "assets/images/person.png"
                    : getImgURL(item["Photo"])
            }" alt="${item["Name"]}, ${item["Position"]}"/>
            <div class="person-detail" style="display:none">${
                item["Name"]
            }<br>${item["Position"]}</div>
        </a>
        `;

            container.appendChild(elem);
            elem.classList.add("item");
            elem.addEventListener("mouseenter", showPersonDetail);
            elem.addEventListener("mouseleave", hidePersonDetail);
        });
}

function showPersonDetail(event) {
    // event.target.style.zIndex = 1;
    // const img = event.target.querySelector('img');
    // img.style.width = "64px";
    // img.style.height = "64px";
    // img.classList.add('selected');

    const detail = event.target.querySelector(".person-detail");
    detail.style.display = "block";
}
function hidePersonDetail(event) {
    // event.target.style.zIndex = 0;
    // const img = event.target.querySelector('img');
    // img.style.width = "32px";
    // img.style.height = "32px";
    // img.classList.remove('selected');

    const detail = event.target.querySelector(".person-detail");
    detail.style.display = "none";
}

