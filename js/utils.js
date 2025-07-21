/*
 * --------------------------------------------------------------------------
 * Suprema - Entrapass Integration Tool
 * Developed by SDG Systems and Solutions, All rights reserved
 * BioStar 2 and it's trademarks belong to Suprema Inc. 
 * Entrapass and it's trademarks belong to Kantech.
 * --------------------------------------------------------------------------
 */
const SrvIP = window.location.host.split(":")[0];
const SrvPort = !window.location.host.split(":")[1] ? window.location.protocol == "https:" ? "443" : "80" : window.location.host.split(":")[1];
const SDGPort = "7733";
const ADDSrv = window.location.protocol + "//" + SrvIP + ":" + SrvPort;
const SDGSrv = window.location.protocol + "//" + SrvIP + ":" + SDGPort;
const ADDwsSrv = window.location.protocol == "https:" ? "wss://" + SrvIP + ":" + SrvPort : "ws://" + SrvIP + ":" + SrvPort;
const XK = 9;
const EK = 5;
const DK = (26 - EK) % 26;
const SrvK = 4;
const CreK = 5;
var sdg_sessionid = sessionStorage.session_id;
Array.prototype.unique = function () {
    return Array.from(new Set(this))
};

function Pad(data) {
    return data.toString().padStart(2, "0")
}
let EncDec = (salt, hash) => {
    let result = "";
    hash.split("").forEach(x => {
        result += String.fromCharCode(salt ^ x.charCodeAt(0))
    });
    return result
};
let CShift = (text, shift) => {
    let result = "";
    text.split("").forEach(x => {
        let c = x.charCodeAt(0);
        if (c >= 65 && c <= 90) result += String.fromCharCode((c - 65 + shift) % 26 + 65);
        else if (c >= 97 && c <= 122) result += String.fromCharCode((c - 97 + shift) % 26 + 97);
        else result += x
    });
    return result
};
let CEncrypt = String2Encrypt => {
    let enc = btoa(EncDec(XK, CShift(String2Encrypt, EK)));
    return enc
};
let CDecrypt = EncryptedString => {
    return CShift(EncDec(XK, atob(EncryptedString)), DK)
};
APICallB2 = (method, call, data = null) => axios({
    method: method,
    url: ADDSrv + "/api/" + call,
    data: data,
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json",
        "bs-session-id": call == "login" ? null : session_id
    }
});
let APICallSDG = (method, call, data = null) => axios({
    method: method,
    url: SDGSrv + "/api/sdg" + call,
    data: data,
    headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "SDG-sns " + sdg_sessionid
    }
});
let Components = (enabled = true) => {
    document.getElementById("devsadd").disabled = !enabled;
    document.getElementById("penroll").disabled = !enabled;
    document.getElementById("usersync").disabled = !enabled;
    document.getElementById("confmenu1").disabled = !enabled;
    document.getElementById("confmenu2").disabled = !enabled;
    document.getElementById("confmenu3").disabled = !enabled;
    // document.getElementById("confmenu4").disabled = !enabled;
    // document.getElementById("confmenu5").disabled = !enabled;
    document.getElementById("langoptions").disabled = !enabled;
    document.getElementById("sessiontimeout").disabled = !enabled;
    document.getElementById("b2_usr").disabled = !enabled;
    document.getElementById("b2_pass").disabled = !enabled;
    document.getElementById("testconnb2_btn").disabled = !enabled;
    document.getElementById("saveconnb2_btn").disabled = true;
    document.getElementById("editconnb2_btn").disabled = !enabled;
    document.getElementById("sql_dname").disabled = !enabled;
    document.getElementById("sql_port").disabled = !enabled;
    document.getElementById("sql_auth").disabled = !enabled;
    document.getElementById("sql_usr").disabled = !enabled;
    document.getElementById("sql_pass").disabled = !enabled;
    document.getElementById("testconncc_btn").disabled = !enabled;
    document.getElementById("saveconncc_btn").disabled = true;
    document.getElementById("editconncc_btn").disabled = !enabled;
    document.getElementById("afteract").style.display = enabled ? "flex" : "none";
    document.getElementById("beforeact").style.display = !enabled ? "flex" : "none";
    document.getElementById("oact").style.display = enabled ? "flex" : "none"
};
// let CompMisc = (enabled = true) => {
//     document.getElementById("kiosk").disabled = !enabled;
//     document.getElementById("kiosk").style.display = enabled ? "inline" : "none"
// };
let CompSettings = (opc = "b2", enabled = true) => {
    switch (opc) {
        case "b2":
            document.getElementById("b2_usr").disabled = !enabled;
            document.getElementById("b2_pass").disabled = !enabled;
            document.getElementById("testconnb2_btn").disabled = !enabled;
            document.getElementById("saveconnb2_btn").disabled = !enabled;
            document.getElementById("editconnb2_btn").disabled = enabled;
            break;
        case "cc":
            document.getElementById("sql_dname").disabled = !enabled;
            document.getElementById("sql_port").disabled = !enabled;
            document.getElementById("sql_usr").disabled = !enabled;
            document.getElementById("sql_auth").disabled = !enabled;
            document.getElementById("sql_pass").disabled = !enabled;
            document.getElementById("srvencr").disabled = !enabled;
            document.getElementById("srvcert").disabled = !enabled;
            document.getElementById("testconncc_btn").disabled = !enabled;
            document.getElementById("saveconncc_btn").disabled = !enabled;
            document.getElementById("editconncc_btn").disabled = enabled;
            break
    }
};

function CheckActivation() {
    let activated = false;
    APICallSDG("get", "/activation").then(response => {
        if (response.status == 200) {
            console.log("Activated");
            activated = true;
            Components(true)
        } else {
            Components(false);
            Swal.fire({
                icon: "error",
                title: lang[lang_id].notactivated[0],
                html: lang[lang_id].notactivated[1],
                showConfirmButton: false,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                }
            })
        }
    }).catch(err => {
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            console.log("(APICallSDG/GetACT) ", err);
            Logout(false)
        }
        console.log(err);
        toastr.error(err, "ERROR:")
    }).finally(() => {
        // if (activated) {
        //     APICallSDG("get", "/misc/activation/srv").then(res => {
        //         if (res.status == 200 && res.data) {
        //             CompMisc(true)
        //         } else {
        //             CompMisc(false)
        //         }
        //     }).catch(err => {
        //         CompMisc(false);
        //         if (err.response && (err.response.status == 401 || err.response.status == 403)) {
        //             console.log("(APICallSDG/GetMiscAct) ", err);
        //             Logout(false)
        //         }
        //     })
        // }
    })
}

function Logout(simple) {
    switch (simple) {
        case true:
            sessionStorage.clear();
            window.location.replace("index.html");
            break;
        case false:
            Swal.fire({
                icon: "error",
                title: lang[lang_id].loginexpired,
                text: lang[lang_id].logoutredirection,
                showConfirmButton: false,
                timer: 3377,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                }
            }).then(() => {
                sessionStorage.clear();
                window.location.replace("index.html")
            });
            break
    }
}