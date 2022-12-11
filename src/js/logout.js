import $ from "jquery";
import {load_home_page, close_modal, reset_navbar, host} from "./utils";

$(document).on("click", "#confirm_logout", function(){
    do_logout();
});

function do_logout() {
    $.ajax({
        url: host + "/api/logout/",
        method: "GET",
        headers: {
            "Authorization": "Token " + window.localStorage.getItem("token")
        },
        success: function() {
            localStorage.removeItem("token");
            close_modal("logout_modal");
            reset_navbar();
            load_home_page();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status + " " + textStatus + " " + errorThrown + ": " + jqXHR.responseText);
            localStorage.removeItem("token");
            close_modal("logout_modal");
            reset_navbar();
            load_home_page();
        }
    });
}