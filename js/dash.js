/*
 * --------------------------------------------------------------------------
 * Suprema - Entrapass Integration Tool
 * Developed by SDG Systems and Solutions, All rights reserved
 * BioStar 2 and it's trademarks belong to Suprema Inc. 
 * Entrapass and it's trademarks belong to Kantech.
 * --------------------------------------------------------------------------
 */
const defaultpassword = "**************";
var TimeOut = 60;
const AliveTime = 10;
var keepalive = [null, AliveTime];
var DismissTime = 2400;
let lang_id = localStorage.lang || "en";
var nombre = sessionStorage.name;
var login_id = sessionStorage.login_id;
const session_id = sessionStorage.session_id;
let elementtimeout = document.getElementById("sessiontimeout");
var wiegand_options = document.getElementById("wformat");
let radiobtns = document.getElementsByName("searchoptions");
var importfile = document.getElementById("fileuri");
var importoffdevs = document.getElementById("offdevsfileuri");
var importkiosklic = document.getElementById("ki_add");
var importccusers = document.getElementById("ccusr_add");
var b2ACbefore = document.getElementById("befact");
var b2ACafter = document.getElementById("aftact");
var sub_domain = document.getElementById("subdomain");
var e_mail = document.getElementById("adminemail");
var use_cloud = document.getElementById("usecloud");
var smtp_srv = document.getElementById("smtpsrv");
var smtp_port = document.getElementById("smtpport");
var smtp_usr = document.getElementById("smtpusr");
var smtp_pwd = document.getElementById("smtppwd");
var smtp_type = document.getElementById("smtptype");
var smtp_mail = document.getElementById("smtpemail");
var use_penroll = document.getElementById("vfuse");
var vf_title = document.getElementById("vftitle");
var vf_name = document.getElementById("vfname");
var vf_logo = document.getElementById("vflogo");
var vf_sender = document.getElementById("vfsender");
var vf_policy = document.getElementById("vfpolicy");
var use_enrollpriv = document.getElementById("epuse");
var delfilter = document.getElementById("rels_del");
var selfilter = document.getElementById("rels_sel");
var use_imgs = document.getElementById("useImgs");
var use_clearances = document.getElementById("useSeg");
var btn_clearances = document.getElementById("clear_btn");
var btn_propics = document.getElementById("imgs_btn");
var use_ccureqr = document.getElementById("qruse");
var create_creds = document.getElementById("cre_card");
var read_qr = document.getElementById("read_qr");
var select_type = document.getElementById("rectype");
var select_ulbl = document.getElementById("usersync_sel");
var select_count = document.getElementById("reg_cnt");
var btn_usersync = document.getElementById("btn_usersync");
var prog_info = document.getElementById("progress_info");
var prog_bar = document.getElementById("pbar");
let sql_dname = document.getElementById("sql_dname");
let sql_port = document.getElementById("sql_port");
let sql_user = document.getElementById("sql_usr");
let sql_pass = document.getElementById("sql_pass");
let sql_encrypt = document.getElementById("srvencr");
let sql_trust = document.getElementById("srvcert");
let auth_type = document.getElementById("sql_auth");
var lbl_sel = lang[lang_id].penroll_sel;
var selected = false;
var pselected = false;
var allselrel = false;
var smtp_pass = null;
var cloudsettings = null;
var smtpsettings = null;
var vfsettings = null;
var extdevs = [];
let selected_usr;
let selected_dev;
let search_type = "udp";
let table_usr;
let table_users;
let table_dev;
let table_add;
let table_formats;
let table_privs;
let table_devgroups;
let table_rels;
let devs_cmd = [];
let devices_array = [];
let users_array = [];
let sys_conf = [0, 0, 0];
let Columns = {};
var conn_settings = {};
var credentials = null;
var isPriv = false,
    isDG = false;
var p_array = {};
var dg_array = {};
var pInter = null;
var reqfrom = null;
toastr.options = {
    closeButton: true,
    newestOnTop: true,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: true,
    onclick: null,
    showDuration: 300,
    hideDuration: 1e3,
    timeOut: 2400,
    extendedTimeOut: 1e3,
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
};
let getUserName = () => {
    if (!nombre) nombre = "username";
    document.getElementById("usertag").textContent = nombre
};
let SetLang = mlang => {
    document.getElementById("modaltitle").textContent = lang[mlang].modaltitle;
    document.getElementById("modaltext").textContent = lang[mlang].modaltext;
    document.getElementById("modalcancel").textContent = lang[mlang].cancel;
    document.getElementById("modalaccept").textContent = lang[mlang].accept;
    document.getElementById("aboutok").textContent = lang[mlang].accept;
    document.getElementById("menu").textContent = lang[mlang].menu;
    document.getElementById("confoptionstitle").textContent = lang[mlang].confoptions;
    document.getElementById("langlabel").textContent = lang[mlang].langlabel;
    document.getElementById("sessiontimeoutlabel").textContent = lang[mlang].sessiontimeoutlabel;
    document.getElementById("sessiontimeout").placeholder = lang[mlang].assigncounttext;
    document.getElementById("optionstext").textContent = lang[mlang].optionstext;
    document.getElementById("optionsnote").innerHTML = lang[mlang].optionsnote;
    document.getElementById("devicestitle").textContent = lang[mlang].devicestitle;
    document.getElementById("devicestext").textContent = lang[mlang].devicestext;
    document.getElementById("btntoapply").textContent = lang[mlang].accept;
    document.getElementById("btntocancel").textContent = lang[mlang].cancel;
    document.getElementById("btnclose").textContent = lang[mlang].close;
    document.getElementById("wflabel").textContent = lang[mlang].wiegandformat;
    document.getElementById("syncusertext").innerHTML = lang[lang_id].syncusertext;
    document.getElementById("btn_setwformat").textContent = lang[mlang].save;
    document.getElementById("add_devices").textContent = lang[mlang].devicesadd;
    document.getElementById("scan_card").textContent = lang[mlang].usersync;
    document.getElementById("configuration").textContent = lang[mlang].configuration;
    document.getElementById("settings").textContent = lang[mlang].settings;
    document.getElementById("about").textContent = lang[mlang].about[0];
    document.getElementById("menusys").textContent = lang[mlang].settings;
    document.getElementById("usersynctitle").textContent = lang[lang_id].usersynctitle;
    document.getElementById("usersynctext").textContent = lang[lang_id].usersynctext;
    document.getElementById("scandevstext").textContent = lang[lang_id].scandevstext;
    document.getElementById("sync_sel").textContent = lang[lang_id].usersyncbtn;
    document.getElementById("btn_close_usersync").textContent = lang[lang_id].close;
    document.getElementById("adddevstitle").textContent = lang[lang_id].adddevstitle;
    document.getElementById("adddevstext").textContent = lang[lang_id].adddevstext;
    document.getElementById("curdevstext").textContent = lang[lang_id].curdevstext;
    document.getElementById("devsaddtxt").textContent = lang[lang_id].devsaddtxt;
    document.getElementById("searchn_label").textContent = lang[lang_id].searchn_label;
    document.getElementById("searcha_label").textContent = lang[lang_id].searcha_label;
    document.getElementById("btnsearch").textContent = lang[lang_id].btnsearch;
    document.getElementById("iplabel").value = lang[lang_id].devip_label;
    document.getElementById("portlabel").value = lang[lang_id].devport_label;
    document.getElementById("btn_add").textContent = lang[lang_id].adddevstitle;
    document.getElementById("btn_addclose").textContent = lang[lang_id].close;
    document.getElementById("sysstatuslabel").textContent = lang[mlang].settings_sysstatuslabel;
    document.getElementById("b2_label").textContent = lang[mlang].settings_b2_label;
    document.getElementById("b2syslabel").textContent = lang[mlang].settings_b2_sys;
    document.getElementById("testconnb2_btn").textContent = lang[mlang].settings_test;
    document.getElementById("saveconnb2_btn").textContent = lang[mlang].settings_save;
    document.getElementById("setinit_btn").textContent = lang[mlang].settings_setinit;
    document.getElementById("ccset_enc").textContent = lang[mlang].settings_ccenc;
    document.getElementById("ccset_cert").textContent = lang[mlang].settings_cccert;
    document.getElementById("testconncc_btn").textContent = lang[mlang].settings_test;
    document.getElementById("saveconncc_btn").textContent = lang[mlang].settings_save;
    document.getElementById("licenselabel").textContent = lang[mlang].licenselabel;
    document.getElementById("lic_sys_key").placeholder = lang[mlang].placeholderlic_key;
    document.getElementById("lic_oth_key").placeholder = lang[mlang].placeholderlic_key;
    document.getElementById("lic_sys_cus").placeholder = lang[mlang].placeholderlic_customer;
    document.getElementById("lic_sys_onl").textContent = lang[mlang].lic_val_btn;
    document.getElementById("lic_sys_off").textContent = lang[mlang].lic_val_off_btn;
    document.getElementById("lic_oth_onl").textContent = lang[mlang].lic_val_btn;
    document.getElementById("lic_oth_off").textContent = lang[mlang].lic_val_off_btn;
    document.getElementById("licexp").textContent = lang[mlang].licexp;
    document.getElementById("lic_chng_btn").textContent = lang[mlang].lic_chng_btn;
    document.getElementById("btn_close_offlic").textContent = lang[mlang].close;
    document.getElementById("offline_0head").textContent = lang[mlang].offline_fields[0];
    document.getElementById("offline_btn").textContent = lang[mlang].offline_fields[1];
    document.getElementById("offline_1step").innerHTML = lang[mlang].offline_fields[2];
    document.getElementById("offline_2step").innerHTML = lang[mlang].offline_fields[3];
    document.getElementById("lblsyslic").textContent = lang[mlang].lblsyslic;
    document.getElementById("lblsysolic").textContent = lang[mlang].lblsysolic;
    document.getElementById("lblheadoffdevs").textContent = lang[mlang].lbloffdevs[0];
    document.getElementById("lbloffdevs").textContent = lang[mlang].lbloffdevs[1];
    document.getElementById("lbldeldev").textContent = lang[mlang].lbldeletedevice;
    document.getElementById("lblsyndev").textContent = lang[mlang].lblresyncdevice;
    document.getElementById("menucformats").textContent = lang[mlang].menucformat;
    document.getElementById("menucloud").textContent = lang[mlang].menucloud;
    document.getElementById("menusmtp").textContent = lang[mlang].menusmtp;
    document.getElementById("menucloud_head").textContent = lang[mlang].menucloud_head;
    document.getElementById("menucloud_head2").textContent = lang[mlang].menucloud;
    document.getElementById("menucloud_lbl").textContent = lang[mlang].menucloud_lbl;
    document.getElementById("menucloud_en").textContent = lang[mlang].menucloud_en;
    document.getElementById("menucloud_help").textContent = lang[mlang].menucloud_help;
    document.getElementById("subdomain").placeholder = lang[mlang].subdomain;
    document.getElementById("adminemail").placeholder = lang[mlang].adminemail;
    document.getElementById("lic_cld_key").placeholder = lang[mlang].placeholderlic_key;
    document.getElementById("lic_cld_cus").placeholder = lang[mlang].placeholderlic_customer;
    document.getElementById("lic_cld_onl").textContent = lang[mlang].lic_val_btn;
    document.getElementById("lic_cld_off").textContent = lang[mlang].lic_val_off_btn;
    document.getElementById("licxp").textContent = lang[mlang].licexp;
    document.getElementById("lchng_btn").textContent = lang[mlang].lic_chng_btn;
    document.getElementById("cloudcancel").textContent = lang[mlang].cancel;
    document.getElementById("cloudsave").textContent = lang[mlang].save;
    document.getElementById("smtpsrv").placeholder = lang[mlang].smtpsrv;
    document.getElementById("smtpport").placeholder = lang[mlang].smtpport;
    document.getElementById("smtpusr").placeholder = lang[mlang].smtpusr;
    document.getElementById("smtppwd").placeholder = lang[mlang].smtppwd;
    document.getElementById("smtptypelbl").textContent = lang[mlang].smtptypelbl;
    document.getElementById("smtpemail").placeholder = lang[mlang].smtptestemail;
    document.getElementById("smtpsave").textContent = lang[mlang].save;
    document.getElementById("smtptest").textContent = lang[mlang].smtptest;
    document.getElementById("smtpcancel").textContent = lang[mlang].cancel;
    document.getElementById("smtphead").textContent = lang[mlang].smtphead;
    document.getElementById("vfact").textContent = lang[mlang].vfact;
    document.getElementById("vftitle").placeholder = lang[mlang].vftitle;
    document.getElementById("vfname").placeholder = lang[mlang].vfname;
    document.getElementById("vflogolbl").textContent = lang[mlang].vflogolbl;
    document.getElementById("vfsender").placeholder = lang[mlang].vfsender;
    document.getElementById("vfpolicy").placeholder = lang[mlang].vfpolicy;
    document.getElementById("vfsave").textContent = lang[mlang].save;
    document.getElementById("vfcancel").textContent = lang[mlang].cancel;
    document.getElementById("lblkiosk").textContent = lang[mlang].lblkiosk;
    document.getElementById("penroll_head").textContent = lang[mlang].penroll_head;
    document.getElementById("penroll_headlbl").textContent = lang[mlang].penroll_headlbl;
    document.getElementById("penroll_card").textContent = lang[mlang].penroll_card;
    document.getElementById("penroll_btn").textContent = lang[mlang].penroll_btn;
    document.getElementById("penroll_sel").textContent = lang[mlang].penroll_sel[0];
    document.getElementById("lblenroll").textContent = lang[mlang].lblenroll;
    // document.getElementById("rels_sel").textContent = lang[mlang].penroll_sel[0];
    document.getElementById("usersync_sel").textContent = lang[mlang].penroll_sel[0];
    // document.getElementById("rels_btn").textContent = lang[mlang].rels_btn;
    // document.getElementById("ep_add_lbl").textContent = lang[mlang].priv_rels;
    // document.getElementById("ep_lbl").textContent = lang[mlang].priv_lbl;
    // document.getElementById("ep_apply").textContent = lang[mlang].save;
    // document.getElementById("ep_cancel").textContent = lang[mlang].cancel;
    // document.getElementById("clear_sel").textContent = lang[mlang].cle_sync;
    document.getElementById("img_sel").textContent = lang[mlang].img_sync;
    document.getElementById("use_imgs").textContent = lang[mlang].use_imgs;
    document.getElementById("use_cle").textContent = lang[mlang].use_cle;
    // document.getElementById("qruse_lbl").textContent = lang[mlang].qruse_lbl;
    document.getElementById("reg_lbl").textContent = lang[mlang].users_lbl;
    // document.getElementById("use_cau").textContent = lang[mlang].qrcard;
    // document.getElementById("use_qr").textContent = lang[mlang].qruse;
    // document.getElementById("qrsave").textContent = lang[mlang].save;
    // document.getElementById("qrcancel").textContent = lang[mlang].cancel;
    select_type.setAttribute("data-onlabel", lang[mlang].sel_type[0]);
    select_type.setAttribute("data-offlabel", lang[mlang].sel_type[1]);
    document.getElementById("kiosk_head").textContent = lang[mlang].kiosk_head;
    document.getElementById("kiosk_headlbl").textContent = lang[mlang].kiosk_headlbl;
    document.getElementById("kiosk_card").textContent = lang[mlang].kiosk_card;
    document.getElementById("kilbl_ava").textContent = lang[mlang].kilbl_ava;
    document.getElementById("kilbl_act").textContent = lang[mlang].kilbl_act;
    document.getElementById("kilbl_tot").textContent = lang[mlang].kilbl_tot;
    document.getElementById("kilbl_head").textContent = lang[mlang].kilbl_head;
    document.getElementById("kilbl_add").textContent = lang[mlang].kilbl_add;
    document.getElementById("btn_close_kiosk").textContent = lang[mlang].close
};

let ConfLoad = () => {
    APICallSDG("get", "/getconf").then(response => {
        if (response.status == 200) {
            if (!response.data.license) {
                console.log("Not activated");
                Components(false)
            } else {
                if (!response.data.session || response.data.session.length == 0) {
                    console.log("No Session available conf")
                } else {
                    elementtimeout.value = response.data.session.timeout;
                    TimeOut = response.data.session.timeout;
                    Control()
                }
                Components(true);
                document.getElementById("lic_exp").innerText = response.data.license;
                if (!response.data.lang || response.data.lang.length == 0) {
                    console.log("No LANG available conf")
                } else {
                    SetLang(response.data.lang.lang);
                    localStorage.lang = response.data.lang.lang;
                    document.getElementById("langoptions").selectedIndex = response.data.lang.lang == "es" ? 2 : 1
                }
                if (!response.data.credentials) {
                    console.log("No Credentials");
                    CompSettings("b2", true)
                } else {
                    let creds = JSON.parse(CDecrypt(response.data.credentials));
                    CompSettings("b2", false);
                    document.getElementById("b2_usr").value = creds.username;
                    document.getElementById("b2_pass").value = creds.password ? defaultpassword : ""
                }
                if (!response.data.srv_settings) {
                    console.log("No Previous conf for CCURE server");
                    CompSettings("cc", true)
                } else {
                    let srvsettings = JSON.parse(CDecrypt(response.data.srv_settings));
                    CompSettings("cc", false);
                    sql_dname.value = srvsettings.server;
                    sql_port.value = srvsettings.port;
                    auth_type.selectedIndex = parseInt(srvsettings.mode);
                    document.getElementById("sql_type").style.display = srvsettings.auth_type == "sql" ? "block" : "none";
                    sql_user.value = srvsettings.user;
                    sql_pass.value = srvsettings.pass ? defaultpassword : "";
                    sql_encrypt.checked = srvsettings.encrypt;
                    sql_trust.checked = srvsettings.trust
                }
                let b2bk = "dis";
                if (!!response.data.b2status) {
                    b2bk = "";
                    document.getElementById("b2_status").textContent = "ONLINE"
                } else document.getElementById("b2_status").textContent = "";
                document.getElementById("b2bk").src = "./images/" + b2bk + "conn.png"
            }
        } else {
            console.log(response.data)
        }
    }).catch(err => {
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            console.log("(APICallB2/GetConf) ", err);
            Logout(false)
        }
        console.log(err)
    })
};
let EditConn = opc => {
    if (opc) {
        document.getElementById("b2_pass").value = "";
        CompSettings("b2", true)
    } else {
        document.getElementById("sql_pass").value = "";
        CompSettings("cc", true)
    }
};
let ClearElements = () => {
    if (table_dev) {
        table_dev.destroy();
        table_dev = null
    }
    if (table_usr) {
        table_usr.destroy();
        table_usr = null
    }
    if (table_formats) {
        table_formats.destroy();
        table_formats = null
    }
    if (table_add) {
        table_add.clear();
        table_add.destroy();
        table_add.clear().draw();
        $("#t_devsadd" + " tbody").empty();
        $("#t_devsadd" + " thead").empty();
        table_add = null
    }
    selected_usr = null;
    selected_dev = null;
    devices_array = [];
    users_array = [];
    devs_cmd = [];
    search_type = "udp";
    document.getElementById("normalsearch").checked = true;
    document.getElementById("advparams").style.display = "none";
    document.getElementById("btn_add").disabled = true;
    document.getElementById("fcc").value = 0;
    document.getElementById("btncmds").style.display = "none";
    document.getElementById("penroll_send").style.display = "none"
};

function Close() {
    $("#menu_div").collapse("toggle");
    ClearElements();
    if (pInter) {
        clearInterval(pInter);
        pInter = null
    }
}

function ShowConfMenu() {
    $("#menuconf_div").collapse("toggle")
}

function DevTypes(callback) {
    APICallB2("get", "device_types").then(resp_dev => {
        if (resp_dev.status == 200) {
            callback(resp_dev.data.DeviceTypeCollection.rows)
        } else {
            callback(0)
        }
    }).catch(erro => {
        callback(0)
    })
}

function Search() {
    if (search_type == "tcp") {
        let mIP = document.getElementById("dev_ip").value;
        let mPort = document.getElementById("dev_port").value;
        if (mIP == "" || mPort == "") {
            toastr.error(lang[lang_id].emptyfields)
        } else {
            Swal.fire({
                icon: "info",
                text: lang[lang_id].search_label,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });
            APICallB2("post", "devices/tcp_search", {
                Device: {
                    lan: {
                        ip: mIP,
                        device_port: mPort
                    }
                }
            }).then(response => {
                if (response.status == 200 && response.data.DeviceCollection) {
                    devices_array = [];
                    Swal.close();
                    DevTypes(devset => {
                        table_add = CreateTable(table_add, "t_devsadd:tcp", response.data.DeviceCollection.rows, devset)
                    })
                } else {
                    console.log("TCP Search, code: ", response.status);
                    Swal.close()
                }
            }).catch(err => {
                if (err.response && err.response.status == 400) {
                    console.log("(APICallB2/TCPSearch:Scan) ", err);
                    Logout(false)
                } else {
                    console.log("(APICallB2/TCPSearch:Scan) ", err);
                    Swal.close();
                    Swal.fire({
                        icon: "warning",
                        text: lang[lang_id].nonewdevs
                    })
                }
            })
        }
    } else {
        Swal.fire({
            icon: "info",
            text: lang[lang_id].search_label,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading()
            }
        });
        APICallB2("post", "devices/udp_search", {
            UdpSearchOption: {
                timeout: 3,
                with_rs485: true,
                hide_known_devices: true
            }
        }).then(response => {
            if (response.status == 200 && response.data.DeviceCollection) {
                console.log(response.data);
                devices_array = [];
                Swal.close();
                table_add = CreateTable(table_add, "t_devsadd:udp", response.data.DeviceCollection.rows)
            } else {
                console.log("NO NEW DEVICES");
                Swal.close();
                Swal.fire({
                    icon: "warning",
                    text: lang[lang_id].nonewdevs
                })
            }
        }).catch(err => {
            if (err.response && err.response.status == 400) {
                console.log("(APICallB2/UDPSearch:Scan) ", err);
                Logout(false)
            } else {
                console.log("(APICallB2/UDPSearch:Scan) ", err);
                Swal.close()
            }
        })
    }
}

function AddDevices() {
    let devsallowed = [];
    let alldevs = [];
    Swal.fire({
        icon: "info",
        text: lang[lang_id].devadding_info,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });
    let rows = [];
    devices_array.forEach(device => {
        rows.push({
            id: device[0],
            lan: {
                ip: device[3].split(":")[0],
                device_port: device[3].split(":")[1],
                enable_dhcp: false
            },
            device_group_id: {
                id: 1
            }
        })
    });
    APICallSDG("post", "/devices", {
        DeviceCollection: {
            rows: rows
        }
    }).then(checkdevs => {
        if (checkdevs.status == 200) {
            Swal.close();
            console.log(checkdevs.data);
            checkdevs.data.forEach(dev => {
                devsallowed.push(parseInt(dev.id))
            });
            rows.forEach(dev => {
                alldevs.push(parseInt(dev.id))
            });
            let devsforbidden = alldevs.filter(x => !devsallowed.includes(x));
            devsallowed = [];
            checkdevs.data.forEach(rec_dev => {
                devsallowed.push(`<b>ID:</b> ${rec_dev.id}, <b>${lang[lang_id].deviceidadd[0]}:</b> ${rec_dev.response==200||rec_dev.response==500?"True":"False"} <br>`)
            });
            ClearElements();
            Swal.fire({
                icon: "info",
                html: `<b>${lang[lang_id].deviceidadd[1]}:</b><br> ${devsallowed.join("")} ${devsforbidden.length==0?"":`<br><b>${lang[lang_id].deviceidadd[2]}:</b><br>`+devsforbidden.join(",<br>")+`<br>${lang[lang_id].deviceidadd[3]}`}`
            });
            GetDevList()
        } else {
            Swal.close();
            console.log("(APICallSDG/AddDevices), CODE: ", checkdevs.status);
            console.log(checkdevs.data)
        }
    }).catch(err => {
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            console.log("(APICallB2/AddDevices) ", err);
            Logout(false)
        } else {
            console.log("(APICallB2/AddDevices) ", err);
            Swal.close();
            Swal.fire({
                icon: "error",
                html: lang[lang_id].devsnotregistered_err,
                showConfirmButton: true
            })
        }
    })
}

function GetReportList() {
    APICallSDG("post", "/reports", {
        scan: true
    }).then(rep_res => {
        if (rep_res.status == 200) {
            let repos = document.getElementById("syncreports");
            let bodyreports = document.getElementById("bodyreports");
            bodyreports.replaceChildren();
            if (rep_res.data.length != 0) {
                repos.style.display = "flex";
                rep_res.data.forEach(filename => {
                    let icon = document.createElement("img");
                    icon.src = "images/excel.png";
                    icon.width = 24;
                    let rep = document.createElement("button");
                    rep.classList = "btn btn-link btn-block text-left";
                    rep.addEventListener("click", GetReport);
                    let label = document.createElement("span");
                    label.textContent = filename;
                    rep.appendChild(icon);
                    rep.appendChild(label);
                    bodyreports.appendChild(rep)
                })
            } else {
                bodyreports.replaceChildren();
                repos.style.display = "none"
            }
        }
    }).catch(err => {
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            console.log("(APICallSDG/GetReports) ", err);
            Logout(false)
        } else {
            console.log(err);
            console.log("Get Reports: ERROR");
            toastr.error("Error", "Get Reports")
        }
    })
}

function SyncProgress() {
    APICallSDG("get", "/syncprogress").then(sync_res => {
        if (sync_res.status == 200) {
            console.log(`Stage: ${sync_res.data.progress.stage}/${sync_res.data.progress.stages}`);
            prog_info.innerHTML = `<b>Stage</b>: ${sync_res.data.progress.stage}/${sync_res.data.progress.stages}`;
            console.log(`Time> ${(new Date).toISOString()}`);
            console.log(`Percentaje Completed: ${(sync_res.data.progress.percent[0]/sync_res.data.progress.percent[1]).toFixed(2)}`);
            console.log(sync_res.data.progress.percent);
            let percent = sync_res.data.progress.percent[0] != 0 ? `${(sync_res.data.progress.percent[0]/sync_res.data.progress.percent[1]*100).toFixed(2)}%` : "1%";
            prog_bar.textContent = percent;
            prog_bar.style.width = percent;
            if (sync_res.data.progress.stage != 0 && !pInter) {
                $("#panelProg").collapse("show");
                console.log("Setting Interval");
                pInter = setInterval(SyncProgress, 2e3)
            } else if (sync_res.data.progress.stage == 0) {
                prog_info.textContent = "No Pending operations";
                prog_bar.style.width = "0%";
                clearInterval(pInter);
                pInter = null;
                GetReportList();
                setTimeout(function () {
                    $("#panelProg").collapse("hide")
                }, DismissTime)
            }
        }
    }).catch(err => {
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            if (pInter) clearInterval(pInter);
            console.log("(APICallSDG/SyncProgress) ", err);
            Logout(false)
        } else {
            console.log("Sync Progress: ERROR");
            toastr.error("Error", "Sync Progress")
        }
    })
}

function SyncUsers() {
    Swal.fire({
        icon: "warning",
        title: lang[lang_id].beforeproceed,
        html: lang[lang_id].beforesync,
        showCancelButton: true,
        confirmButtonText: lang[lang_id].accept,
        cancelButtonText: lang[lang_id].cancel
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: "info",
                text: lang[lang_id].pleasewait,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });
            let body = {
                all: false
            };
            body.all = table_usr.rows(".selected").data().length == table_usr.rows().data().length ? true : false;
            body.payload = table_usr.rows(".selected").data().toArray().map(usr => usr[0]);
            APICallSDG("post", "/syncusers", body).then(sync_res => {
                if (sync_res.status == 200) {
                    Swal.close();
                    if (sync_res.data) {
                        Swal.fire({
                            icon: "info",
                            title: lang[lang_id].report,
                            html: lang[lang_id].user_syncstart,
                            showCancelButton: true,
                            confirmButtonText: lang[lang_id].accept,
                            cancelButtonText: lang[lang_id].cancel
                        });
                        SyncProgress()
                    }
                }
            }).catch(err => {
                Swal.close();
                if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                    console.log("(APICallSDG/SyncUsers) ", err);
                    Logout(false)
                } else {
                    console.log("Users Sync: ERROR");
                    Swal.fire({
                        icon: "error",
                        title: lang[lang_id].error,
                        text: lang[lang_id].errorsync,
                        showConfirmButton: false,
                        timer: 2400,
                        timerProgressBar: true
                    })
                }
            })
        }
    })
}

function SyncClearances() {
    Swal.fire({
        icon: "warning",
        title: lang[lang_id].beforeproceed,
        html: lang[lang_id].beforesyncCle,
        showCancelButton: true,
        confirmButtonText: lang[lang_id].accept,
        cancelButtonText: lang[lang_id].cancel
    }).then(result => {
        if (result.isConfirmed) {
            if (table_usr.rows(".selected").data().length != 0) {
                Swal.fire({
                    icon: "info",
                    text: lang[lang_id].pleasewait,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                });
                let payload = table_usr.rows(".selected").data().length != table_usr.rows().data().length ? table_usr.rows(".selected").data().toArray().map(usr => usr[0]) : null;
                let body = {
                    add: true,
                    user: true,
                    user_id: payload,
                    cle_id: null
                };
                APICallSDG("post", "/clearancesync", body).then(sync_cle => {
                    if (sync_cle.status == 200) {
                        console.log("Sync by Clearances response: ", sync_cle.data);
                        if (sync_cle.data) {
                            Swal.fire({
                                icon: "info",
                                title: lang[lang_id].report,
                                html: lang[lang_id].user_syncstart,
                                showCancelButton: true,
                                confirmButtonText: lang[lang_id].accept,
                                cancelButtonText: lang[lang_id].cancel
                            });
                            SyncProgress()
                        }
                    }
                }).catch(err => {
                    Swal.close();
                    console.log(err);
                    if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                        console.log("(APICallSDG/SyncClearances) ", err);
                        Logout(false)
                    } else {
                        console.log("SyncClearances: ERROR");
                        Swal.fire({
                            icon: "error",
                            title: lang[lang_id].error,
                            text: lang[lang_id].errorsync,
                            showConfirmButton: false,
                            timer: 2400,
                            timerProgressBar: true
                        })
                    }
                })
            } else {
                Swal.fire({
                    icon: "warning",
                    title: lang[lang_id].error,
                    text: lang[lang_id].empty_users,
                    showConfirmButton: false,
                    timer: 2400,
                    timerProgressBar: true
                })
            }
        }
    })
}

function SyncImgs() {
    Swal.fire({
        icon: "warning",
        title: lang[lang_id].beforeproceed,
        html: lang[lang_id].beforesyncImg,
        showCancelButton: true,
        confirmButtonText: lang[lang_id].accept,
        cancelButtonText: lang[lang_id].cancel
    }).then(result => {
        if (result.isConfirmed) {
            if (table_usr.rows(".selected").data().length != 0) {
                Swal.fire({
                    icon: "info",
                    text: lang[lang_id].pleasewait,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                });
                let body = {
                    all: false
                };
                body.all = table_usr.rows(".selected").data().length == table_usr.rows().data().length ? true : false;
                body.payload = table_usr.rows(".selected").data().toArray().map(usr => usr[0]);
                APICallSDG("post", "/images", body).then(sync_img => {
                    if (sync_img.status == 200) {
                        if (sync_img.data) {
                            Swal.fire({
                                icon: "info",
                                title: lang[lang_id].report,
                                html: lang[lang_id].user_syncstart,
                                showCancelButton: true,
                                confirmButtonText: lang[lang_id].accept,
                                cancelButtonText: lang[lang_id].cancel
                            });
                            SyncProgress()
                        }
                    }
                }).catch(err => {
                    Swal.close();
                    if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                        console.log("(APICallSDG/SyncProfilePics) ", err);
                        Logout(false)
                    } else {
                        console.log("SyncProfilePics: ERROR", err);
                        Swal.fire({
                            icon: "error",
                            title: lang[lang_id].error,
                            text: lang[lang_id].errorsync,
                            showConfirmButton: false,
                            timer: 2400,
                            timerProgressBar: true
                        })
                    }
                })
            } else {
                Swal.fire({
                    icon: "warning",
                    title: lang[lang_id].error,
                    text: lang[lang_id].empty_users,
                    showConfirmButton: false,
                    timer: 2400,
                    timerProgressBar: true
                })
            }
        }
    })
}

function GetReport(opc) {
    console.log(opc.target);
    if (opc.target.textContent != "") {
        console.log(opc.target.textContent);
        axios({
            method: "post",
            url: SDGSrv + "/api/sdg/reports",
            data: {
                name: opc.target.textContent
            },
            responseType: "arraybuffer",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                Authorization: "SDG-sns " + sdg_sessionid
            }
        }).then(rep_res => {
            if (rep_res.status == 200) {
                console.log(rep_res.data);
                let element = document.createElement("a");
                let url = window.URL.createObjectURL(new Blob([rep_res.data]));
                element.href = url;
                element.download = opc.target.textContent;
                element.style.display = "none";
                document.body.append(element);
                element.click();
                element.remove();
                window.URL.revokeObjectURL(url);
                setTimeout(GetReportList, DismissTime)
            }
        }).catch(err => {
            if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                console.log("(APICallSDG/GetReports) ", err);
                Logout(false)
            } else {
                console.log(err);
                console.log("Get Reports: ERROR");
                toastr.error("Error", "Get Reports")
            }
        })
    }
}

function GetDevIcons(devname) {
    if (devname.includes("BEP2")) {
        return "devs/bep2.png"
    } else if (devname.includes("XP2-MDP")) {
        return "devs/xp2-mdpb.png"
    } else if (devname.includes("XP2-GDP")) {
        return "devs/xp2-gdpb.png"
    } else if (devname.includes("XP2-GKDP")) {
        return "devs/xp2-gkdpb.png"
    } else if (["FSF2-AB", "FSF2-DB"].includes(devname)) {
        return "devs/fsf2-_b.png"
    } else if (devname.includes("FSF2-ODB")) {
        return "devs/fsf2-odb.png"
    } else if (devname.includes("FS2")) {
        return "devs/fs2.png"
    } else if (devname.includes("BLN2")) {
        return "devs/bln2.png"
    } else if (["XS2-A", "XS2-D"].includes(devname)) {
        return "devs/xs2-_pb.png"
    } else if (devname.includes("XS2-O")) {
        return "devs/xs2-o_pb.png"
    } else if (devname.includes("XS2-Q")) {
        return "devs/xs2-q_pb.png"
    } else if (devname.includes("SIO2")) {
        return "devs/sio2.png"
    } else if (devname.includes("BS2")) {
        return "devs/bs2.png"
    } else if (devname.includes("BS3")) {
        return "devs/bs3.png"
    } else {
        return "devs/bep2.png"
    }
}

function CreateTable(table = null, table_id, datos, devtypes = null) {
    let data = [];
    Columns = {
        t_wformat: [{
            title: lang[lang_id].wiegand_fields[0]
        }, {
            title: lang[lang_id].wiegand_fields[1]
        }, {
            title: lang[lang_id].wiegand_fields[2]
        }],
        t_usersync: [{
            title: lang[lang_id].user_id
        }, {
            title: lang[lang_id].user_name
        }, {
            title: lang[lang_id].user_email
        }, {
            title: lang[lang_id].user_img
        }, {
            title: lang[lang_id].user_cards
        }],
        t_penroll: [{
            title: lang[lang_id].user_id
        }, {
            title: lang[lang_id].user_name
        }, {
            title: lang[lang_id].user_status
        }, {
            title: lang[lang_id].user_email
        }, {
            title: lang[lang_id].user_ncards
        }, {
            title: lang[lang_id].user_fingers
        }, {
            title: lang[lang_id].user_faces
        }],
        t_devices: [{
            title: lang[lang_id].device_id
        }, {
            title: lang[lang_id].status
        }, {
            title: lang[lang_id].model
        }, {
            title: lang[lang_id].device_name
        }],
        t_devsadd: [{
            title: lang[lang_id].device_id
        }, {
            title: lang[lang_id].status
        }, {
            title: lang[lang_id].device_name
        }, {
            title: lang[lang_id].dev_address
        }],
        t_priv: [{
            title: lang[lang_id].priv_id
        }, {
            title: lang[lang_id].priv_name
        }],
        t_devgroup: [{
            title: lang[lang_id].devg_id
        }, {
            title: lang[lang_id].devg_name
        }],
        t_rels: [{
            title: lang[lang_id].priv_id
        }, {
            title: lang[lang_id].priv_name
        }, {
            title: lang[lang_id].devg_id
        }, {
            title: lang[lang_id].devg_name
        }]
    };
    Columns.t_curdevs = Columns.t_devices;
    datos = table_id.includes("devs") ? datos.filter(dev => !extdevs.includes(parseInt(dev.device_type_id.id))) : datos;
    switch (table_id) {
        case "t_wformat":
            datos.forEach(format => {
                if (format.name) data.push([format.id, format.name, format.length])
            });
            break;
        case "t_usersync":
            datos.forEach(user => {
                data.push([user.ObjectID, user.Name, user.Email != "null" ? user.Email : null, user.Image ? user.Image : false, user.Cards != "null" ? user.Cards.unique().join("; ") : null])
            });
            break;
        case "t_penroll":
            datos.forEach(user => {
                if (user.user_id != 1) data.push([user.user_id, user.name, !user.disabled, user.email ? user.email : "", user.card_count, user.fingerprint_template_count, user.visual_face_count])
            });
            break;
        case "t_devsadd:udp":
            datos.forEach(device => {
                data.push([device.id, device.server_connected.status == "disconnected" ? lang[lang_id].connectable : lang[lang_id].notconnectable, device.device_type_id.name, device.lan.ip + ":" + device.lan.device_port])
            });
            table_id = table_id.split(":")[0];
            break;
        case "t_devsadd:tcp":
            table_id = table_id.split(":")[0];
            datos.forEach(device => {
                let dev_name = !!devtypes ? devtypes.find(dev => dev.id == device.device_type_id.id).name : device.device_type_id.id;
                data.push([device.id, lang[lang_id].connectable, dev_name, device.lan.ip + ":" + device.lan.device_port])
            });
            break;
        case "t_priv":
            data = datos.map(priv => [priv.ObjectID, priv.Name]);
            break;
        case "t_devgroup":
            data = datos.map(dg => [dg.id, dg.name.split(":")[0], dg.name.split(":")[1] ? dg.name.split(":")[1] : 0]);
            break;
        case "t_rels":
            if (datos) {
                data = datos
            }
            break;
        default:
            datos.forEach(device => {
                data.push([device.id, "<img height='49' src=" + GetDevIcons(device.version.product_name) + "> <img height='20' style='vertical-align: bottom;' src=images/" + (device.status == 1 ? "" : device.status == 2 ? "syn" : "dis") + "conn.png>", device.version.product_name, device.name, device.status])
            })
    }
    if ($.fn.dataTable.isDataTable("#" + table_id)) {
        table.destroy()
    }
    let t_conf = {
        data: data,
        columns: Columns[table_id],
        language: {
            url: lang[lang_id].datatable
        },
        columnDefs: [{
            target: "_all",
            className: "dt-head-center"
        }]
    };
    if (table_id == "t_usersync") {
        t_conf.dom = "<lpf<rt>ip>";
        t_conf.lengthMenu = [50, 100, 250, 500, 750, 1e3, 1500, 2e3, 3e3, 4e3, 5e3, 7e3, 1e4]
    }
    table = new DataTable("#" + table_id, t_conf);
    return table
}

function DelDev() {
    if (devs_cmd.length != 0) {
        Swal.fire({
            icon: "warning",
            title: lang[lang_id].beforeproceed,
            html: lang[lang_id].beforeproceedtext,
            showCancelButton: true
        }).then(result => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "info",
                    text: lang[lang_id].pleasewait,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                });
                APICallB2("delete", "devices?id=" + devs_cmd.join("+")).then(del_resp => {
                    if (del_resp.status == 200) {
                        console.log("Device(s) successfully deleted");
                        devs_cmd = [];
                        Swal.fire({
                            icon: "info",
                            width: 300,
                            text: lang[lang_id].applysuccess,
                            timer: DismissTime,
                            timerProgressBar: true,
                            showConfirmButton: false
                        });
                        GetDevList()
                    }
                }).catch(error => {
                    console.error(error.response);
                    Swal.fire({
                        icon: "error",
                        width: 300,
                        title: lang[lang_id].error + (error.response ? ": " + error.response.status : ""),
                        timer: DismissTime,
                        text: error.response ? error.response.data.Response.code == "610" ? lang[lang_id].dev_delerr[1] + " (610)" : lang[lang_id].dev_delerr[0] + ` (${error.response.data.Response.code})` : "",
                        timerProgressBar: true,
                        showConfirmButton: false
                    })
                })
            }
        })
    }
}

function SyncDev() {
    if (devs_cmd.length != 0) {
        Swal.fire({
            icon: "warning",
            title: lang[lang_id].beforeproceed,
            html: lang[lang_id].beforeresync,
            showCancelButton: true
        }).then(result => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "info",
                    text: lang[lang_id].pleasewait,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                });
                APICallSDG("post", "/clearancesettings", {
                    store: false
                }).then(res => {
                    if (res.status == 200) {
                        console.log(res.data);
                        if (res.data) {
                            let payload = [];
                            if (table_dev.rows(".selected").data().length != table_dev.rows().data().length) payload = table_dev.rows(".selected").data().toArray().map(x => x[0]);
                            APICallSDG("put", "/clearancesync", payload).then(res => {
                                if (res.status == 200) {
                                    Swal.fire({
                                        icon: "success",
                                        title: lang[lang_id].user_synced[0],
                                        html: lang[lang_id].user_synced[1]
                                    })
                                }
                            }).catch(error => {
                                console.error(error);
                                Swal.fire({
                                    icon: "error",
                                    width: 300,
                                    title: lang[lang_id].error + (error.response ? ": " + error.response.status : ""),
                                    timer: DismissTime,
                                    text: error.response ? `(${error.response.data.Response.code})` : "",
                                    timerProgressBar: true,
                                    showConfirmButton: false
                                })
                            })
                        } else {
                            let dev_ids = devs_cmd.map(dev => {
                                return {
                                    id: dev
                                }
                            });
                            APICallB2("POST", "devices/sync?clean=true", {
                                DeviceCollection: {
                                    rows: dev_ids
                                }
                            }).then(resp => {
                                if (resp.status == 200) {
                                    console.log("Device(s) successfully processed");
                                    devs_cmd = [];
                                    if (resp.data.InProgressDeviceCollection) {
                                        let devs = resp.data.InProgressDeviceCollection.rows.map(dev => dev.id);
                                        let msg = resp.data.InProgressDeviceCollection ? lang[lang_id].deleteresync[0] + resp.data.InProgressDeviceCollection.rows.length + lang[lang_id].deleteresync[1] + devs.join() + "<hr>" + lang[lang_id].deleteresync[2] : lang[lang_id].deleteresync[2];
                                        Swal.fire({
                                            icon: "success",
                                            title: resp.data.Response.message,
                                            html: msg
                                        })
                                    } else {
                                        Swal.fire({
                                            icon: "info",
                                            text: resp.data.Response.message
                                        })
                                    }
                                    GetDevList()
                                }
                            }).catch(error => {
                                console.error(error);
                                Swal.fire({
                                    icon: "error",
                                    width: 300,
                                    title: lang[lang_id].error + (error.response ? ": " + error.response.status : ""),
                                    timer: DismissTime,
                                    text: error.response ? `(${error.response.data.Response.code})` : "",
                                    timerProgressBar: true,
                                    showConfirmButton: false
                                })
                            })
                        }
                    }
                }).catch(err => {
                    console.log("(Get APICallSDG/ClearanceSettings) ", err);
                    if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                        Logout(false)
                    }
                })
            }
        })
    }
}
let GetDevList = (devtype = null) => {
    let bodycall = devtype ? {
        limit: 0,
        feature_types: [devtype]
    } : {
        limit: 0
    };
    APICallSDG("get", "/ext").then(resp => {
        if (resp.status == 200) {
            extdevs = JSON.parse(CDecrypt(resp.data)).map(row => row.id)
        }
    }).catch(err => {
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            console.log("(APICallSDG/GetEXT) ", err);
            Logout(false)
        } else {
            console.log("(APICallSDG/GetEXT) ", err)
        }
    });
    APICallB2("post", "v2/devices/search", bodycall).then(response => {
        if (response.status == 200) {
            console.log(response.data.DeviceCollection.rows);
            table_dev = CreateTable(table_dev, "t_curdevs", response.data.DeviceCollection.rows)
        } else {
            console.log("otro codigo")
        }
    }).catch(err => {
        if (err.response && err.response.status == 400) {
            console.log("(APICallB2/GetDevList) ", err);
            Logout(false)
        } else {
            console.log("(APICallB2/GetDevList) ", err)
        }
    })
};
let GetUserList = () => {
    select_count.textContent = "0";
    Swal.fire({
        icon: "info",
        text: lang[lang_id].pleasewait,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });
    APICallSDG("post", "/clearancesettings", {
        store: false
    }).then(res => {
        if (res.status == 200) {
            console.log(res.data);
            use_clearances.switchButton(res.data ? "on" : "off", true);
            btn_clearances.style.display = res.data ? "block" : "none"
        }
    }).catch(err => {
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            Logout(false)
        } else {
            use_clearances.switchButton("off", true);
            btn_clearances.style.display = "none"
        }
    });
    APICallSDG("post", "/propicsettings", {
        store: false
    }).then(res => {
        if (res.status == 200) {
            console.log(res.data);
            use_imgs.switchButton(res.data ? "on" : "off", true);
            btn_propics.style.display = res.data ? "block" : "none"
        }
    }).catch(err => {
        console.log("(Get APICallSDG/ProfileImageSettings) ", err);
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            Logout(false)
        } else {
            use_imgs.switchButton("off", true);
            btn_propics.style.display = "none"
        }
    });
    APICallSDG("get", "/ccusers").then(response => {
        if (response.status == 200) {
            table_usr = CreateTable(table_usr, "t_usersync", response.data)
        } else {
            console.log("Other Code:", response.status)
        }
    }).catch(err => {
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            console.log("(APICallSDG/GetUserList) ", err);
            Logout(false)
        } else {
            console.log("(APICallSDG/GetUserList) ", err)
        }
    }).finally(() => {
        Swal.close()
    });
    SyncProgress();
    GetReportList()
};
let ChangeB2Lic = () => {
    Swal.fire({
        icon: "warning",
        title: lang[lang_id].beforeproceed,
        html: lang[lang_id].cloudlic,
        showCancelButton: true,
        confirmButtonText: lang[lang_id].accept,
        cancelButtonText: lang[lang_id].cancel
    }).then(result => {
        if (result.isConfirmed) {
            CloudLicense(false)
        }
    })
};
let LoadFormatConf = () => {
    APICallSDG("get", "/confsync").then(response => {
        if (response.status == 200) {
            document.getElementById("fcc").value = response.data.fc;
            table_formats.rows().every(function (index) {
                if (response.data.formats.find(format => format.id == index) != undefined) {
                    $(this.node()).addClass("selected")
                }
            });
            Swal.close()
        }
    }).catch(err => {
        Swal.close();
        btn_usersync.disabled = true;
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            console.log("(APICallSDG/LoadFormatConf) ", err);
            Logout(false)
        } else {
            console.log("(APICallSDG/LoadFormatConf) ", err)
        }
    })
};
let GetWiegandFormats = () => {
    Swal.fire({
        icon: "info",
        text: lang[lang_id].pleasewait,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });
    APICallB2("get", "cards/wiegand_formats").then(response => {
        table_formats = CreateTable(table_formats, "t_wformat", response.data.WiegandFormatCollection.rows);
        LoadFormatConf()
    }).catch(err => {
        Swal.close();
        if (err.response && err.response.status == 400) {
            console.log("(APICallB2/GetWiegandFormats) ", err);
            Logout(false)
        } else {
            console.log("(APICallB2/GetWiegandFormats) ", err)
        }
    })
};
let SaveWFormat = () => {
    Swal.fire({
        icon: "warning",
        title: lang[lang_id].beforeproceed,
        html: lang[lang_id].beforewformat,
        showCancelButton: true,
        confirmButtonText: lang[lang_id].accept,
        cancelButtonText: lang[lang_id].cancel
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: "info",
                text: lang[lang_id].pleasewait,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });
            let formats = table_formats.rows(".selected").data().toArray().map(f => ({
                id: f[0],
                name: f[1]
            }));
            APICallSDG("post", "/formatsettings", {
                fc: fcc.value,
                formats: formats
            }).then(format_response => {
                if (format_response.status == 200) {
                    console.log(format_response.data);
                    Swal.close();
                    Swal.fire({
                        icon: "success",
                        width: 300,
                        title: lang[lang_id].success,
                        showConfirmButton: false,
                        timer: 2400,
                        timerProgressBar: true
                    });
                    ShowConfMenu()
                }
            }).catch(err => {
                Swal.close();
                if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                    console.log("(APICallSDG/FormatSettings) ", err);
                    Logout(false)
                } else {
                    console.log("Formats Update: ERROR");
                    Swal.fire({
                        icon: "error",
                        title: lang[lang_id].error,
                        text: lang[lang_id].errorformats,
                        showConfirmButton: false,
                        timer: 2400,
                        timerProgressBar: true
                    });
                    ShowConfMenu()
                }
            })
        }
    })
};
let TimeoutCancel = () => {
    document.getElementById("btntimeout").style.display = "none";
    elementtimeout.value = null
};
let TimeoutAccept = () => {
    document.getElementById("btntimeout").style.display = "none";
    TimeOut = elementtimeout.value;
    if (TimeOut != 0) {
        APICallSDG("post", "/settimeout", {
            timeout: TimeOut
        }, false).then(response => {
            if (response.status == 200) {
                Control();
                Swal.fire({
                    icon: "success",
                    title: lang[lang_id].applysuccess,
                    showConfirmButton: false,
                    timer: 2400
                })
            } else {
                console.log(response.data)
            }
        }).catch(err => {
            if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                console.log("(APICallSDG/SetTimeOut) ", err);
                Logout(false)
            }
            toastr.error(err, "Error");
            console.error(err)
        })
    } else {
        elementtimeout.value = TimeOut;
        toastr.error(lang[lang_id].mintimeout[1], lang[lang_id].mintimeout[0])
    }
};
let ChangeLic = () => {
    Swal.fire({
        icon: "warning",
        title: lang[lang_id].beforeproceed,
        html: lang[lang_id].changelic,
        showCancelButton: true
    }).then(result => {
        if (result.isConfirmed) {
            APICallSDG("delete", "/activation").then(resp => {
                if (resp.status == 200) {
                    document.getElementById("afteract").style.display = "none";
                    document.getElementById("beforeact").style.display = "flex";
                    ConfLoad();
                    CompMisc(false)
                }
            }).catch(err => {
                if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                    console.log("(APICallSDG/Activation) ", err);
                    Logout(false)
                }
                console.error(err)
            })
        }
    })
};

function ActivateLic(env) {
    let license = null;
    let customer = null;
    switch (env.id) {
        case "lic_sys_onl":
            license = document.getElementById("lic_sys_key");
            customer = document.getElementById("lic_sys_cus");
            if (!license.value || !customer.value) {
                Swal.fire({
                    icon: "warning",
                    text: lang[lang_id].lic_empty_fields,
                    showConfirmButton: false,
                    timer: 2400
                })
            } else {
                APICallSDG("post", "/activation", {
                    license: license.value,
                    customer: customer.value
                }).then(response => {
                    if (response.status == 200) {
                        Swal.fire({
                            icon: "success",
                            text: lang[lang_id].activation,
                            showConfirmButton: false,
                            timer: 2400
                        });
                        license.value = "";
                        customer.value = "";
                        document.getElementById("lic_exp").textContent = response.data.License.expires_on != "permanent" ? response.data.License.expires_on.split("T")[0] : response.data.License.expires_on;
                        Components(true);
                        ConfLoad()
                    } else {
                        console.log(response.status);
                        document.getElementById("lic_sys_key").value = "";
                        document.getElementById("lic_sys_cus").value = "";
                        Swal.fire({
                            icon: "error",
                            text: lang[lang_id].activationerror,
                            showConfirmButton: false,
                            timer: 2400
                        })
                    }
                }).catch(err => {
                    if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                        console.log("(APICallSDG/Activation) ", err);
                        Logout(false)
                    }
                    toastr.error(err.response.data.message, "Error");
                    console.error(err.response.data.message)
                })
            }
            break;
        case "lic_oth_onl":
            license = document.getElementById("lic_oth_key");
            if (!license.value) Swal.fire({
                icon: "warning",
                text: lang[lang_id].lic_empty_field,
                showConfirmButton: false,
                timer: 2400
            });
            else {
                APICallSDG("post", "/misc/activation", {
                    license: license.value,
                    product: 0
                }).then(response => {
                    if (response.status == 200) {
                        console.log("ACT LIC:", response.data);
                        let types = [{
                            id: SrvK,
                            name: lang[lang_id].kiosk_txt[0]
                        }, {
                            id: CreK,
                            name: lang[lang_id].kiosk_txt[1]
                        }];
                        let msg = types.find(item => item.id == response.data.License.product_id);
                        Swal.fire({
                            icon: msg ? "success" : "warning",
                            html: msg ? msg.name : lang[lang_id].kiosk_txt[2],
                            showConfirmButton: false,
                            timer: 2400
                        });
                        license.value = ""
                    } else {
                        console.log(response.status)
                    }
                }).catch(err => {
                    if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                        console.log("(APICallSDG/OtherActivation) ", err);
                        Logout(false)
                    }
                    toastr.error(err.response.data.message, "Error");
                    console.error(err.response.data.message)
                })
            }
            break;
        case "lic_cld_onl":
            Swal.fire({
                icon: "info",
                text: lang[lang_id].pleasewait,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });
            license = document.getElementById("lic_cld_key");
            customer = document.getElementById("lic_cld_cus");
            if (!license.value || !customer.value) {
                Swal.fire({
                    icon: "warning",
                    text: lang[lang_id].lic_empty_fields,
                    showConfirmButton: false,
                    timer: 2400
                })
            } else {
                APICallB2("post", "setting/biostar/activation", {
                    License: {
                        product_type: "1",
                        activation_key: license.value,
                        customer: customer.value
                    }
                }).then(response => {
                    if (response.status == 200) {
                        Swal.fire({
                            icon: "success",
                            text: lang[lang_id].activation,
                            showConfirmButton: false,
                            timer: 2400
                        });
                        license.value = "";
                        customer.value = "";
                        CloudSettings()
                    } else {
                        console.log(response.status);
                        Swal.fire({
                            icon: "error",
                            text: lang[lang_id].activationerror,
                            showConfirmButton: false,
                            timer: 2400
                        })
                    }
                }).catch(err => {
                    if (err.response) {
                        if (err.response.status == 401 || err.response.status == 403) {
                            console.log("(APICallB2/Activation) ", err);
                            Logout(false)
                        } else {
                            Swal.fire({
                                icon: "error",
                                html: lang[lang_id].activationerror + "<hr><b>Error</b>: " + err.response.data.Response.message,
                                showConfirmButton: false,
                                timer: 2400
                            })
                        }
                    } else {
                        console.error(err)
                    }
                })
            }
            break;
        default:
            reqfrom = env.id;
            $("#modaloffline").modal("show")
    }
}
let TestConn = b2settings => {
    Swal.fire({
        icon: "info",
        text: lang[lang_id].pleasewait,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });
    if (b2settings) {
        let b2_username = document.getElementById("b2_usr").value;
        let b2_pass = document.getElementById("b2_pass").value;
        credentials = {
            username: b2_username,
            password: b2_pass
        };
        if (!b2_username || !b2_pass) {
            toastr.error(lang[lang_id].mustfill, "Error")
        } else {
            APICallSDG("post", "/testconnb2", {
                payload: CEncrypt(JSON.stringify(credentials))
            }).then(response => {
                if (response.status == 200) {
                    document.getElementById("saveconnb2_btn").disabled = false;
                    Swal.fire({
                        icon: "success",
                        text: lang[lang_id].testsuccess,
                        showConfirmButton: false,
                        timer: 2400
                    })
                } else {
                    Swal.fire({
                        icon: "warning",
                        text: "The Account does not have the required priviledges",
                        showConfirmButton: false,
                        timer: 2400
                    });
                    console.log(response.status)
                }
            }).catch(err => {
                if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                    console.log("(APICallSDG/TestConnB2) ", err);
                    Logout(false)
                } else {
                    Swal.fire({
                        icon: "error",
                        text: "Username/Password incorrect, please check and try again",
                        showConfirmButton: false,
                        timer: 2400
                    });
                    console.error(err);
                    document.getElementById("saveconnb2_btn").disabled = true
                }
            })
        }
    } else {
        let ready = false;
        if (auth_type.value == 1 || auth_type.value == 2) {
            if (!sql_dname.value || !sql_port.value) {
                toastr.error(lang[lang_id].mustfill, "Error");
                ready = false
            } else {
                ready = true
            }
        } else {
            if (!sql_dname.value || !sql_port.value || !sql_user.value || !sql_pass.value) {
                toastr.error(lang[lang_id].mustfill, "Error");
                ready = false
            } else {
                ready = true
            }
        }
        if (ready) {
            console.log("Going to TEST CONN now");
            conn_settings = {
                auth_type: auth_type.value == 1 || auth_type.value == 2 ? "win" : "sql",
                server: sql_dname.value,
                port: sql_port.value,
                user: sql_user.value,
                pass: sql_pass.value != "" ? CEncrypt(sql_pass.value) : "",
                mode: auth_type.value,
                encrypt: sql_encrypt.checked,
                trust: sql_trust.checked
            };
            APICallSDG("post", "/testconn9k", conn_settings).then(response => {
                if (response.status == 200) {
                    console.log(response.status);
                    document.getElementById("saveconncc_btn").disabled = false;
                    Swal.fire({
                        icon: "success",
                        text: lang[lang_id].testsuccess,
                        showConfirmButton: false,
                        timer: 2400
                    })
                } else {
                    console.log(response.status)
                }
            }).catch(err => {
                if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                    console.log("(APICallSDG/TestConn9K) ", err);
                    Logout(false)
                } else {
                    toastr.error(err, "Error");
                    console.error(err.response.data);
                    Swal.fire({
                        icon: "error",
                        html: `<b>Error Details:</b><br> ${err.response?err.response.data:err}`
                    })
                }
            })
        }
    }
};
let SaveConn = b2settings => {
    Swal.fire({
        icon: "info",
        text: lang[lang_id].pleasewait,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });
    if (b2settings) {
        APICallSDG("post", "/saveconnb2", {
            payload: CEncrypt(JSON.stringify(credentials))
        }).then(response => {
            if (response.status == 200) {
                console.log(response.status);
                CompSettings("b2", false);
                APICallSDG("get", "/wiegandformat").then(wformat => {
                    if (wformat.status == 200) {
                        Swal.fire({
                            icon: "success",
                            text: lang[lang_id].savedsuccess,
                            showConfirmButton: false,
                            timer: 2400
                        })
                    } else {
                        Swal.fire({
                            icon: "success",
                            text: lang[lang_id].savedsuccess,
                            showConfirmButton: false,
                            timer: 2400
                        });
                        toastr.warning(wformat.data, wformat.status)
                    }
                }).catch(err => {
                    if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                        console.log("(APICallSDG/WiegandFormat) ", err);
                        Logout(false)
                    }
                    toastr.error(lang[lang_id].wformaterror, "Error");
                    console.error(err)
                })
            } else {
                console.log(response.status)
            }
        }).catch(err => {
            if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                console.log("(APICallSDG/SaveConnB2) ", err);
                Logout(false)
            }
            toastr.error(err, "Error");
            console.error(err)
        })
    } else {
        APICallSDG("post", "/saveconn9k", {
            payload: CEncrypt(JSON.stringify(conn_settings))
        }).then(response => {
            if (response.status == 200) {
                console.log(response.status);
                CompSettings("cc", false);
                Swal.fire({
                    icon: "success",
                    text: lang[lang_id].savedsuccess,
                    showConfirmButton: false,
                    timer: 2400
                });
                APICallSDG("get", "/include").then(response => {
                    if (response.status == 200) {
                        if (response.data.message == "New") Swal.fire({
                            icon: "success",
                            text: lang[lang_id].licoptsuccess,
                            showConfirmButton: false,
                            timer: 2400
                        });
                        else Swal.fire({
                            icon: "success",
                            text: lang[lang_id].licoptpresent,
                            showConfirmButton: false,
                            timer: 2400
                        })
                    } else {
                        console.log(response.status)
                    }
                }).catch(err => {
                    if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                        console.log("(APICallSDG/Include) ", err);
                        Logout(false)
                    }
                    toastr.error(lang[lang_id].licopterror, "Error");
                    console.error(err)
                })
            } else {
                console.log(response.status)
            }
        }).catch(err => {
            if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                console.log("(APICallSDG/SaveConn9K) ", err);
                Logout(false)
            }
            Swal.fire({
                icon: "error",
                text: err,
                showConfirmButton: false,
                timer: 2400
            });
            console.error(err)
        }).finally(() => {
            document.getElementById("saveconncc_btn").disabled = true
        })
    }
};
let InitConf = () => {
    Swal.fire({
        icon: "info",
        text: lang[lang_id].pleasewait,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });
    APICallSDG("get", "/wiegandformat").then(wformat => {
        if (wformat.status == 200) {
            Swal.fire({
                icon: "success",
                html: lang[lang_id].applysuccess,
                showConfirmButton: false,
                timer: 2400
            })
        } else {
            Swal.fire({
                icon: "info",
                html: wformat.data + ` (${wformat.status})`,
                showConfirmButton: false,
                timer: 2400
            })
        }
    }).catch(err => {
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            console.log("(APICallSDG/WiegandFormat) ", err);
            Logout(false)
        }
        toastr.error(lang[lang_id].wformaterror, "Error");
        console.error(err)
    })
};
let CreateDownloadFile = (data2write, filename, xt, csv = false) => {
    let date = new Date;
    let timestamp = `${date.getFullYear()}${Pad(date.getMonth()+1)}${Pad(date.getDate())}_${Pad(date.getHours())}${Pad(date.getMinutes())}${Pad(date.getSeconds())}`;
    let element = document.createElement("a");
    let content = csv ? new Blob([data2write], {
        type: "text/csv"
    }) : new Blob([JSON.stringify(data2write, null, 4)], {
        type: "text/plain"
    });
    let url = window.URL.createObjectURL(content);
    element.href = url;
    element.download = `${filename}-${timestamp}.${xt}`;
    element.style.display = "none";
    document.body.append(element);
    element.click();
    element.remove();
    window.URL.revokeObjectURL(url)
};

function DownloadURI(name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = ADDSrv + "/download/" + name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link
}
let GetReq = () => {
    let lic = null;
    let cus = null;
    switch (reqfrom) {
        case "lic_sys_off":
            lic = document.getElementById("lic_sys_key");
            cus = document.getElementById("lic_sys_cus");
            if (lic.value == "" || cus.value == "") {
                Swal.fire({
                    icon: "warning",
                    text: lang[lang_id].lic_empty_fields,
                    showConfirmButton: false,
                    timer: 2400
                })
            } else {
                APICallSDG("put", "/activation", {
                    license: lic.value,
                    customer: cus.value,
                    stage: "req"
                }).then(response => {
                    if (response.status == 200) {
                        CreateDownloadFile(response.data, "LicenseREQ", "req")
                    } else {
                        console.log(response.status);
                        Swal.fire({
                            icon: "error",
                            text: lang[lang_id].activationerror,
                            showConfirmButton: false,
                            timer: 2400
                        })
                    }
                    lic.value = "";
                    cus.value = "";
                    $("#modaloffline").modal("hide")
                }).catch(err => {
                    if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                        console.log("(APICallSDG/Activacion) ", err);
                        Logout(false)
                    }
                    toastr.error(err.response.data.message, "Error");
                    console.error(err);
                    $("#modaloffline").modal("hide")
                })
            }
            break;
        case "lic_cld_off":
            lic = document.getElementById("lic_cld_key");
            cus = document.getElementById("lic_cld_cus");
            if (lic.value == "" || cus.value == "") {
                Swal.fire({
                    icon: "warning",
                    text: lang[lang_id].lic_empty_fields,
                    showConfirmButton: false,
                    timer: 2400
                })
            } else {
                APICallB2("get", `setting/biostar/manual_activation?hostid_type=1&product_type=1&customer=${cus.value}&activation_key=${lic.value}`).then(res => {
                    if (res.status == 200) {
                        console.log(res.data.LicenseFile.name);
                        DownloadURI(res.data.LicenseFile.name)
                    } else {
                        console.log(response.status);
                        Swal.fire({
                            icon: "error",
                            text: lang[lang_id].activationerror,
                            showConfirmButton: false,
                            timer: 2400
                        })
                    }
                    lic.value = "";
                    cus.value = "";
                    $("#modaloffline").modal("hide")
                }).catch(err => {
                    if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                        console.log("(APICallSDG/Activacion) ", err);
                        Logout(false)
                    }
                    toastr.error(err.response.data.message, "Error");
                    console.error(err);
                    $("#modaloffline").modal("hide")
                })
            }
            break;
        case "lic_oth_off":
            lic = document.getElementById("lic_oth_key");
            if (!lic.value) Swal.fire({
                icon: "warning",
                text: lang[lang_id].lic_empty_field,
                showConfirmButton: false,
                timer: 2400
            });
            else {
                APICallSDG("put", "/misc/activation", {
                    license: lic.value,
                    product: 0,
                    stage: "req"
                }).then(resp => {
                    if (resp.status == 200) {
                        CreateDownloadFile(resp.data, "LicenseMisc", "req")
                    } else {
                        console.log(resp.status);
                        Swal.fire({
                            icon: "error",
                            text: lang[lang_id].activationerror,
                            showConfirmButton: false,
                            timer: 2400
                        })
                    }
                    lic.value = "";
                    $("#modaloffline").modal("hide")
                }).catch(err => {
                    if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                        console.log("(APICallSDG/MiscActivacion) ", err);
                        Logout(false)
                    }
                    toastr.error(err.response.data.message, "Error");
                    console.error(err);
                    $("#modaloffline").modal("hide")
                })
            }
            break
    }
};
let SaveCloud = () => {
    Swal.fire({
        icon: "warning",
        html: lang[lang_id].cloudmsg,
        title: lang[lang_id].beforeproceed,
        showCancelButton: true,
        confirmButtonText: lang[lang_id].accept,
        cancelButtonText: lang[lang_id].cancel
    }).then(res => {
        if (res.isConfirmed && cloudsettings) {
            console.log(cloudsettings);
            let payload = {
                BioStar: {
                    cloud: {
                        use_cloud: use_cloud.checked ? 1 : 0,
                        sub_domain: sub_domain.value,
                        email: e_mail.value,
                        server_address: cloudsettings.server_address,
                        http_port: cloudsettings.http_port,
                        version: cloudsettings.version
                    }
                }
            };
            Swal.fire({
                icon: "info",
                text: lang[lang_id].pleasewait,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });
            APICallB2("put", "setting/biostar/cloud", payload).then(cloudresp => {
                if (cloudresp.status == 200) {
                    Swal.close();
                    Swal.fire({
                        icon: "success",
                        title: lang[lang_id].success
                    }).then(() => {
                        $("#menuconf_div").collapse("toggle")
                    })
                }
            }).catch(err => {
                Swal.close();
                if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                    console.log("(APICallB2/SaveCloud) ", err);
                    Logout(false)
                } else if (err.response && err.response.status == 400) {
                    console.log("(APICallB2/SaveCloud) ", err);
                    Swal.fire({
                        icon: "info",
                        text: lang[lang_id].cloudinfo
                    }).then(() => {
                        $("#menuconf_div").collapse("toggle")
                    })
                } else {
                    console.log("Save Cloud: ERROR");
                    console.log(err);
                    Swal.fire({
                        icon: "error",
                        title: lang[lang_id].error,
                        showConfirmButton: false,
                        timer: 2400,
                        timerProgressBar: true
                    })
                }
            })
        }
    })
};

function CloudSettings() {
    let lic_xp = document.getElementById("lic_xp");
    Swal.fire({
        icon: "info",
        text: lang[lang_id].pleasewait,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });
    APICallB2("get", "setting/biostar").then(resp => {
        if (resp.status == 200) {
            resp.data.BioStar.licenses.forEach(lic => {
                if (lic.activated == "true" && !!lic.available) {
                    if (lic.available.CLOUD == "true") {
                        lic_xp.textContent = lic.expires_on == "permanent" ? lic.expires_on : lic.expires_on.split("T")[0];
                        cloudsettings = resp.data.BioStar.cloud;
                        sub_domain.value = resp.data.BioStar.cloud.sub_domain;
                        e_mail.value = resp.data.BioStar.cloud.email;
                        CloudLicense(true)
                    }
                }
            })
        }
    }).catch(err => {
        console.log("(APICallB2/CloudSettings) ", err);
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            Logout(false)
        }
    }).finally(() => {
        Swal.close()
    })
}
let TestSMTP = () => {
    let testemail = document.getElementById("smtpemail");
    if (testemail.value == "") {
        toastr.error(lang[lang_id].mustfill, "Error")
    } else {
        Swal.fire({
            icon: "info",
            text: lang[lang_id].pleasewait,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading()
            }
        });
        APICallB2("post", "test_smtp_connection", {
            target_email: testemail.value
        }).then(resp => {
            if (resp.status == 200) {
                console.log(resp.data);
                if (resp.data.code == "1000") {
                    Swal.fire({
                        icon: "error",
                        title: lang[lang_id].error,
                        html: resp.data.message,
                        showConfirmButton: true
                    })
                } else {
                    Swal.close();
                    Swal.fire({
                        icon: "success",
                        text: lang[lang_id].testsuccess,
                        timer: 2400,
                        width: 300,
                        showConfirmButton: false,
                        timerProgressBar: true
                    })
                }
            }
        }).catch(err => {
            Swal.close();
            if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                console.log("(APICallB2/TestSMTP) ", err);
                Logout(false)
            } else {
                console.log("(APICallB2/TestSMTP) ", err);
                Swal.fire({
                    icon: "error",
                    title: lang[lang_id].error,
                    text: err,
                    showConfirmButton: false,
                    timer: 2400,
                    timerProgressBar: true
                })
            }
        })
    }
};
let SaveSMTP = () => {
    if (smtp_srv.value == "" || smtp_port.value == "" || smtp_usr.value == "" || smtp_pwd.value == "") {
        toastr.error(lang[lang_id].mustfill, "Error")
    } else {
        smtpsettings.smtp_server_addr = smtp_srv.value;
        smtpsettings.smtp_server_port = smtp_port.value;
        smtpsettings.smtp_username = smtp_usr.value;
        smtpsettings.smtp_password = smtp_pwd.value == defaultpassword ? smtpsettings.smtp_password : smtp_pwd.value;
        smtpsettings.smtp_security = smtp_type.value;
        smtpsettings.sender = smtp_usr.value;
        APICallB2("put", "setting/alarm_smtps/1", {
            AlarmSmtp: smtpsettings
        }).then(cloudresp => {
            if (cloudresp.status == 200) {
                console.log(cloudresp.data);
                Swal.close();
                Swal.fire({
                    icon: "success",
                    title: lang[lang_id].success,
                    timer: 2400,
                    timerProgressBar: true
                })
            }
        }).catch(err => {
            Swal.close();
            if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                console.log("(APICallB2/SaveSMTP) ", err);
                Logout(false)
            } else {
                console.log("Save Cloud: ERROR");
                console.log(err)
            }
        })
    }
};
let SaveQR = () => {
    Swal.fire({
        icon: "info",
        text: lang[lang_id].pleasewait,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });
    let body = {
        store: true,
        payload: {
            create_cards: create_creds.checked,
            read_qr: read_qr.checked
        }
    };
    if (!use_ccureqr.checked) {
        body.payload.create_cards = false;
        body.payload.read_qr = false
    }
    APICallSDG("post", "/qrsettings", body).then(resp => {
        if (resp.status == 200) {
            Swal.close();
            Swal.fire({
                icon: "success",
                text: lang[lang_id].success,
                timer: 2400,
                width: 300,
                showConfirmButton: false,
                timerProgressBar: true
            }).then(() => {
                $("#menuconf_div").collapse("toggle")
            })
        }
    }).catch(err => {
        console.log("(APICallSDG/QRSettings/SaveSettings) ", err);
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            Logout(false)
        } else {
            toastr.error(err, "Error")
        }
    })
};
let SaveVF = () => {
    if (vf_title.value == "" || vf_name.value == "" || vf_sender.value == "") {
        toastr.error(lang[lang_id].mustfill, "Error")
    } else {
        Swal.fire({
            icon: "info",
            text: lang[lang_id].pleasewait,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading()
            }
        });
        let payload = {
            title: vf_title.value,
            company_name: vf_name.value,
            company_logo: vfsettings[3],
            admin_contact: vf_sender.value,
            use_setting: use_penroll.checked ? 1 : 0,
            policy: vf_policy.value
        };
        APICallB2("put", "setting_email?email_type=1", payload).then(resp => {
            if (resp.status == 200) {
                Swal.close();
                Swal.fire({
                    icon: "success",
                    text: lang[lang_id].success,
                    timer: 2400,
                    width: 300,
                    showConfirmButton: false,
                    timerProgressBar: true
                }).then(() => {
                    $("#menuconf_div").collapse("toggle")
                })
            }
        }).catch(err => {
            console.log("(APICallB2/GetSMTP) ", err);
            if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                Logout(false)
            } else {
                toastr.error(err, "Error")
            }
        })
    }
};
async function SendMail(data, callback) {
    let resparray = [];
    for (const user of data) {
        await APICallB2("post", "v2/send_email", {
            id: user.id,
            language: "en"
        }).then(resp => {
            if (resp.status == 200) {
                resparray.push({
                    id: user.id,
                    status: resp.status
                })
            }
        }).catch(err => {
            console.log("(APICallB2/SendPreEnrollLink) ", err);
            resparray.push({
                id: user.id,
                status: err.response.status
            })
        })
    }
    callback(resparray)
}
async function SendLink() {
    if (sys_conf[0] == 1 && sys_conf[1] == 1 && sys_conf[2] == 1) {
        let users_val = users_array.filter(user => user.email != "");
        if (users_array.length != users_val.length) {
            let msg = lang[lang_id].penroll_without[1] + users_val.length + lang[lang_id].penroll_without[2] + users_array.length + lang[lang_id].penroll_without[3];
            let val = await Swal.fire({
                icon: "warning",
                title: lang[lang_id].penroll_without[0],
                html: msg,
                input: "checkbox",
                inputValue: 1,
                inputPlaceholder: lang[lang_id].penroll_without[4],
                confirmButtonText: lang[lang_id].penroll_without[6] + ' <i class="fa fa-arrow-right"></i>',
                inputValidator: result => {
                    return !result && lang[lang_id].penroll_without[5]
                }
            })
        }
        Swal.fire({
            icon: "info",
            title: lang[lang_id].beforeproceed,
            html: lang[lang_id].penroll_notice,
            showCancelButton: true,
            confirmButtonText: lang[lang_id].accept,
            cancelButtonText: lang[lang_id].cancel
        }).then(result => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "info",
                    text: lang[lang_id].pleasewait,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                });
                if (users_val.length != 0) {
                    SendMail(users_val, result => {
                        let good = result.filter(res => res.status == 200);
                        Swal.fire({
                            icon: good && good.length != 0 ? "success" : "warning",
                            title: lang[lang_id].success,
                            html: (good.length / result.length * 100).toFixed(2) + lang[lang_id].penroll_sent,
                            confirmButtonText: lang[lang_id].close
                        }).then(() => {
                            Close()
                        })
                    })
                }
            }
        })
    } else {
        let msg = lang[lang_id].penroll_conferr[0] + lang[lang_id].penroll_conferr[1] + !!sys_conf[0] + lang[lang_id].penroll_conferr[2] + !!sys_conf[1] + lang[lang_id].penroll_conferr[3] + !!sys_conf[2] + "</div><hr>";
        Swal.fire({
            icon: "error",
            title: lang[lang_id].error,
            html: msg,
            confirmButtonText: lang[lang_id].close
        })
    }
}

function SelUsrs() {
    if (table_usr) {
        if (!selected) {
            if (select_type.checked) table_usr.rows().select();
            else table_usr.rows({
                page: "current"
            }).select();
            select_ulbl.textContent = lbl_sel[1]
        } else {
            if (select_type.checked) table_usr.rows().deselect();
            else table_usr.rows({
                page: "current"
            }).deselect();
            select_ulbl.textContent = lbl_sel[0]
        }
        selected = !selected
    }
    btn_usersync.disabled = table_usr.rows(".selected").data().length != 0 ? false : true;
    btn_propics.disabled = table_usr.rows(".selected").data().length != 0 ? false : true;
    btn_clearances.disabled = table_usr.rows(".selected").data().length != 0 ? false : true;
    select_count.textContent = table_usr.rows(".selected").data().length
}

function Select() {
    if (table_users) {
        if (!pselected) {
            table_users.rows().select();
            users_array = table_users.rows().data().toArray().map(row => ({
                id: row[0],
                email: row[3]
            }));
            document.getElementById("penroll_sel").textContent = lang[lang_id].penroll_sel[1]
        } else {
            table_users.rows().deselect();
            users_array = [];
            document.getElementById("penroll_sel").textContent = lang[lang_id].penroll_sel[0]
        }
        pselected = !pselected
    }
    document.getElementById("penroll_send").style.display = users_array.length != 0 ? "inline" : "none"
}

function SelRel() {
    if (table_rels) {
        if (!allselrel) {
            table_rels.rows().select();
            selfilter.textContent = lang[lang_id].penroll_sel[1]
        } else {
            table_rels.rows().deselect();
            selfilter.textContent = lang[lang_id].penroll_sel[0]
        }
        allselrel = !allselrel
    }
    delfilter.style.display = table_rels.rows(".selected").data().length != 0 ? "inline" : "none"
}

function AddRel() {
    let merged = {
        ...p_array,
        ...dg_array
    };
    table_privs.row(table_privs.rows(".selected")).remove().draw();
    table_devgroups.row(table_devgroups.rows(".selected")).remove().draw();
    table_rels.row.add([merged.ObjectID, merged.Pname, merged.id, merged.DGname]).draw();
    document.getElementById("ep_add").disabled = true
}

function DelRel() {
    table_rels.rows(".selected").data().each(row => {
        table_privs.row.add([row[0], row[1]]);
        table_devgroups.row.add([row[2], row[3]])
    });
    table_privs.rows().draw();
    table_devgroups.rows().draw();
    table_rels.rows(table_rels.rows(".selected")[0]).remove().draw();
    delfilter.style.display = table_rels.rows(".selected")[0].length != 0 ? "inline" : "none"
}

function SendRel() {
    let rels_array = table_rels.rows().data().toArray();
    console.log(rels_array);
    console.log(use_enrollpriv.checked);
    Swal.fire({
        icon: "warning",
        title: lang[lang_id].beforeproceed,
        html: lang[lang_id].beforeproceedtext,
        showCancelButton: true,
        confirmButtonText: lang[lang_id].accept,
        cancelButtonText: lang[lang_id].cancel
    }).then(result => {
        if (result.isConfirmed) {
            if (!use_enrollpriv.checked) rels_array = [];
            APICallSDG("post", "/pdgsettings", {
                store: true,
                payload: rels_array
            }).then(resp => {
                if (resp.status == 200) {
                    console.log(resp.data);
                    Swal.fire({
                        icon: "info",
                        width: 300,
                        text: lang[lang_id].applysuccess,
                        timer: DismissTime,
                        timerProgressBar: true,
                        showConfirmButton: false
                    }).then(() => {
                        ShowConfMenu()
                    })
                }
            }).catch(err => {
                console.log("(APICallSDG/GetPrivDevGrpSettings) ", err);
                if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                    Logout(false)
                } else {
                    Swal.fire({
                        icon: "error",
                        title: lang[lang_id].error,
                        html: lang[lang_id].saverels_err,
                        confirmButtonText: lang[lang_id].close
                    })
                }
            })
        }
    })
}

function UpdateLicenseStats() {
    var ki_tot = document.getElementById("ki_tot");
    var ki_ava = document.getElementById("ki_ava");
    var ki_used = document.getElementById("ki_act");
    APICallSDG("get", "/misc/activation/cli").then(res => {
        if (res.status == 200) {
            ki_tot.value = res.data.length;
            let used = res.data.filter(item => item.payload.activated);
            ki_used.value = used.length;
            ki_ava.value = res.data.length - used.length
        } else {}
    }).catch(err => {
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            console.log("(APICallSDG/GetMiscAct/Cli) ", err);
            Logout(false)
        } else {
            ki_tot.value = 0;
            ki_used.value = 0;
            ki_ava.value = 0
        }
    })
}
$("#t_wformat").on("click", "tr", function () {
    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected")
    } else {
        $(this).addClass("selected")
    }
    document.getElementById("btn_setwformat").disabled = table_formats.rows(".selected").data().length != 0 ? false : true
});
$("#t_usersync").on("click", "tr", function () {
    if (table_usr.rows().data().length != 0) {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected")
        } else {
            $(this).addClass("selected")
        }
    }
    btn_usersync.disabled = table_usr.rows(".selected").data().length != 0 ? false : true;
    btn_propics.disabled = table_usr.rows(".selected").data().length != 0 ? false : true;
    btn_clearances.disabled = table_usr.rows(".selected").data().length != 0 ? false : true;
    select_count.textContent = table_usr.rows(".selected").data().length
});
$("#t_devsadd").on("click", "tr", function () {
    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
        devices_array = devices_array.filter(row => row[0] != table_add.row(this).data()[0])
    } else {
        $(this).addClass("selected");
        devices_array.push(table_add.row(this).data())
    }
    document.getElementById("btn_add").disabled = devices_array.length != 0 ? false : true
});
$("#t_curdevs").on("click", "tr", function () {
    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
        devs_cmd = devs_cmd.filter(row => row != table_dev.row(this).data()[0])
    } else {
        $(this).addClass("selected");
        devs_cmd.push(table_dev.row(this).data()[0])
    }
    document.getElementById("btncmds").style.display = devs_cmd.length != 0 ? "block" : "none"
});
$("#t_penroll").on("click", "tr", function () {
    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
        users_array = users_array.filter(row => row.id != table_users.row(this).data()[0])
    } else {
        $(this).addClass("selected");
        users_array.push({
            id: table_users.row(this).data()[0],
            email: table_users.row(this).data()[3]
        })
    }
    document.getElementById("penroll_send").style.display = users_array.length != 0 ? "inline" : "none"
});
$("#t_priv").on("click", "tr", function () {
    if (table_privs.rows().data().length != 0) {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            isPriv = false
        } else {
            table_privs.$("tr.selected").removeClass("selected");
            $(this).addClass("selected");
            isPriv = true;
            p_array = {
                ObjectID: table_privs.row(this).data()[0],
                Pname: table_privs.row(this).data()[1]
            }
        }
        document.getElementById("ep_add").disabled = isPriv && isDG ? false : true
    }
});
$("#t_devgroup").on("click", "tr", function () {
    if (table_devgroups.rows().data().length != 0) {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            isDG = false
        } else {
            table_devgroups.$("tr.selected").removeClass("selected");
            $(this).addClass("selected");
            isDG = true;
            dg_array = {
                id: table_devgroups.row(this).data()[0],
                DGname: table_devgroups.row(this).data()[1]
            }
        }
        document.getElementById("ep_add").disabled = isPriv && isDG ? false : true
    }
});
$("#t_rels").on("click", "tr", function () {
    if (table_rels.rows().data().length != 0) {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected")
        } else {
            $(this).addClass("selected")
        }
        if (table_rels.rows(".selected").data().length == table_rels.rows().data().length) {
            selfilter.textContent = lang[lang_id].penroll_sel[1];
            allselrel = true
        } else {
            selfilter.textContent = lang[lang_id].penroll_sel[0];
            allselrel = false
        }
        delfilter.style.display = table_rels.rows(".selected").data().length != 0 ? "inline" : "none"
    }
});
importfile.addEventListener("change", function (e) {
    Swal.fire({
        icon: "info",
        text: lang[lang_id].pleasewait,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });
    var file = importfile.files[0];
    importfile.value = "";
    var licfile = new FileReader;
    let lic = null;
    let cus = null;
    let exp = null;
    switch (reqfrom) {
        case "lic_sys_off":
            licfile.readAsText(file);
            lic = document.getElementById("lic_sys_key");
            cus = document.getElementById("lic_sys_cus");
            exp = document.getElementById("lic_exp");
            licfile.onload = function (evt) {
                APICallSDG("put", "/activation", {
                    license: evt.target.result.replace(/^\s+|\s+$/gm, ""),
                    stage: "lic"
                }).then(response => {
                    $("#modaloffline").modal("hide");
                    if (response.status == 200) {
                        Swal.fire({
                            icon: "success",
                            text: lang[lang_id].activation,
                            showConfirmButton: false,
                            timer: 2400
                        });
                        exp.textContent = response.data.expiration != "permanent" ? response.data.expiration.split("T")[0] : response.data.expiration;
                        Components(true);
                        ConfLoad()
                    } else {
                        Swal.close();
                        console.log(response.status);
                        console.log(response.data);
                        Swal.fire({
                            icon: "error",
                            title: response.status,
                            text: response.data,
                            showConfirmButton: false,
                            timer: 2400
                        })
                    }
                    lic.value = "";
                    cus.value = ""
                }).catch(err => {
                    if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                        console.log("(APICallSDG/SysOffAct) ", err);
                        Logout(false)
                    }
                    console.error(err)
                })
            };
            break;
        case "lic_oth_off":
            licfile.readAsText(file);
            lic = document.getElementById("lic_oth_key");
            licfile.onload = function (evt) {
                APICallSDG("put", "/misc/activation", {
                    license: evt.target.result.replace(/^\s+|\s+$/gm, ""),
                    product: 0,
                    stage: "lic"
                }).then(response => {
                    if (response.status == 200) {
                        let types = [{
                            id: SrvK,
                            name: lang[lang_id].kiosk_txt[0]
                        }, {
                            id: CreK,
                            name: lang[lang_id].kiosk_txt[1]
                        }];
                        let msg = types.find(item => item.id == response.data.product_id);
                        Swal.fire({
                            icon: msg ? "success" : "warning",
                            html: msg ? msg.name : lang[lang_id].kiosk_txt[2],
                            showConfirmButton: false,
                            timer: 2400
                        })
                    } else {
                        console.log(response.status)
                    }
                    lic.value = ""
                }).catch(err => {
                    if (err.response) {
                        if (err.response.status == 401 || err.response.status == 403) {
                            Logout(false)
                        } else console.error("(APICallSDG/OtherActivation) ", err.response.data.message)
                    } else {
                        console.log("(APICallSDG/OtherActivation) ", err);
                        toastr.error(err, "Error")
                    }
                })
            };
            break;
        case "lic_cld_off":
            const formData = new FormData;
            formData.append("file", file);
            APICallB2("post", "attachments", formData).then(res => {
                if (res.status == 200) {
                    APICallB2("post", "setting/biostar/manual_activation", {
                        LicenseFile: {
                            name: res.data.filename
                        }
                    }).then(resp => {
                        if (resp.status == 200) {
                            console.log(resp.data);
                            $("#modaloffline").modal("hide");
                            CloudSettings()
                        }
                    }).catch(err => {
                        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                            console.log("(APICallB2/ManualAct) ", err);
                            Logout(false)
                        }
                        console.error(err)
                    })
                }
            }).catch(err => {
                if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                    console.log("(APICallB2/CldOffAct) ", err);
                    Logout(false)
                }
                console.error(err)
            });
            break;
        default:
            console.log("Not an option: reqfrom=", reqfrom)
    }
    licfile.onerror = function (evt) {
        console.error("Error reading the File: ", evt);
        $("#modaloffline").modal("hide")
    }
});
vf_logo.addEventListener("change", function (e) {
    Swal.fire({
        icon: "info",
        text: lang[lang_id].pleasewait,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });
    if (!vf_logo.files[0]) {
        Swal.fire({
            icon: "error",
            text: lang[lang_id].vferror,
            showConfirmButton: false,
            timer: 2400,
            timerProgressBar: true
        })
    }
    var file = vf_logo.files[0];
    vf_logo.placeholder = "File Loaded...";
    var logofile = new FileReader;
    logofile.readAsDataURL(file);
    logofile.onload = function (evt) {
        Swal.close();
        vfsettings[3] = evt.target.result.split("base64,")[1]
    };
    logofile.onerror = function (evt) {
        console.error("Error reading the File: ", evt)
    }
});
importoffdevs.addEventListener("change", function (e) {
    Swal.fire({
        icon: "info",
        text: lang[lang_id].pleasewait,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });
    var file = importoffdevs.files[0];
    importoffdevs.value = "";
    var devfile = new FileReader;
    devfile.readAsText(file);
    devfile.onload = function (evt) {
        APICallSDG("post", "/offline/devices", {
            license: evt.target.result.replace(/^\s+|\s+$/gm, "")
        }).then(response => {
            if (response.status == 200) {
                console.log(response.data);
                Swal.fire({
                    icon: "success",
                    text: lang[lang_id].activation,
                    showConfirmButton: false,
                    timer: 2400
                })
            } else {
                Swal.close();
                console.log(response.status);
                console.log(response.data)
            }
        }).catch(err => {
            if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                console.log("(APICallSDG/Include) ", err);
                Logout(false)
            }
            console.error(err)
        })
    };
    devfile.onerror = function (evt) {
        console.error("Error reading the File: ", evt)
    }
});
importkiosklic.addEventListener("change", function (e) {
    Swal.fire({
        icon: "info",
        text: lang[lang_id].pleasewait,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });
    var file = importkiosklic.files[0];
    importkiosklic.value = "";
    var kioskfile = new FileReader;
    kioskfile.readAsText(file);
    kioskfile.onload = function (evt) {
        APICallSDG("put", "/kiosk/activation", {
            payload: evt.target.result
        }).then(res => {
            if (res.status == 200) {
                UpdateLicenseStats();
                Swal.fire({
                    icon: "success",
                    text: lang[lang_id].activation,
                    showConfirmButton: false,
                    timer: 2400
                })
            } else {
                console.log(res.status);
                console.log(res.data);
                Swal.fire({
                    icon: "error",
                    title: response.status,
                    text: response.data,
                    showConfirmButton: false,
                    timer: 2400
                })
            }
        }).catch(err => {
            if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                console.log("(APICallSDG/KioskClientLicenses) ", err);
                Logout(false)
            }
            console.error(err)
        })
    };
    kioskfile.onerror = function (evt) {
        console.error("Error reading the File: ", evt)
    }
});
document.getElementById("langoptions").addEventListener("change", event => {
    switch (event.target.selectedIndex) {
        case 1:
            lang_id = "en";
            break;
        case 2:
            lang_id = "es";
            break
    }
    APICallSDG("post", "/setlang", {
        lang: lang_id
    }).then(response => {
        if (response.status == 200) {
            toastr.success(lang[lang_id].language[1], lang[lang_id].language[0]);
            localStorage.lang = lang_id;
            SetLang(lang_id)
        } else {
            console.log(response.data)
        }
    }).catch(err => {
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            console.log("(APICallSDG/Setlang) ", err);
            Logout(false)
        }
        toastr.error(err, "Error");
        console.error(err)
    })
});
document.getElementById("sql_auth").addEventListener("change", event => {
    if (event.target.selectedIndex != 3 && event.target.selectedIndex != 4) {
        console.log(event.target.selectedIndex);
        document.getElementById("sql_type").style.display = "none";
        document.getElementById("sql_usr").value = "";
        document.getElementById("sql_pass").value = ""
    } else {
        console.log(event.target.selectedIndex);
        document.getElementById("sql_type").style.display = "block"
    }
    if (event.target.selectedIndex != 0) {
        document.getElementById("testconncc_btn").disabled = false
    } else {
        document.getElementById("testconncc_btn").disabled = true;
        document.getElementById("saveconncc_btn").disabled = true
    }
});
document.getElementById("fcc").addEventListener("change", evt => {
    if (evt.target.value < 0) {
        evt.target.value = 0
    }
});
document.getElementById("sessiontimeout").addEventListener("change", evt => {
    document.getElementById("btntimeout").style.display = "block";
    if (evt.target.value < 0) {
        elementtimeout.value = 0
    }
});
document.getElementById("smtppwd").addEventListener("focus", function (evt) {
    smtp_pass = smtp_pwd.value;
    smtp_pwd.value = ""
});
document.getElementById("smtppwd").addEventListener("blur", function (evt) {
    if (smtp_pwd.value == "") {
        smtp_pwd.value = smtp_pass
    }
});
document.getElementById("usersync").addEventListener("click", () => {
    if (!table_usr) {
        GetUserList()
    }
});
document.getElementById("devsadd").addEventListener("click", () => {
    if (!table_dev) {
        GetDevList()
    }
});
document.getElementById("about_menu").addEventListener("click", () => {
    APICallSDG("get", "/about").then(res => {
        if (res.status == 200) {
            document.getElementById("aboutversion").innerHTML = `<b>${lang[lang_id].about[1]}</b>: ${res.data}`
        }
    }).catch(err => {
        console.log("(APICallSDG/About) ", err);
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            Logout(false)
        }
    })
});
document.getElementById("settings_menu").addEventListener("click", () => {
    if ($("#sys_settings_div").hasClass("show")) {
        console.log("Closed");
        $("#menu_div").collapse("toggle")
    } else {
        console.log("Opened");
        ConfLoad()
    }
    ClearElements()
});
document.getElementById("confmenusys").addEventListener("click", () => {
    ConfLoad()
});

// document.getElementById("confmenu4").addEventListener("click", () => {
//     delfilter.style.display = "none";
//     APICallSDG("get", "/privileges").then(resp => {
//         if (resp.status == 200) {
//             table_privs = CreateTable(table_privs, "t_priv", resp.data)
//         }
//     }).catch(err => {
//         console.log("(APICallSDG/GetPrivileges) ", err);
//         if (err.response && (err.response.status == 401 || err.response.status == 403)) {
//             Logout(false)
//         }
//     }).finally(() => {
//         APICallB2("post", "v2/device_groups/search", {}).then(resp => {
//             if (resp.status == 200) {
//                 resp.data.DeviceGroupCollection.rows = resp.data.DeviceGroupCollection.rows.filter(row => row.id != 1);
//                 table_devgroups = CreateTable(table_devgroups, "t_devgroup", resp.data.DeviceGroupCollection.rows)
//             }
//         }).catch(err => {
//             console.log("(APICallB2/GetDevGroups) ", err);
//             if (err.response && (err.response.status == 401 || err.response.status == 403)) {
//                 Logout(false)
//             }
//         })
//     })
// });
document.getElementById("confmenu3").addEventListener("click", () => {
    APICallB2("get", "setting/alarm_smtps").then(resp => {
        if (resp.status == 200) {
            smtpsettings = resp.data.AlarmSmtpCollection.rows[0];
            smtp_srv.value = smtpsettings.smtp_server_addr;
            smtp_port.value = smtpsettings.smtp_server_port;
            smtp_usr.value = smtpsettings.smtp_username;
            smtp_pwd.value = smtpsettings.smtp_password ? defaultpassword : "";
            smtp_type.value = smtpsettings.smtp_security
        }
    }).catch(err => {
        console.log("(APICallB2/GetSMTP) ", err);
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            Logout(false)
        }
    });
    APICallB2("get", "setting_email").then(resp => {
        if (resp.status == 200) {
            vfsettings = resp.data.visual_face_setting;
            vf_title.value = vfsettings[0];
            vf_name.value = vfsettings[2];
            vf_sender.value = vfsettings[4];
            vf_policy.value = vfsettings[6];
            use_penroll.switchButton(vfsettings[5] == "1" ? "on" : "off")
        }
    }).catch(err => {
        console.log("(APICallB2/GetVFSettings) ", err);
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            Logout(false)
        }
    })
});
document.getElementById("confmenu2").addEventListener("click", () => {
    CloudSettings()
});
document.getElementById("confmenu1").addEventListener("click", () => {
    GetWiegandFormats()
});
document.getElementById("btnclose").addEventListener("click", () => {
    $("#menu_div").collapse("toggle");
    CheckActivation()
});
document.getElementById("penroll").addEventListener("click", () => {
    APICallB2("post", "v2/users/search", {
        limit: 0
    }).then(resp => {
        if (resp.status == 200) {
            users_array = [];
            pselected = false;
            table_users = CreateTable(table_users, "t_penroll", resp.data.UserCollection.rows)
        }
    }).catch(err => {
        console.log("(APICallB2/GetUsers) ", err);
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            Logout(false)
        }
    });
    APICallB2("get", "setting/biostar").then(resp => {
        if (resp.status == 200) {
            sys_conf[0] = parseInt(resp.data.BioStar.cloud.use_cloud);
            APICallB2("get", "setting/alarm_smtps").then(resp => {
                if (resp.status == 200) {
                    smtpsettings = resp.data.AlarmSmtpCollection.rows[0];
                    if (smtpsettings.smtp_server_addr && smtpsettings.smtp_server_port && smtpsettings.smtp_username && smtpsettings.smtp_password) {
                        sys_conf[1] = 1;
                        APICallB2("get", "setting_email").then(resp => {
                            if (resp.status == 200) {
                                sys_conf[2] = parseInt(resp.data.visual_face_setting[5])
                            }
                        }).catch(err => {
                            console.log("(APICallB2/CheckVF) ", err);
                            if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                                Logout(false)
                            }
                        })
                    }
                }
            }).catch(err => {
                console.log("(APICallB2/CheckSMTP) ", err);
                if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                    Logout(false)
                }
            })
        }
    }).catch(err => {
        console.log("(APICallB2/CheckCloud) ", err);
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
            Logout(false)
        }
    })
});
document.getElementById("kiosk").addEventListener("click", () => {
    console.log("Loading Kiosk details");
    UpdateLicenseStats()
});
radiobtns.forEach(radiobtn => radiobtn.addEventListener("change", function (evt) {
    if (this.checked && this.value == "tcp") {
        document.getElementById("advparams").style.display = "block"
    } else {
        document.getElementById("advparams").style.display = "none"
    }
    search_type = this.value;
    if (table_add) {
        table_add.clear();
        table_add.destroy();
        $("#t_devsadd" + " tbody").empty();
        $("#t_devsadd" + " thead").empty()
    }
    document.getElementById("btn_add").disabled = true
}));
use_cloud.addEventListener("change", evt => {
    document.getElementById("cloud_sett").style.display = evt.target.checked ? "block" : "none";
    CheckCloud(evt.target.checked)
});
use_penroll.addEventListener("change", evt => {
    document.getElementById("vfcard").style.display = evt.target.checked ? "block" : "none"
});

use_imgs.addEventListener("change", evt => {
    Swal.fire({
        icon: "warning",
        title: lang[lang_id].beforeproceed,
        html: evt.target.checked ? lang[lang_id].beforeproimages : lang[lang_id].beforeproceedtext,
        showCancelButton: true,
        confirmButtonText: lang[lang_id].accept,
        cancelButtonText: lang[lang_id].cancel
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: "info",
                text: lang[lang_id].pleasewait,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });
            APICallSDG("post", "/propicsettings", {
                store: true,
                enable: evt.target.checked
            }).then(res => {
                if (res.status == 200) {
                    console.log(res.data);
                    Swal.fire({
                        icon: "success",
                        width: 300,
                        title: lang[lang_id].success,
                        showConfirmButton: false,
                        timer: 2400,
                        timerProgressBar: true
                    })
                }
            }).catch(err => {
                Swal.close();
                console.log("(APICallSDG/ProPicSettings) ", err);
                if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                    Logout(false)
                } else {
                    Swal.fire({
                        icon: "error",
                        title: lang[lang_id].error,
                        text: lang[lang_id].saverels_err,
                        showConfirmButton: false,
                        timer: 2400,
                        timerProgressBar: true
                    })
                }
            })
        } else {
            use_imgs.switchButton(evt.target.checked ? "off" : "on", true)
        }
    }).then(() => {
        btn_propics.style.display = use_imgs.checked ? "block" : "none"
    })
});

use_clearances.addEventListener("change", evt => {
    Swal.fire({
        icon: "warning",
        title: evt.target.checked ? lang[lang_id].warning : lang[lang_id].beforeproceed,
        html: evt.target.checked ? lang[lang_id].beforeclearances : lang[lang_id].beforerollback,
        showCancelButton: true,
        confirmButtonText: lang[lang_id].accept,
        cancelButtonText: lang[lang_id].cancel
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: "info",
                text: lang[lang_id].pleasewait,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });
            APICallSDG("post", "/clearancesettings", {
                store: true,
                enable: evt.target.checked
            }).then(res => {
                if (res.status == 200) {
                    console.log(res.data);
                    Swal.fire({
                        icon: "success",
                        width: 300,
                        title: lang[lang_id].success,
                        showConfirmButton: false,
                        timer: 2400,
                        timerProgressBar: true
                    });
                    btn_usersync.disabled = false
                } else {
                    Swal.fire({
                        icon: "warning",
                        text: lang[lang_id].saverels_err,
                        showConfirmButton: false,
                        timer: 2400,
                        timerProgressBar: true
                    })
                }
            }).catch(err => {
                Swal.close();
                console.log(`(APICallSDG/ClearanceSettings, enable: ${evt.target.checked}) `, err);
                if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                    Logout(false)
                } else {
                    Swal.fire({
                        icon: "error",
                        title: lang[lang_id].error,
                        text: lang[lang_id].saverels_err,
                        showConfirmButton: false,
                        timer: 2400,
                        timerProgressBar: true
                    })
                }
            })
        } else {
            use_clearances.switchButton(evt.target.checked ? "off" : "on", true)
        }
    }).then(() => {
        btn_clearances.style.display = use_clearances.checked ? "block" : "none"
    })
});
select_type.addEventListener("change", evt => {
    lbl_sel = evt.target.checked ? lang[lang_id].penroll_sel : lang[lang_id].page_sel;
    select_ulbl.textContent = table_usr.rows(".selected").data().length != 0 ? lbl_sel[1] : lbl_sel[0]
});

function CheckCloud(active = true) {
    sub_domain.disabled = !active;
    e_mail.disabled = !active
}

function CheckAlive() {
    if (keepalive[0]) clearInterval(keepalive[0]);
    APICallSDG("get", "/checkalive").then(resp => {
        if (resp.status == 200) {
            console.log("OK to work");
            keepalive[1] = AliveTime;
            Swal.close()
        }
    }).catch(e => {
        keepalive[1] = 1;
        console.log("NOT online");
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
    }).finally(() => {
        keepalive[0] = setInterval(CheckAlive, keepalive[1] * 60 * 1e3)
    })
}

function Control() {
    setTimeout(function () {
        Logout(false)
    }, TimeOut * 60 * 1e3);
    importoffdevs.accept = ".sdg";
    importkiosklic.accept = ".sdg";
    vf_logo.accept = "image/*"
}

function CloudLicense(active = true) {
    b2ACafter.style.display = active ? "flex" : "none";
    b2ACbefore.style.display = active ? "none" : "flex";
    use_cloud.switchButton(active ? "on" : "off");
    use_cloud.switchButton(active ? "enable" : "disable")
}

function InitSystem() {
    SetLang(lang_id);
    Control();
    getUserName();
    CheckActivation();
    CheckAlive();
    CloudLicense(false);
    CheckCloud(false);
    btn_usersync.disabled = true;
    document.getElementById("btn_add").disabled = true;
    importfile.accept = ".lic"
}
if (document.readyState == "loading") {
    if (!sessionStorage.session_id) {
        window.location.replace("index.html")
    }
    if (sessionStorage.type == 1) {
        console.log("Configure menu access for Admin ONLY")
    }
    CheckAlive()
}
InitSystem();