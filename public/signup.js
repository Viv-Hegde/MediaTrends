//--------------------------------- signup.js -----------------------------------
// This file contains the methods that handle the behavior of the login/signup
// page.
// It makes AJAX fetch calls to the API to validate user credentials or create
// new users in the database
// -----------------------------------------------------------------------------
"use strict";
(function () {
    const BASE_URL = "/mediaTrends/";
    window.addEventListener("load", init);
    let usernames = [];

    /**
     * Sets up page on load.
     */
    async function init() {
        await loadDB();
        sessionStorage.setItem('username', '');
    }

    async function loadUsernames() {
        fetch(BASE_URL + "getUsernames")
            .then(statusCheck)
            .then(res => res.json())
            .then(load)
            // .then(check)
            .catch(console.log);
    }

    async function loadDB() {
        fetch(BASE_URL + "makeNewDB")
            .then(statusCheck)
            .then(res => res.text())
            .then(async (response) => {
                if(response) {
                    console.log(response);
                    await loadUsernames();
                    id("signup-form").addEventListener("submit", function (e) {
                        // Fires when submit event happens on form
                        // If we've gotten in here, all HTML5 validation checks have passed
                        e.preventDefault(); // prevent default behavior of submit (page refresh)
                        submitRequest(); // intended response function
                    });
                }
             })
            .catch(console.log);
    }

    function load(response) {
        let size = response['result'].length;
        for (let i = 0; i < size; i++) {
            usernames.push(response['result'][i]['username']);
        }
    }

    // function check() {
    //     for (let i = 0; i < usernames.length; i++) {
    //         console.log(usernames[i]);
    //     }
    // }

    function submitRequest() {
        let user = id("username").value;

        user = user.trim();
        if (user.length === 0) {
            clearForm();
            id("error-msg").textContent = "Invalid username. Please try again.";
            id("error-msg").classList.remove("hidden");
            return;
        }
        if (isUsernameAllowed(user)) {
            let pwd = id("password").value;
            let cpwd = id("cpassword").value;

            if (pwd !== cpwd) {
                clearForm();
                id("error-msg").textContent = "Passwords do not match. Please try again.";
                id("error-msg").classList.remove("hidden");
                return;
            }

            let email = id("email").value;
            let pnumber = id("pnumber").value;
            let ad1 = id("ad1").value;
            let ad2 = id("ad2").value;
            let city = id("city").value;
            let state = id("state").value;
            let pcode = id("pc").value;

            let param = new FormData();
            param.append("username", user);
            param.append("password", pwd);
            param.append("email", email);
            param.append("phone", pnumber);
            param.append("address1", ad1);
            param.append("address2", ad2);
            param.append("city", city);
            param.append("state", state);
            param.append("postal", pcode);

            fetch(BASE_URL + "newCustomer", { method: "POST", body: param })
            .then(statusCheck)
            .then(res => res.text())
            .then((response) => {
                if(response === "success") {
                    sessionStorage.setItem('username', user);
                    window.location.href = 'MediaTrends.html';
                } else {
                    clearForm();
                    id("error-msg").textContent = "Server error. please try again later";
                    id("error-msg").classList.remove("hidden");
                }
             })
            .catch(console.log);
        } else {
            clearForm();
            id("error-msg").textContent = "Sorry, the username is already in use. Please try again.";
            id("error-msg").classList.remove("hidden");
            return;
        }
    }

    function clearForm() {
        let user = id("username").value = "";
        let pwd = id("password").value = "";
        let cpwd = id("cpassword").value = "";
        let email = id("email").value = "";
        let pnum = id("pnumber").value = "";
        let ad1 = id("ad1").value = "";
        let ad2 = id("ad2").value = "";
        let city = id("city").value = "";
        let pcode = id("pc").value = "";
    }

    function isUsernameAllowed(user) {
        for (let i = 0; i < usernames.length; i++) {
            if (usernames[i] === user) return false;
        }
        return true;
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