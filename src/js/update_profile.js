import $ from "jquery";
import {close_modal, show_validate_msg, setUserCookie, getCookie, host} from './utils';

let firstname, lastname, email;

$(document).on("click", "#confirm_update_profile", function(){
    do_update();
});

function do_update() {
    get_update_info();
    if(check_valid_input()) {
        $.ajax({
            url: host + "/api/updateProfile/",
            method: "POST",
            headers: {
                "Authorization": "Token " + window.localStorage.getItem("token")
            },
            data: {
                firstname: firstname,
                lastname: lastname,
                email: email
            },
            success: function() {
                close_modal("update_profile_modal");
                setUserCookie(getCookie("username"), firstname, lastname, email);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                const response_code = jqXHR.status;
                if(response_code === 500) {
                    console.log(jqXHR.status + " " + textStatus + " " + errorThrown + ": " + jqXHR.responseText);
                }
            }
        });
    }
}

function get_update_info() {
    firstname = $("#first_name").val().trim();
    lastname = $("#last_name").val().trim();
    email = $("#update_email").val().trim();
}

function check_valid_input() {
    const regEmail = /^([a-z0-9_-]+)+@([\da-z-]+)+\.([a-z]+)$/;
    if (email === "" || email === null) {
        show_validate_msg("#update_email", "success", "");
    } else if (!regEmail.test(email)) {
        show_validate_msg("#update_email", "error", "invalid email address");
        return false;
    } else {
        show_validate_msg("#update_email", "success", "");
    }
    return true;
}