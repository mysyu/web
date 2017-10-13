var map;
var currentPoint;
var currentCircle;
var current;

function getPoint(pointString) {
    try {
        var coor = pointString.split(",");
    }
    catch (err) {
        return null;
    }
    return { lat: parseFloat(coor[1]), lng: parseFloat(coor[0]) };
}

function getLine(lineString) {
    try {
        var line = [];
        var coors = lineString.split(" ");
        var point = null;
        for (var i = 0; i < coors.length; i++) {
            point = getPoint(coors[i])
            if (point != null)
                line.push(point);
        }
    }
    catch (err) {
        return null;
    }
    return line;
}

function checkspeed(speedString) {
    try {
        var color;
        var speed = parseInt(speedString.split(":")[1]);
        if (speed <= 30)
            color = '#FF0000';
        else if (speed <= 40)
            color = '#FFFF00';
        else
            color = '#00FF00';
    }
    catch (err) {
        return '#000000';
    }
    return color;
}

function showCurrentDetail() {
    var score = 100;
    var min = null;
    var speed = null;
    var accident = 0;
    var hole = 0;
    var construction = 0;
    for (var i = 0; i < events['speed'].length; i++) {
        if ($('#checkSpeed').prop('checked'))
            events['speed'][i].marker.setMap(map);
        else
            events['speed'][i].marker.setMap(null);
        var path = events['speed'][i].marker.getPath();
        for (var j = 0; j < path.length; j++) {
            var p = path.getAt(j);
            if (currentCircle.contains(p)) {
                var d = google.maps.geometry.spherical.computeDistanceBetween(current, path.getAt(j));
                if (min == null || d < min) {
                    min = d;
                    speed = events['speed'][i];
                }
            }
        }
    }
    for (var i = 0; i < events['accident'].length; i++) {
        if (currentCircle.contains(events['accident'][i].marker.getPosition())) {
            events['accident'][i].marker.setMap(map)
            accident++;
        }
        else if ($('#checkAccident').prop('checked'))
            events['accident'][i].marker.setMap(map)
        else
            events['accident'][i].marker.setMap(null);


    }
    for (var i = 0; i < events['hole'].length; i++) {
        if (currentCircle.contains(events['hole'][i].marker.getPosition())) {
            events['hole'][i].marker.setMap(map)
            hole++;
        }
        else if ($('#checkHole').prop('checked'))
            events['hole'][i].marker.setMap(map)
        else
            events['hole'][i].marker.setMap(null);
    }
    for (var i = 0; i < events['construction'].length; i++) {
        if (currentCircle.contains(events['construction'][i].marker.getPosition())) {
            events['construction'][i].marker.setMap(map)
            construction++;
        }
        else if ($('#checkConstruction').prop('checked'))
            events['construction'][i].marker.setMap(map)
        else
            events['construction'][i].marker.setMap(null);
    }
    $("#LatLng").text(current.toString());

    $("#current").text("");
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': current }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results) {
                $("#current").text(results[0].formatted_address);
            }
        }
        else {
        }
    });

    if (speed != null) {
        speed.marker.setMap(map);
        speed = parseInt(speed.description.split(":")[1]);
        if (speed <= 30)
            score -= 20;
        else if (speed <= 40)
            score -= 10;
    }
    score -= hole * 2 + construction * 2 + accident * 5 / 10;
    if (score < 0)
        score = 0;
    $("#score").text(score.toString());
    if (score > 80) {
        currentPoint.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        currentCircle.setOptions({ strokeColor: '#00FF00' });
        currentCircle.setOptions({ fillColor: '#00FF00' });
    }
    else if (score >= 60) {
        currentPoint.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
        currentCircle.setOptions({ strokeColor: '#FFFF00' });
        currentCircle.setOptions({ fillColor: '#FFFF00' });
    }
    else {
        currentPoint.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        currentCircle.setOptions({ strokeColor: '#FF0000' });
        currentCircle.setOptions({ fillColor: '#FF0000' });
    }
    if (speed == null)
        $("#speed").text("無資料");
    else
        $("#speed").text(speed.toString());
    $("#accident").text(accident.toString());
    $("#hole").text(hole.toString());
    $("#construction").text(construction.toString());
}

function initMap() {

    $("#date").text(lastupdate);
    current = new google.maps.LatLng({
        lat: 24.992826247421633,
        lng: 121.30082130432129
    });
    map = new google.maps.Map(document.getElementById('map'), {
        center: current,
        zoom: 10
    });
    currentPoint = new google.maps.Marker({
        position: current,
        map: map
    });
    currentCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        center: current,
        radius: 100,
        map: map,
    });
    google.maps.Circle.prototype.contains = function (latLng) {
        return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
    }

    for (var i = 0; i < events['speed'].length; i++) {
        events['speed'][i].marker = new google.maps.Polyline({
            path: getLine(events['speed'][i].coordinate),
            strokeColor: checkspeed(events['speed'][i].description),
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        (function (i) {
            events['speed'][i].marker.addListener('click', function () {
                $("#event").text("車速");
                $("#address").text(events['speed'][i].address);
                $("#description").html(events['speed'][i].description);
            });
        })(i);
    }
    for (var i = 0; i < events['accident'].length; i++) {
        events['accident'][i].marker = new google.maps.Marker({
            position: getPoint(events['accident'][i].coordinate),
            icon: 'http://maps.google.com/mapfiles/kml/pal3/icon34.png'
        });
        (function (i) {
            events['accident'][i].marker.addListener('click', function () {
                var des = events['accident'][i].description.split(',');
                if (des[3] == "A1")
                    des[3] += "死亡交通事故";
                else if (des[3] == "A2")
                    des[3] += "受傷交通事故";
                $("#event").text("車禍");
                $("#address").text(events['accident'][i].address);
                $("#description").html("時間: " + des[0] + "<br>座標: " + des[4] + ',' + des[5] + "<br>地址: " + des[1] + "<br>行政區: " + des[2] + "<br>事故種類: " + des[3]);
            });
        })(i);
    }
    for (var i = 0; i < events['hole'].length; i++) {
        events['hole'][i].marker = new google.maps.Marker({
            position: getPoint(events['hole'][i].coordinate),
            icon: 'https://maps.google.com/mapfiles/kml/shapes/shaded_dot.png'
        });
        (function (i) {
            events['hole'][i].marker.addListener('click', function () {
                $("#event").text("坑洞");
                $("#address").text(events['hole'][i].address);
                $("#description").html('<a href="' + events['hole'][i].description + '" > ' + events['hole'][i].description + '</a>');
            });
        })(i);
    }
    for (var i = 0; i < events['construction'].length; i++) {
        events['construction'][i].marker = new google.maps.Marker({
            position: getPoint(events['construction'][i].coordinate),
            icon: 'https://maps.google.com/mapfiles/kml/shapes/mechanic.png?x=0&y=32&h=16&w=16'
        });
        (function (i) {
            events['construction'][i].marker.addListener('click', function () {
                $("#event").text("施工");
                $("#address").text(events['construction'][i].address);
                $("#description").html('<a href="' + events['construction'][i].description + '" > ' + events['construction'][i].description + '</a>');
            });
        })(i);
    }
    $("#detect").text($("#radius").val());
    showCurrentDetail();
    $("#radius").on({
        change: function (e) {
            $("#detect").text($("#radius").val());
            currentCircle.setRadius(parseInt($("#radius").val()));
            showCurrentDetail();
        }
    });
    map.addListener('click', function (e) {
        current = e.latLng;
        currentPoint.setPosition(current);
        currentCircle.setCenter(current);
        showCurrentDetail();
    });
    $('#checkAccident').change(showCurrentDetail);
    $('#checkSpeed').change(showCurrentDetail);
    $('#checkHole').change(showCurrentDetail);
    $('#checkConstruction').change(showCurrentDetail);
}
