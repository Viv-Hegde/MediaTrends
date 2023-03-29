//--------------------------------- updateuserinfo.js -----------------------------------
// This file contains the methods that handle the behavior of the uodate user info
// page.
// It makes AJAX fetch calls to the API to validate user credentials or create
// new users in the database
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
        if (sessionStorage.getItem('username') === '' || sessionStorage.getItem('username') === null) {
            id("error-page").classList.remove("hidden");
            id("update-page").classList.add("hidden");
        } else {
            id("error-page").classList.add("hidden");
            id("update-page").classList.remove("hidden");
            username = sessionStorage.getItem('username');
            await loadUserData();
            id("back-button").addEventListener("click", function() {
                window.history.back();
            });
            id("reset-button").addEventListener("click", async function() {
                id("error-msg").classList.add("hidden");
                id("success-msg").classList.add("hidden");
                await loadUserData();
                window.scrollTo(0, 0);
            });
            id("updateinfo-form").addEventListener("submit", function (e) {
                // Fires when submit event happens on form
                // If we've gotten in here, all HTML5 validation checks have passed
                e.preventDefault(); // prevent default behavior of submit (page refresh)
                submitRequest(); // intended response function
                window.scrollTo(0, 0);
            });
        }
        id("sign-out-button").addEventListener("click", function() {
            sessionStorage.setItem('username', '');
            window.location.href = 'login.html';
        });
    }

    async function loadUserData() {
        fetch(BASE_URL + "getUserInfo/" + username)
            .then(statusCheck)
            .then(res => res.json())
            .then(loadData)
            // .then(check)
            .catch(console.log);
    }

    async function loadData(response) {
        id("username").textContent = "username: " + username;
        id("password").value = response['result'][0]['password'];
        id("cpassword").value = response['result'][0]['password'];
        id("email").value = response['result'][0]['email'];
        id("pnumber").value = response['result'][0]['phonenumber'];
        id("ad1").value = response['result'][0]['address1'];
        id("ad2").value = response['result'][0]['address2'];
        id("city").value = response['result'][0]['city'];
        id("pc").value = response['result'][0]['postalcode'];

        let stateDropDown = id("state");
        for (let i = 0; i < stateDropDown.options.length; i++) {
            if (stateDropDown.options[i].value === response['result'][0]['stateid']) {
                stateDropDown.selectedIndex = i;
                break;
            }
        }
    }



    function submitRequest() {
            let pwd = id("password").value;
            let cpwd = id("cpassword").value;

            if (pwd !== cpwd) {
                id("error-msg").textContent = "Passwords do not match. Please try again.";
                id("error-msg").classList.remove("hidden");
                id("success-msg").classList.add("hidden");
                window.scrollTo(0, 0);
                return;
            }

            let email = id("email").value;
            let pnumber = id("pnumber").value;
            if (pnumber.length !== 10) {
                id("error-msg").textContent = "Invalid phone number. Please try again.";
                id("error-msg").classList.remove("hidden");
                id("success-msg").classList.add("hidden");
                window.scrollTo(0, 0);
                return;
            }
            let ad1 = id("ad1").value;
            let ad2 = id("ad2").value;
            let city = id("city").value;
            let state = id("state").value;
            let pcode = id("pc").value;
        if (pcode) {
            if (pcode.length !== 5) {
                id("error-msg").textContent = "Invalid postal code. Please try again.";
                id("error-msg").classList.remove("hidden");
                id("success-msg").classList.add("hidden");
                window.scrollTo(0, 0);
                return;
            }
        }


            let param = new FormData();
            param.append("username", username);
            param.append("password", pwd);
            param.append("email", email);
            param.append("phone", pnumber);
            param.append("address1", ad1);
            param.append("address2", ad2);
            param.append("city", city);
            param.append("state", state);
            param.append("postal", pcode);

            fetch(BASE_URL + "updateCustomer", { method: "POST", body: param })
            .then(statusCheck)
            .then(res => res.text())
            .then((response) => {
                if(response === "success") {
                    id("success-msg").classList.remove("hidden");
                    id("error-msg").classList.add("hidden");
                    window.scrollTo(0, 0);
                    loadUserData();
                } else {
                    loadUserData();
                    id("error-msg").textContent = "Unable to update. please try again later";
                    id("error-msg").classList.remove("hidden");
                    id("success-msg").classList.add("hidden");
                    window.scrollTo(0, 0);
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