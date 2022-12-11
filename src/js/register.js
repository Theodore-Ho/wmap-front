import $ from "jquery";
import {close_modal, reset_form, show_modal, show_validate_msg, host} from './utils';

let username, password, password_confirmation;

$(document).on("click", "#register_btn", function(){
    do_register();
});

function do_register() {
    get_register_info();
    if(check_valid_input()) {
        $.ajax({
            url: host + "/api/signup/",
            method: "POST",
            data: {
                username: username,
                password: password,
                password_confirmation: password_confirmation
            },
            success: function() {
                close_modal("signup_modal");
                reset_form("#login_modal form");
                $("#login_username").attr("value", username);
                $("#login_password").attr("value", password);
                show_modal("login_modal");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                const response_code = jqXHR.status;
                if(response_code === 400) {
                    show_validate_msg("#register_username", "error", "Username exists");
                } else if(response_code === 500) {
                    console.log(jqXHR.status + " " + textStatus + " " + errorThrown + ": " + jqXHR.responseText);
                }
            }
        });
    }
}

function get_register_info() {
    username = $("#register_username").val().trim();
    password = $("#register_password").val().trim();
    password_confirmation = $("#register_password_confirmation").val().trim();
}

function check_valid_input() {
    const regName = /(^[a-zA-Z0-9@.+\-_]{3,150}$)/;
    if(username === "" || username === null) {
        show_validate_msg("#register_username", "error", "Please input username");
        return false;
    } else if(!regName.test(username)) {
        show_validate_msg("#register_username", "error", "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.");
        return false;
    } else {
        show_validate_msg("#register_username", "success", "");
    }
    const regPass = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.\-_=+^`~])[A-Za-z\d@$!%*#?&.\-_=+^`~]{8,}$/;
    if(password === "" || password === null) {
        show_validate_msg("#register_password", "error", "Please input password");
        return false;
    } else if(!regPass.test(password)) {
        show_validate_msg("#register_password", "error", "Password must contain at least 8 characters, at least 1 letter, 1 number and 1 special character.");
        return false;
    } else {
        show_validate_msg("#register_password", "success", "");
    }
    if(password !== password_confirmation) {
        show_validate_msg("#register_password_confirmation", "error", "Password do not match");
        return false;
    } else {
        show_validate_msg("#register_password_confirmation", "success", "");
    }
    return true;
}