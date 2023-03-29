//--------------------------------- index.js -----------------------------------
// This file contains the methods that handle the behavior of the main
// application page (MediaTrends.html).
// It makes AJAX fetch calls to the API to satisfy different user interactions
// with the MediaTrends application
// -----------------------------------------------------------------------------
"use strict";
(function () {
    const BASE_URL = "/mediaTrends/";
    window.addEventListener("load", init);

    let username;

    /**
     * Sets up page on load.
     */
    async function init() {
        // console.log(sessionStorage.getItem('username'));
        // if(sessionStorage.getItem('username')) {
        //     username = sessionStorage.getItem('username');
        // } else {
        //     username = '';
        // }
        // loadUserData();
        username = sessionStorage.getItem('username');
        await loadDB();
        username = sessionStorage.getItem('username');
        console.log(username);
        id("sign-in-out-button").classList.remove("hidden");
        if ((username === null) || (username === '')) {
            id("sign-in-out-button").textContent = "Sign In";
            id("update-button").classList.add("hidden");
            id("recommend-movies-by-favorite").classList.add("hidden");
        } else {
            id("sign-in-out-button").textContent = "Sign Out";
            id("update-button").classList.remove("hidden");
            id("recommend-movies-by-favorite").classList.remove("hidden");
        }
        id("sign-in-out-button").addEventListener("click", login);
        id("update-button").addEventListener("click", function() {
            window.location.href = 'updateuserinfo.html';
        });
        id("recommend-button").addEventListener("submit", function (e) {
            e.preventDefault(); // prevent default behavior of submit (page refresh)
            loadRecommended(); // intended response function
        });
        id("apply-filters-button").addEventListener("submit", function (e) {
            e.preventDefault(); // prevent default behavior of submit (page refresh)
            loadFiltered(); // intended response function
        });
        loadRecommended();
    }

    function loadRecommended() {
        //console.log(id("favorite").value);
        id("all-movies-container").innerHTML = "";
        let value = id("favorite").value;
        if(id("favorite").selectedIndex === 0) {
            let heading = gen("h2");
            heading.textContent = "Top 10 Trending Movies";
            id("all-movies-container").appendChild(heading);
            fetch(BASE_URL + "getTrending")
            .then(statusCheck)
            .then(res => res.json())
            .then(loadData)
            // .then(check)
            .catch(console.log);
        } else {
            let heading = gen("h2");
            heading.textContent = "Recommended Movies";
            id("all-movies-container").appendChild(heading);
            fetch(BASE_URL + "retrieveByFavorite/" + username + "?factor=" + value)
            .then(statusCheck)
            .then(res => res.json())
            .then(loadData)
            // .then(check)
            .catch(console.log);
        }
    }

    async function loadData(response) {
        // let resp = response['result'][0]['filmstudio'];
        // if (resp) {
        //     console.log(resp);
        // }
        let container = gen("ul");


        let size = response['result'].length;
        for (let i = 0; i < size; i++) {
            let videonum = response['result'][i]['videonum'];
            let genreList = await getGenre(videonum);
            let actorList = await getActors(videonum);
            let list = gen("li");

            let movieCard = gen("div");
            movieCard.classList.add("movie-card");

            let movieDetails = gen("div");
            movieDetails.classList.add("movie-details");

            let mtitle = gen("h3");
            mtitle.textContent = (i + 1) +". " + response['result'][i]['name'];
            movieDetails.appendChild(mtitle);

            let genreP = gen("p");
            let genreHead = gen("strong");
            genreHead.textContent = "Genre: ";

            let genreText = document.createTextNode(genreList);
            genreP.appendChild(genreHead);
            genreP.appendChild(genreText);
            movieDetails.appendChild(genreP);


            let langP = gen("p");
            let langHead = gen("strong");
            langHead.textContent = "Language: ";

            let langText = document.createTextNode(response['result'][i]['language']);
            langP.appendChild(langHead);
            langP.appendChild(langText);
            movieDetails.appendChild(langP);


            let studioP = gen("p");
            let studioHead = gen("strong");
            studioHead.textContent = "Film Studio: ";


            studioP.appendChild(studioHead);
            if (response['result'][i]['filmstudio']) {
                let studioText = document.createTextNode(response['result'][i]['filmstudio']);
                studioP.appendChild(studioText);
            }
            movieDetails.appendChild(studioP);


            let castP = gen("p");
            let castHead = gen("strong");
            castHead.textContent = "Cast: ";

            let castText = document.createTextNode(actorList);
            castP.appendChild(castHead);
            castP.appendChild(castText);
            movieDetails.appendChild(castP);


            movieCard.appendChild(movieDetails);
            list.appendChild(movieCard);
            container.appendChild(list);
        }

        id("all-movies-container").appendChild(container);
    }

    async function getGenre(videonum) {
        //console.log(videonum);
        return fetch(BASE_URL + "getGenres/" + videonum)
            .then(statusCheck)
            .then(res => res.json())
            .then(processGenre)
            .then(result => {
                return "" + result;
              })
            .catch(console.log);
    }

    async function getActors(videonum) {
        return fetch(BASE_URL + "getActors/" + videonum)
            .then(statusCheck)
            .then(res => res.json())
            .then(processActors)
            .then(result => {
                return "" + result;
              })
            .catch(console.log);
    }

    function processGenre(response) {
        //console.log(response['result']);
        let size = response['result'].length;
        let retValue = response['result'][0]['name'];
        for (let i = 1; i < size; i++) {
            retValue += ", " + response['result'][i]['name'];
        }
        //console.log(retValue);
        return retValue;
    }

    function processActors(response) {
        let size = response['result'].length;
        let retValue = response['result'][0]['firstname'] + " " + response['result'][0]['lastname'];
        for (let i = 1; i < size; i++) {
            retValue += ", " + response['result'][i]['firstname'] + " " + response['result'][i]['lastname'];
        }
        return retValue;
    }

    function loadFiltered() {
        let genre = "=" + id("genre").value;
        let language = "=" + id("language").value;
        let studio = "=" + id("studio").value;
        let actorfirst = "=" + id("afn").value;
        let actorlast = "=" + id("aln").value;
        if(id("genre").selectedIndex === 0) {
            genre = "";
        }
        if(id("language").selectedIndex === 0) {
            language = "";
        }
        if(id("studio").selectedIndex === 0) {
            studio = "";
        }
        if(id("afn").value === "") {
            actorfirst = "";
        }
        if(id("afn").value === "") {
            actorlast = "";
        }

        if ((id("genre").selectedIndex === 0) && (id("language").selectedIndex === 0) && (id("afn").value === "") && (id("afn").value === "")) {
            loadRecommended();
            return;
        }

        id("all-movies-container").innerHTML = "";
        let heading = gen("h2");
        heading.textContent = "Recommended Movies";
        id("all-movies-container").appendChild(heading);
        let queryString = "?genre" + genre + "&language" + language + "&filmstudio" + studio +
        "&actorFName" + actorfirst + "&actorLName" + actorlast;

        console.log(queryString);

        fetch(BASE_URL + "retrieveByFilter" + queryString)
            .then(statusCheck)
            .then(res => res.json())
            .then(loadData)
            // .then(check)
            .catch(console.log);
    }

    function login() {
        sessionStorage.setItem('username', '');
        window.location.href = 'login.html';
    }

    async function loadDB() {
        fetch(BASE_URL + "makeNewDB")
            .then(statusCheck)
            .then(res => res.text())
            .then(async (response) => {
                if(response) {
                    console.log(response);
                    //todo if any
                }
             })
            .catch(console.log);
    }

    /**
    * Helper function to return the response's result text if successful, otherwise
    * returns the rejected Promise result with an error status and corresponding text
    * @param {object} res - response to check for success/error
    * @return {object} - valid response if response was successful, otherwise rejected
    *                    Promise result
    */
    async function statusCheck(res) {
        if (!res.ok) {
            throw new Error(await res.text());
        }
        return res;
    }

    /**
     * Returns the element that has the ID attribute with the specified value.
     * @param {string} name - element ID.
     * @returns {object} DOM object associated with ID.
     */
    function id(name) {
        return document.getElementById(name);
    }



    /**
     * Returns first element matching selector.
     * @param {string} selector - CSS query selector.
     * @returns {object} - DOM object associated selector.
     */
    function qs(selector) {
        return document.querySelector(selector);
    }

    /**
     * Returns all element matching the selector.
     * @param {string} selector - CSS query selector.
     * @returns {array} - an array of DOM objects associated selector.
     */
    function qsa(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * creates and returns a new empty DOM node representing an element of that tagName type
     * @param {string} tagName - HTML element type.
     * @returns {object} - A new DOM object representing an element of that tagName type
     */
    function gen(tagName) {
        return document.createElement(tagName);
    }
})();