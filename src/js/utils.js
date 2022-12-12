import $ from "jquery";

function load_home_page() {
    reset_active();
    $("#nav_home_btn").addClass("active");
    if(valid_login()) {
        $("#content").html("This is the home page.<br>Welcome " + getCookie("username"));
    } else {
        $("#content").html("This is the home page.<br>Please login to use the map.");
    }
}

function reset_navbar() {
    if(valid_login()) {
        $("#nav_profile_btn").html(getCookie("username"));
        $("#nav_map").css("display", "block");
        $("#nav_profile").css("display", "block");
        $("#nav_login").css("display", "none");
        $("#nav_logout").css("display", "block");
        $("#nav_signup").css("display", "none");
    } else {
        $("#nav_profile_btn").html("");
        $("#nav_map").css("display", "none");
        $("#nav_profile").css("display", "none");
        $("#nav_login").css("display", "block");
        $("#nav_logout").css("display", "none");
        $("#nav_signup").css("display", "block");
    }
}

function reset_active() { // reset the active status in navbar
    $("#nav_home_btn").removeClass("active");
    $("#nav_map_btn").removeClass("active");
}

function reset_form(element) {
    $(element)[0].reset(); // remove all input
    $(element).find(".form-control").attr("value", ""); // remove all value
    $(element).find(".form-control").removeClass("is-valid is-invalid"); // remove validate status
    $(element).find(".modal-feedback").text(""); // remove validate msg
}

function valid_login() {
    return !!window.localStorage.getItem("token");
}

function show_modal(modal_name) { // show modal using js
    const modal = new bootstrap.Modal(document.getElementById(modal_name), {});
    modal.show();
}

function close_modal(modal_name) { // close modal using js
    const modal = bootstrap.Modal.getInstance(document.getElementById(modal_name))
    modal.hide();
    $(".modal-backdrop.show").remove();
}

function show_validate_msg(element, status, msg) { // show validate msg in modal
    $(element).removeClass("is-valid is-invalid"); // remove validate status from the previous try
    $(element).next("div").removeClass("invalid-feedback").text(""); // remove validate msg from the previous try
    if("success" === status){
        $(element).addClass("is-valid");
        $(element).next("div").text("");
    } else if("error" === status){
        $(element).addClass("is-invalid");
        $(element).next("div").addClass("invalid-feedback").text(msg);
    }
}

function setUserCookie(username, firstname, lastname, email) {
    document.cookie = "username=" + username;
    document.cookie = "firstname=" + firstname;
    document.cookie = "lastname=" + lastname;
    document.cookie = "email=" + email;
}

function getCookie(cName) {
    const name = cName + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++)
    {
        const c = ca[i].trim();
        if (c.indexOf(name)===0) return c.substring(name.length,c.length);
    }
    return "";
}

const host = "https://www.yuhong.online";

export {load_home_page, reset_navbar, reset_active, reset_form, show_modal, close_modal, show_validate_msg, setUserCookie, getCookie, host};