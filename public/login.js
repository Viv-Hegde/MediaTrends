//--------------------------------- login.js -----------------------------------
// This file contains the methods that handle the behavior of the login/signup
// page.
// It makes AJAX fetch calls to the API to validate user credentials or create
// new users in the database
// -----------------------------------------------------------------------------
"use strict";
(function () {
    const BASE_URL = "/mediaTrends/";
    window.addEventListener("load", init);

    /**
     * Sets up page on load.
     */
    async function init() {
        sessionStorage.setItem('username', '');
        await loadDB();
        id("login-form").addEventListener("submit", function(e) {
            // Fires when submit event happens on form
            // If we've gotten in here, all HTML5 validation checks have passed
            e.preventDefault(); // prevent default behavior of submit (page refresh)
            submitRequest(); // intended response function
          });
    }

    async function loadDB() {
        fetch(BASE_URL + "makeNewDB")
            .then(statusCheck)
            .then(res => res.text())
            .then(console.log)
            // .then(check)
            .catch(console.log);
    }

    function submitRequest() {
        let user = id("username").value;
        user = user.trim();
        if (user.length === 0) {
            id("username").value = "";
            id("password").value = "";
            id("invalid").classList.remove("hidden");
            return;
        }
        let pwd = id("password").value;

        let param = new FormData();
        param.append("username", user);
        param.append("password", pwd);

        fetch(BASE_URL + "verifyCredentials", { method: "POST", body: param })
            .then(statusCheck)
            .then(res => res.text())
            .then((response) => {
                if(response === "verified") {
                    sessionStorage.setItem('username', user);
                    window.location.href = 'MediaTrends.html';
                } else {
                    id("username").value = "";
                    id("password").value = "";
                    sessionStorage.setItem('username', '');
                    id("invalid").classList.remove("hidden");
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
})();