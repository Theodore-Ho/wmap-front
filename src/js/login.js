import $ from "jquery";
import {load_home_page, close_modal, reset_navbar, show_validate_msg, setUserCookie, host} from './utils';

let username, password;

$(document).on("click", "#login_btn", function(){
    do_login();
});

function do_login() {
    get_login_info();
    if(check_valid_input()) {
        $.ajax({
            url: host + "/api/login/",
            method: "POST",
            data: {
                username: username,
                password: password
            },
            success: function(result) {
                setUserCookie(username, result.firstname, result.lastname, result.email);
                window.localStorage.setItem('token', result.token);
                close_modal("login_modal");
                reset_navbar();
                load_home_page();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                const response_code = jqXHR.status;
                if(response_code === 400 || response_code === 401) {
                    show_validate_msg("#login_password", "error", "Password incorrect");
                } else if(response_code === 500) {
                    console.log(jqXHR.status + " " + textStatus + " " + errorThrown + ": " + jqXHR.responseText);
                }
            }
        });
    }
}

function get_login_info() {
    username = $("#login_username").val().trim();
    password = $("#login_password").val().trim();
}

function check_valid_input() {
    if(username === "" || username === null){
        show_validate_msg("#login_username", "error", "Please input username");
        return false;
    } else {
        show_validate_msg("#login_username", "success", "");
    }
    if(password === "" || password === null){
        show_validate_msg("#login_password", "error", "Please input password");
        return false;
    } else {
        show_validate_msg("#login_password", "success", "");
    }
    return true;
}