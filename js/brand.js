/*
 * --------------------------------------------------------------------------
 * Suprema - Entrapass Integration Tool
 * Developed by SDG Systems and Solutions, All rights reserved
 * BioStar 2 and it's trademarks belong to Suprema Inc. 
 * Entrapass and it's trademarks belong to Kantech.
 * --------------------------------------------------------------------------
 */
document.getElementById("loginform").addEventListener("click", function (event) {
    event.preventDefault()
});
let lang_id = localStorage.lang || "en";
let SetLangIndex = () => {
    document.getElementById("username").placeholder = lang[lang_id].username;
    document.getElementById("password").placeholder = lang[lang_id].password;
    document.getElementById("loginbtn").value = lang[lang_id].loginbtn
};

function Login() {
    let mData = {id: document.getElementById("username").value,pass: document.getElementById("password").value};
    APICallSDG("post", "/login", {payload: CEncrypt(JSON.stringify(mData))}).then(response => {
        if (response.status == 200) {
            if (!response.data.payload) throw new Error("Payload compromised");
            let resp = JSON.parse(CDecrypt(response.data.payload));
            if (resp.permission == 1) {
                toastr.success(lang[lang_id].login);
                sessionStorage.type = resp.permission;
                sessionStorage.session_id = resp.session_id;
                sessionStorage.login_id = resp.login_id;
                sessionStorage.name = resp.name;
                localStorage.lang = lang_id;
                window.location.replace("dashboard.html")
            } else {
                console.error("not a valid user");
                toastr.error(lang[lang_id].notvaliduser)
            }
        } else {
            toastr.error(lang[lang_id].wronglogin)
        }
    }).catch(error => {
        if (error.response && error.response.status == 400) {
            toastr.error(lang[lang_id].wronglogin)
        } else if (error.response && (error.response.status == 402 || error.response.status == 404)) {
            console.warn("Error Status: ", error.response.status);
            toastr.error(lang[lang_id].wronglogin)
        } else if (error.response && (error.response.status == 401 || error.response.status == 403)) {
            toastr.error(lang[lang_id].logincompromised)
        } else {
            toastr.error(lang[lang_id].loginerror);
            console.error("Error: ", error)
        }
    })
}
SetLangIndex();
if (document.readyState == "loading") {
    APICallSDG("get", "/checkalive").then(resp => {
        if (resp.status == 200) {
            console.log("OK to start")
        }
    }).catch(e => {
        console.log("NOT online");
        document.getElementById("loginform").style.display = "none";
        Swal.fire({
            icon: "error",
            title: lang[lang_id].backendnotrunning[0],
            html: lang[lang_id].backendnotrunning[1],
            showConfirmButton: false,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
            }
        })
    })
}