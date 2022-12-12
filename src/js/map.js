import $ from "jquery";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-search/dist/leaflet-search.min.css';
import 'leaflet-search/dist/leaflet-search.min';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import {host, reset_active} from "./utils";

let circle, map;
let result_layers = [];
let my_location = false;

$(document).on("click", "#nav_map_btn", function(){
    load_map_page();
});

function load_map_page() {
    reset_active();
    $("#nav_map_btn").addClass("active");
    const map_div = $("<div></div>").attr("id", "map");
    $("#content").html(map_div);
    generate_map();
}

function generate_map() {
    const header_ele = $("#header");
    $("#map").css({
        "width": "100%",
        "height": $(document).height() - (header_ele.height() + $("#footer").height() + 80)
    });
    map = L.map('map').setView([53.5, -8.5], 6);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.addLayer(new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')); // leaflet-search with nominatim
    map.addControl( new L.Control.Search({
        url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
        jsonpParam: 'json_callback',
        propertyName: 'display_name',
        propertyLoc: ['lat','lon'],
        marker: L.circleMarker([0,0],{radius:15}),
        autoCollapse: true,
        autoType: false,
        minLength: 2
    }) );

    const search_icon = $("<i></i>").addClass("fa-solid fa-magnifying-glass fa-xl")
        .css("padding-top", "6px").css("padding-left", "6px").attr("id", "search_icon").css("color", "black");
    $(".search-button").html(search_icon);

    // get the top left area elements, to swap the display orders
    const top_left_ele = $("[class='leaflet-top leaflet-left']");
    const zoom_btn_area = $("[class='leaflet-control-zoom leaflet-bar leaflet-control']");
    zoom_btn_area.attr("id", "zoom_btn_area");
    const search_btn_area = $("[class='leaflet-control-search leaflet-control']");
    search_btn_area.attr("id", "search_btn_area");

    // create a location button with leaflet-search button style
    const location_btn_area = $("<div></div>").addClass("leaflet-control-search leaflet-control")
        .attr("id", "location_btn_area");
    const location_btn = $("<a></a>").addClass("search-button")
        .attr("href", "#").attr("title", "Find me...").attr("id", "location_btn");
    const location_icon = $("<i></i>").addClass("fa-solid fa-location-crosshairs fa-xl")
        .css("padding-top", "6px").css("padding-left", "6px").attr("id", "location_icon").css("color", "black");

    // swap the display order. Before: zoom -> search -> location, after: zoom -> location -> search
    // because the location button will cover the search list
    location_btn.html(location_icon);
    location_btn_area.html(location_btn);
    top_left_ele.html("").append(zoom_btn_area).append(location_btn_area).append(search_btn_area);

    // add a search bar at top right, this search use overpass to find amenity
    const region_search_div = $("<div></div>").addClass("leaflet-bar leaflet-control").attr("id", "region_search_div");
    const region_search_btn = $("<button></button>").attr("type", "button").attr("id", "region_search_btn").html("Go");
    const region_search_box = $("<input>").attr("id", "region_search_box").attr("size", 50).attr("placeholder", "Search amenity...");
    const region_search_rm = $("<button></button>").attr("type", "button").attr("id", "region_search_rm").html("×");
    region_search_div.html("").append(region_search_btn).append(region_search_box).append(region_search_rm);
    $("[class='leaflet-top leaflet-right']").html(region_search_div);
}

function find_me(map) {
    navigator.geolocation.getCurrentPosition(
        function (pos) {
            setMapToCurrentLocation(map, pos);
            update_location(pos);
        },
        function (err) {
        },
        {
            enableHighAccuracy: true,
            timeout: 30000
        }
    );
}

function setMapToCurrentLocation(map, pos) {
    console.log("In setMapToCurrentLocation.");
    const myLatLon = L.latLng(pos.coords.latitude, pos.coords.longitude);
    map.flyTo(myLatLon, 16);
    if (circle) {
        map.removeLayer(circle);
    }
    circle = L.circle(myLatLon, {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.3,
        radius: pos.coords.accuracy
    }).addTo(map);
}

$(document).on("click", "#location_btn", function(){
    my_location = my_location !== true;
    if(my_location) {
        find_me(map);
        $("#location_icon").css("color", "red");
    } else {
        $("#location_icon").css("color", "black");
        map.removeLayer(circle);
    }
});

function update_location(pos) { // update location to database
    const locString = pos.coords.longitude + "," + pos.coords.latitude;
    $.ajax({
        type: "POST",
        url: host + "/api/updateLocation/",
        headers: {
            "Authorization": "Token " + window.localStorage.getItem("token")
        },
        data: {
            coord: locString
        },
        success: function() {
            console.log("Update location success");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status + " " + textStatus + " " + errorThrown + ": " + jqXHR.responseText);
        }
    });
}

$(document).on("click", "#region_search_btn", function(){
    const amenity_type = $("#region_search_box").val().trim();
    if(!(amenity_type === "" || amenity_type === null)) {
        do_overpass_search(amenity_type);
    }
});

function buildOverpassApiUrl(map, overpassQuery) {
    const bounds = map.getBounds().getSouth() + ',' + map.getBounds().getWest() + ',' + map.getBounds().getNorth() + ',' + map.getBounds().getEast(); // detect the map region
    const nodeQuery = 'node[' + overpassQuery + '](' + bounds + ');';
    const wayQuery = 'way[' + overpassQuery + '](' + bounds + ');';
    const relationQuery = 'relation[' + overpassQuery + '](' + bounds + ');';
    const query = '?data=[out:json][timeout:15];(' + nodeQuery + wayQuery + relationQuery + ');out body geom;';
    const baseUrl = 'https://overpass-api.de/api/interpreter';
    return baseUrl + query;
}

function do_overpass_search(amenity_type) {
    const overpassApiUrl = buildOverpassApiUrl(map, "amenity=" + amenity_type);

    $.get(overpassApiUrl, function (osmDataAsJson) {
        const resultAsGeojson = osmtogeojson(osmDataAsJson);
        const resultLayer = L.geoJson(resultAsGeojson, {
            style: function () {
                return {color: "#ff0000"};
            },
            filter: function (feature) {
                const isPolygon = (feature.geometry) && (feature.geometry.type !== undefined) && (feature.geometry.type === "Polygon");
                if (isPolygon) {
                    feature.geometry.type = "Point";
                    const polygonCenter = L.latLngBounds(feature.geometry.coordinates[0]).getCenter();
                    feature.geometry.coordinates = [polygonCenter.lat, polygonCenter.lng];
                }
                return true;
            },
            onEachFeature: function (feature, layer) {
                let popupContent = "";
                popupContent = popupContent + "<dt>@id</dt><dd>" + feature.properties.type + "/" + feature.properties.id + "</dd>";
                const keys = Object.keys(feature.properties.tags);
                keys.forEach(function (key) {
                    popupContent = popupContent + "<dt>" + key + "</dt><dd>" + feature.properties.tags[key] + "</dd>";
                });
                popupContent = popupContent + "</dl>"
                layer.bindPopup(popupContent);
            }
        }).addTo(map);
        result_layers.push(resultLayer); // add the search result layer to layer array
    });
}

$(document).on("click", "#region_search_rm", function(){ // remove all the search result by overpass
    $("#region_search_box").val("");
    for(let i = 0; i < result_layers.length; i++) {
        map.removeLayer(result_layers[i]);
    }
    result_layers = [];
});