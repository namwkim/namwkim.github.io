import {formatDate, getURL, renderNews, renderTravels, renderCourses} from './common.js';

document.addEventListener("DOMContentLoaded", async function () {
    // Your code here
    const params = getUrlParams();
    // console.log(params);

    document.querySelector(".title").innerHTML = capitalizeFirstLetter(
        params.page
    );

    if (params.page === "news") {
        const url =
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vRiEYYD3rIzHcyFpugw6fF8EbO2EVjClWyoHf49rU7nJCVa-YjXJ6vJ4VMwgRIFyaVHSgfBswDhU5-B/pub?output=csv";
        const items = await loadCSV(url);
        renderNews(items, document.querySelector(".items"), Infinity);
    }else if (params.page ==="travel"){
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQ9qDvzFADgd4bP6GK6Ql3fHmpi9Ur4h2ulOi6C5PduoUg2r-5QRm5fxuM24asKxmRp1vzA8lPGdWE/pub?output=csv";
        const items = await loadCSV(url);
        renderTravels(items, document.querySelector(".items"), Infinity);
    }else if (params.page ==="teaching"){
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbSAg-v5C7XlV5VZ0OB_3xwTuc0D9DmkkblCsVTlwlxAy3y7OcGmNkQl_nsweJTkwxTmiyABSoO6WR/pub?output=csv";
        const items = await loadCSV(url);
        renderCourses(items, document.querySelector(".items"), Infinity);
    }else if (params.page ==="people"){
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVrB2GEn9fEm1aWMys8h4FE0KG_a65VeULWBsV_l1xMCfgsDOJNn66t-yAWyLGvR1cb2YATyF9i62-/pub?output=csv";
        const items = await loadCSV(url);
        renderPeople(items, document.querySelector(".items"), Infinity);
    }
});
async function loadCSV(url) {
    return await fetch(url)
        .then((res) => (res.ok ? res.text() : Promise.reject(res.status)))
        .then((text) =>
            d3.csvParse(text, (d) => {
                const record = { ...d };
                console.log("Record", record);
                for (const prop in record) {
                    record[prop] =
                        record[prop] === "" || record[prop] === "na"
                            ? null
                            : record[prop];
                }
                return record;
            })
        );
}

document.querySelector(".back-button").addEventListener("click", function () {
    window.history.back();
});
function getUrlParams() {
    let params = new URLSearchParams(window.location.search);
    let obj = {};
    for (let param of params) {
        obj[param[0]] = param[1];
    }
    return obj;
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export function renderPeople(people, container, maxPeople = 20) {
    people = people.filter((d) => d["Position"] !== "Principal Investigator");

    console.log('render people', people);

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
            <a target="_blank"href="${item["Website"] ? item["Website"] : item["LinkedIn"]}">
                <img class="person-photo" src="${
                    !item["Photo"]
                        ? "../assets/images/person.png"
                        : getURL(item["Photo"])
                }" alt="${item["Name"]}, ${item["Position"]}"/>
            </a>
            <div class="person-detail">${item["Name"]}<br>${item["Position"]}</div>
        `;
            setTimeout(function() {
            // do something after 1000 milliseconds
            container.appendChild(elem);
            elem.classList.add("item");
            console.log("delayed loading");
          }, 200);
       
        });

    const alumni = document.createElement("section");
    alumni.innerHTML = `
        <h2>Alumni</h2>
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
            <a target="_blank"href="${item["Website"] ? item["Website"] : item["LinkedIn"]}">
                <img src="${
                    !item["Photo"]
                        ? "../assets/images/person.png"
                        : getURL(item["Photo"])
                }" alt="${item["Name"]}, ${item["Position"]}"/>
            </a>

            <div class="person-detail">${item["Name"]}<br>${item["Position"]}</div>
        `;

            container.appendChild(elem);
            elem.classList.add("item");
        });
}
