document.cookie = "myCookie=namwkim.org; samesite=none; secure";

let formatTime = d3.timeFormat("%b %d, %Y");
let parseTime = d3.timeParse("%Y-%m-%d");

document.querySelector("#copyright-year").innerHTML = new Date().getFullYear();

let md = new Remarkable();

function strip(str) {
    return str.replace(/^\s+|\s+$/g, "");
}

export function formatDate(date) {
    // console.log(date);
    let temp = strip(date);
    if (temp == "TBD") {
        return temp;
    } else {
        return formatTime(parseTime(temp));
    }
}

export function getURL(path) {
    if (path.startsWith("http") && path.includes("drive.google.com")) {
        const url = new URL(path);
        const urlParams = new URLSearchParams(url.search);
        if (urlParams.get("id")) {
            return `https://drive.google.com/uc?export=view&id=${urlParams.get(
                "id"
            )}`;
        } else {
            const id = path.split("/").slice(-2)[0]; // second from last
            return `https://drive.google.com/uc?export=view&id=${id}`;
        }
    } else {
        return path;
    }
}

export function renderNews(news, container, maxNews = 5) {
    // console.log('render news', news);

    container.innerHTML = "";
    const filtered = news.slice(0, maxNews);
    filtered.sort((a, b) => parseTime(b.date) - parseTime(a.date));
    filtered.forEach((item) => {
        let elem = document.createElement("div");
        elem.setAttribute("role", "listitem");
        elem.innerHTML = `
                ${md.render(item.headline)}
                 <span class='date'>${formatDate(item.date)}</span>
            `;

        container.appendChild(elem);
        elem.classList.add("item");
    });
}

export function renderTravels(travels, container, maxTravels = 5) {
    // console.log('render travels', travels);

    container.innerHTML = "";
    const filtered = travels.slice(0, maxTravels);
    filtered.sort((a, b) => parseTime(b.end) - parseTime(a.end));
    filtered.forEach((item) => {
        let elem = document.createElement("div");
        elem.setAttribute("role", "listitem");
        elem.innerHTML = `
                ${md.render(item.headline)}
                 <span class='date'>${formatDate(item.start)}</span> ${
            item.start != item.end ? "~" : ""
        } 
                 <span class='date'>${
                     item.start != item.end ? formatDate(item.end) : ""
                 }</span>  
                 <span class='location'>@ ${writeAddress(item)}</span>
            `;

        container.appendChild(elem);
        elem.classList.add("item");
    });
}
export function renderCourses(courses, container, maxCourses = 5) {
    // console.log('render courses', courses);
    // let container = document.querySelector('.courses');
    const filtered = courses.slice(0, maxCourses);
    filtered.sort((a, b) => `${b.when}, ${b.year}` - `${a.when}, ${a.year}`);
    filtered.forEach((item) => {
        let elem = document.createElement("div");
        elem.setAttribute("role", "listitem");
        elem.innerHTML = `
                ${md.render(item.name)}
                 <span class='date'>${item.when}, ${item.year}</span>
                 <span class='location'>@ ${item.where}</span>
            `;

        container.appendChild(elem);
        elem.classList.add("item");
    });
}
export function writeAddress(item) {
    if (item.country == "USA") {
        return item.city + ", " + item.state;
    }
    if (item.city) {
        return item.city + ", " + item.country;
    }
    return item.country;
}

