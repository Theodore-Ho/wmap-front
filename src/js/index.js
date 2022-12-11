import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/js/dist/dropdown';
import '../css/index.css';
import './login';
import './logout';
import './register';
import './update_profile';
import './change_password';
import './map';
import {reset_navbar, load_home_page, reset_form, show_modal, getCookie} from './utils';

window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js'); // setting for bootstrap

// PWA settings
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('service-worker registered')
        }).catch(error => {
            console.log('service-worker register error: ' + error)
        })
    })
}

// load when page initial
$(document).ready(function(){
    reset_navbar();
    load_home_page();
});

$(document).on("click", "#nav_home_btn", function(){
    load_home_page();
});

$(document).on("click", "#nav_logo", function(){
    load_home_page();
});

$(document).on("click", "#nav_signup_btn", function(){
    reset_form("#signup_modal form");
    show_modal("signup_modal");
});

$(document).on("click", "#nav_login_btn", function(){
    reset_form("#login_modal form");
    show_modal("login_modal");
});

$(document).on("click", "#nav_logout_btn", function(){
    show_modal("logout_modal");
});

$(document).on("click", "#update_profile_btn", function(){
    reset_form("#update_profile_modal form");
    $("#first_name").attr("value", getCookie("firstname"));
    $("#last_name").attr("value", getCookie("lastname"));
    $("#update_email").attr("value", getCookie("email"));
    show_modal("update_profile_modal");
});

$(document).on("click", "#change_password_btn", function(){
    reset_form("#change_password_modal form");
    show_modal("change_password_modal");
});