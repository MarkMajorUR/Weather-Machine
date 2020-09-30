var oldList;

$(document).ready(function () {

  // Clear Button
  $("#clear").click(function(event){
    event.preventDefault();
    sessionStorage.setItem('city list', '');
    $('.search-history').empty();
  });

  sessionStorage.getItem("city list")

  // Search button click event
  $("#search").on("click", function(event){
    event.preventDefault();
    
    var city = $(".input").val();

    // Builds list of seaches from the session
    if (sessionStorage.getItem("city list") == null) {
      oldList = '';
    } else {
      oldList = sessionStorage.getItem("city list");
    }
    // Stores newly entered city
    sessionStorage.setItem('city list', oldList + ',' + city);
    $(".input").val('');
    var cityList = sessionStorage.getItem('city list').split(',');
    $('.search-history').empty();
    for (const tempCity of cityList) {
      var cityHtml = $('<li/>').text(tempCity);
      $('.search-history').append(cityHtml);
    }

  // $(".search-history").childern().click(function(event){
  //   $(".input").val('');
  //   var search = $(this).text();
  //   $(".input").val(search);
  //   fiveDay(search);
  //   grab(search);
  // });

    fiveDay(city);
    grab(city);

    // Add's dates
    var momentDay = moment().format("dddd, MMMM Do");
    $("#today").prepend(momentDay);

    for (var i = 1; i < 6; i++) {
        $("#" + i + "date").text(moment().add(i, 'd').format('dddd, MMMM Do'));
    }
  });
});


function fiveDay(cityName) {
  var five_queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&exclude=current,minutely,hourly,alerts&units=imperial&appid=0ec7dfda86c78819a7834789f17157dd";

  $.ajax({
    url: five_queryURL,
    method: 'GET',
  }).then(function(response) {
    console.log(response);
    for (var i = 0; i < 40; i += 7) {
     

      $("#" + i/7 + "temp").text( "Temp:" + response.list[i].main.temp);

      $("#" + i/7 + "humid").text( "Humidity" + response.list[i].main.humidity + "%");
    }
  });

}

function grab(cityName) {
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=0ec7dfda86c78819a7834789f17157dd";

  $.ajax({
    url: queryURL,
    method: 'GET',
  }).then(function(response) {
    console.log(response);

    
    var lon = response.coord.lon;
    var lat = response.coord.lat;

    $("#temp-data").html(response.main.temp);
    $("#humidity-data").html(response.main.humidity);
    $("#wind-data").html(response.wind.speed);
    $("#uv-data").html(response.main.temp);

    UV (lon, lat)
  });
}


function UV(lon, lat){
  var uvQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&units=imperial&appid=0ec7dfda86c78819a7834789f17157dd`;

  $.ajax({
    url: uvQueryURL,
    method: 'GET',
  }).then(function (uvResponse) {

    $("#uv-data").html(`${uvResponse.value}`);
    
    if (uvResponse.value <= 2) {
        $("p").css('background-color', 'green');
    } else if (uvResponse.value > 2 && uvResponse.value <= 5) {
        $("p").css('background-color', 'yellow');
    } else if (uvResponse.value > 5 && uvResponse.value <= 7) {
        $("p").css('background-color', 'orange');
    } else if (uvResponse.value > 7 && uvResponse.value <= 10) {
        $("p").css('background-color', 'red');
    } else {
        $("p").css('background-color', 'purple');
    }
  });
}


