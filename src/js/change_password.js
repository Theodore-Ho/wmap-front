import $ from "jquery";
import {close_modal, show_validate_msg, host} from './utils';

let old_password, new_password, new_password_confirmation;

$(document).on("click", "#confirm_change_password", function(){
    do_change_password();
});

function do_change_password() {
    get_change_info();
    if(check_valid_input()) {
        $.ajax({
            url: host + "/api/changePassword/",
            method: "POST",
            headers: {
                "Authorization": "Token " + window.localStorage.getItem("token")
            },
            data: {
                old_password: old_password,
                new_password: new_password,
                new_password_confirmation: new_password_confirmation
            },
            success: function() {
                close_modal("change_password_modal");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status === 401) {
                    show_validate_msg("#origin_password", "error", "Password incorrect");
                } else if(jqXHR.status === 400) {
                    show_validate_msg("#new_password", "error", "Password must contain at least 8 characters, at least 1 letter, 1 number and 1 special character.");
                } else if(jqXHR.status === 500) {
                    console.log(jqXHR.status + " " + textStatus + " " + errorThrown + ": " + jqXHR.responseText);
                }
            }
        });
    }
}

function get_change_info() {
    old_password = $("#origin_password").val().trim();
    new_password = $("#new_password").val().trim();
    new_password_confirmation = $("#new_password_confirmation").val().trim();
}

function check_valid_input() {
    if(old_password === "" || old_password === null) {
        show_validate_msg("#origin_password", "error", "Please input old password");
        return false;
    } else {
        show_validate_msg("#origin_password", "success", "");
    }
    const regPass = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.\-_=+^`~])[A-Za-z\d@$!%*#?&.\-_=+^`~]{8,}$/;
    if(new_password === "" || new_password === null){
        show_validate_msg("#new_password", "error", "Please input new password");
        return false;
    } else if(!regPass.test(new_password)){
        show_validate_msg("#new_password", "error", "Password must contain at least 8 characters, at least 1 letter, 1 number and 1 special character.");
        return false;
    } else {
        show_validate_msg("#new_password", "success", "");
    }
    if(new_password !== new_password_confirmation) {
        show_validate_msg("#new_password_confirmation", "error", "Password do not match");
        return false;
    } else {
        show_validate_msg("#new_password_confirmation", "success", "");
    }
    return true;
}