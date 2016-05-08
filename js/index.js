// Options

var slide_time = 1200; // The time it takes to complete an entire transition
var change_point = slide_time / 2; // Calculates when the slide should change
var right_arrow = $('.easytransitions_navigation__right'); // Element that trigger move right
var left_arrow = $('.easytransitions_navigation__left'); // Element that trigger move left
var slide_amount = $('.easytransitions section').length; // How many slides
var current_slide = 1; // Starting slide
var on = 1;

var testMode=false;
//var APIkey1="AIzaSyCchBeSTEO0ky4gd59ZPa9kf5aFeOwG_9Y";

var APIkey1="ENTER YOUR OWN KEY (QPX)";
var maxStops =1;
var maxSolutions =5;


var APIkey2="ENTER YOUR OWN KEY (xpedia)";
var maxHotels =5;

right_arrow.click(function(){
  if(on == 1){
    on = 0;
    if(current_slide < slide_amount){
      current_slide++;
      var active_slide = $('.active_slide').next()
      set_transition(active_slide);
      setTimeout(function(){
        $('.active_slide').hide().removeClass('active_slide').next().addClass('active_slide').show();
      },change_point);
      setTimeout(function(){
        on = 1;
      },slide_time);
    } else {
      // End
    }
  }
});

left_arrow.click(function(){
  if(on == 1){
    on = 0;
    if(current_slide > 1){
      current_slide--;
      var active_slide = $('.active_slide').prev()
      set_transition(active_slide);
      setTimeout(function(){
        $('.active_slide').hide().removeClass('active_slide').prev().addClass('active_slide').show();
      },change_point);
      setTimeout(function(){
        on = 1;
      },slide_time);
    } else {
      // Start
    }
  }
});

// Set transition type

function set_transition(tran){
  var transition_type = tran.data('transition')
  $('.easytransitions_transition div').each(function(){
    $(this).removeClass(this.className.split(' ').pop());
    setTimeout(function(){
      $('.easytransitions_transition div').addClass(transition_type)
    },100)

  })
}


/* SEARCH FLIGHTS STUFF */
// Make your own here: http://eternicode.github.io/bootstrap-datepicker

var dateSelect     = $('#flight-datepicker');
var dateDepart     = $('#start-date');
var dateReturn     = $('#end-date');
var spanDepart     = $('.date-depart');
var spanReturn     = $('.date-return');
var spanDateFormat = 'ddd, MMMM D yyyy';
var flightDateFormat = 'ddd, MMMM D hh:mm:ss';
var jsonDateFormat = 'yyyy-MM-dd';



dateSelect.datepicker({
  autoclose: true,
  format: "mm/dd/yyyy",
  maxViewMode: 0,
  startDate: "now"
}).on('change', function() {
  var start = $.format.date(dateDepart.datepicker('getDate'), spanDateFormat);
  var end = $.format.date(dateReturn.datepicker('getDate'), spanDateFormat);
  spanDepart.text(start);
  spanReturn.text(end);
});

var repeatTrips=function(data){
  var data={"selection": [{
    "id": "LKAQrBtaFgTxpXsK",
    "arrivalTime": "2016-05-02T09:52-04:00",
    "departureTime": "2016-05-02T07:00-05:00",
    "origin": "ORD",
    "destination": "DCA",
    "flight":{"carrier":"UA","number":"1785"}
  }]};
  alert("Thanks! Trip Selected!");
  console.log(data);
};

var repeatHotel=function(data){
  var data={"selection": [{
    "id": "21055",
    "Hotel": "Key Bridge Marriott",
    "center": {
      "lat": 38.8991,
      "lng": -77.07357
    },
  }]};
  alert("Thanks! Hotel Selected!");
  console.log(data);
};


var showResults=function(data){
  
  var resultHTML="";
  
  $.each(data.trips.tripOption, function(idx, tripOption) {
    var tripCost=tripOption.saleTotal;
    resultHTML+='<div onclick="repeatTrips(this)" class="flightPick">';
    
    $.each(tripOption.slice, function(idx,slice){
      var sliceDuration = slice.duration+" mins";
      /*hack for now*/
      for (i = 0; i < 1; i++) { 
        segment=slice.segment[i];
        var carrier=segment.flight.carrier+" "+segment.flight.number;
        
        $.each(segment.leg, function(idx,leg){
          var departureTime = $.format.date(leg.departureTime);
          var arrivalTime = leg.arrivalTime;
          var miles= leg.mileage;
          resultHTML+="<b>Flight:</b>"+carrier+"<br/>"+"<b>Depart:</b>"+ departureTime+" - <b>Arrives</b>"+ arrivalTime+"<br/> " +sliceDuration+ " ("+miles +" miles)<br/><br/>";
        });
      }
      /*
      $.each(slice.segment, function(idx,segment){
        var carrier=segment.flight.carrier+" "+segment.flight.number;
        $.each(segment.leg, function(idx,leg){
          var departureTime = leg.departureTime;
          var arrivalTime = leg.arrivalTime;
          var miles= leg.mileage;
          resultHTML+=carrier+" "+sliceDuration+" "+ departureTime+" "+ arrivalTime+" " + miles +"<br/>";
        });
        
        
      })
      */
    });
    resultHTML+="</div>";
    
  });
  
  $("#results").html(resultHTML);
};

var showHotelResults=function(data){
  var resultHTML="";
  $.each(data.result.hotels, function (idx,hotel){
    resultHTML+='<div onclick="repeatHotel(this)" class="hotelPick">';
    
    var id=hotel.id;
    var name=hotel.name;
    var star=hotel.star;
    var price=hotel.price;
    var lat=hotel.center.lat;
    var lon=hotel.center.lng;
    resultHTML+="<b>Hotel:</b>"+name+"<br/>"+"<b>Map:</b>"+ lat+", "+ lon+"<br/> " + price+ " ("+star +" stars)<br/><br/>";
    resultHTML+="</div>";
  });
  $("#hotel-results").html(resultHTML);
};

//search functionality
$("#trip-search").click( function(){
  //create JSON stuff
  var sJSON = '{"request": {"slice": [';
    /*origin*/
    sJSON+='{"origin":"'+$('#origin').val()+'", ';
    sJSON+='"destination":"'+$('#destination').val()+'", ';
    sJSON+='"date":"'+$.format.date(dateDepart.datepicker('getDate'), jsonDateFormat)+'", ';
    sJSON+='"maxStops":'+maxStops+', ';
    sJSON+='"permittedCarrier": ["'+$('#carrier').val()+'"] ';
    sJSON+='},';
    /*destination*/
    sJSON+='{"origin":"'+$('#destination').val()+'", ';
    sJSON+='"destination":"'+$('#origin').val()+'", ';
    sJSON+='"date":"'+$.format.date(dateReturn.datepicker('getDate'), jsonDateFormat)+'", ';
    sJSON+='"maxStops":'+maxStops+', ';
    sJSON+='"permittedCarrier": ["'+$('#carrier').val()+'"] ';
    sJSON+='}';
  sJSON+=' ],"passengers": {"adultCount": 1},"solutions": '+maxSolutions;
  sJSON+='}';
  sJSON+='}';
  console.log("Search request:");
  console.log(sJSON);
  
  //confirm that request is correct
  var FlightRequest=jQuery.parseJSON(sJSON);
  
  //Ajax Search
  if (testMode == false){
    $.ajax({
       type: "POST",
       //Set up your request URL and API Key.
       url: "https://www.googleapis.com/qpxExpress/v1/trips/search?key="+APIkey1, 
       contentType: 'application/json', // Set Content-type: application/json
       dataType: 'json',
       // The query we want from Google QPX, This will be the variable we created in the beginning
       data: JSON.stringify(FlightRequest),
       success: function (data) {
         console.log("Success!" + JSON.stringify(data));
        //Once we get the result you can either send it to console or use it anywhere you like.
         showResults(data);
       },
        error: function(){
         alert("Access to Search API Failed.");
       }
   });
  }else{
  //temp
      var tempResult='{"kind":"qpxExpress#tripsSearch","trips":{"kind":"qpxexpress#tripOptions","requestId":"9qc4xtmTH5nc21A6V0OFrf","data":{"kind":"qpxexpress#data","airport":[{"kind":"qpxexpress#airportData","code":"DCA","city":"WAS","name":"Ronald Reagan Washington Natl"},{"kind":"qpxexpress#airportData","code":"ORD","city":"CHI","name":"Chicago OHare"}],"city":[{"kind":"qpxexpress#cityData","code":"CHI","name":"Chicago"},{"kind":"qpxexpress#cityData","code":"WAS","name":"Washington"}],"aircraft":[{"kind":"qpxexpress#aircraftData","code":"319","name":"Airbus A319"},{"kind":"qpxexpress#aircraftData","code":"E7W","name":"Embraer RJ-175"}],"tax":[{"kind":"qpxexpress#taxData","id":"ZP","name":"US Flight Segment Tax"},{"kind":"qpxexpress#taxData","id":"AY_001","name":"US September 11th Security Fee"},{"kind":"qpxexpress#taxData","id":"US_001","name":"US Transportation Tax"},{"kind":"qpxexpress#taxData","id":"XF","name":"US Passenger Facility Charge"}],"carrier":[{"kind":"qpxexpress#carrierData","code":"UA","name":"United Airlines, Inc."}]},"tripOption":[{"kind":"qpxexpress#tripOption","saleTotal":"USD406.20","id":"1LQyLtFQtCHNaRlTQJxDp3001","slice":[{"kind":"qpxexpress#sliceInfo","duration":112,"segment":[{"kind":"qpxexpress#segmentInfo","duration":112,"flight":{"carrier":"UA","number":"1785"},"id":"GAEJuhnJ4ZX04h6s","cabin":"COACH","bookingCode":"V","bookingCodeCount":9,"marriedSegmentGroup":"0","leg":[{"kind":"qpxexpress#legInfo","id":"L9l8KiKI9hB6gd7H","aircraft":"319","arrivalTime":"2016-05-02T09:52-04:00","departureTime":"2016-05-02T07:00-05:00","origin":"ORD","destination":"DCA","originTerminal":"1","destinationTerminal":"B","duration":112,"mileage":610,"meal":"Food and Beverages for Purchase","secure":true}]}]},{"kind":"qpxexpress#sliceInfo","duration":130,"segment":[{"kind":"qpxexpress#segmentInfo","duration":130,"flight":{"carrier":"UA","number":"3497"},"id":"G2q9iMGIW2zx2z2e","cabin":"COACH","bookingCode":"V","bookingCodeCount":3,"marriedSegmentGroup":"1","leg":[{"kind":"qpxexpress#legInfo","id":"Lt9l52igZkpOnOKH","aircraft":"E7W","arrivalTime":"2016-05-05T12:54-05:00","departureTime":"2016-05-05T11:44-04:00","origin":"DCA","destination":"ORD","originTerminal":"B","destinationTerminal":"2","duration":130,"operatingDisclosure":"OPERATED BY REPUBLIC AIRLINES DBA UNITED EXPRESS","mileage":610,"meal":"Food and Beverages for Purchase","secure":true}]}]}],"pricing":[{"kind":"qpxexpress#pricingInfo","fare":[{"kind":"qpxexpress#fareInfo","id":"AADb8jHFEPpyFhR4WskmbakaT85XgX6pP2JC5NK4niSxHfE","carrier":"UA","origin":"CHI","destination":"WAS","basisCode":"VAA00DWN"},{"kind":"qpxexpress#fareInfo","id":"AADb8jHFEPpyFhR4WskmbakaT85XgX6pP2JC5NK4niSxHfE","carrier":"UA","origin":"WAS","destination":"CHI","basisCode":"VAA00DWN"}],"segmentPricing":[{"kind":"qpxexpress#segmentPricing","fareId":"AADb8jHFEPpyFhR4WskmbakaT85XgX6pP2JC5NK4niSxHfE","segmentId":"G2q9iMGIW2zx2z2e"},{"kind":"qpxexpress#segmentPricing","fareId":"AADb8jHFEPpyFhR4WskmbakaT85XgX6pP2JC5NK4niSxHfE","segmentId":"GAEJuhnJ4ZX04h6s"}],"baseFareTotal":"USD351.62","saleFareTotal":"USD351.62","saleTaxTotal":"USD54.58","saleTotal":"USD406.20","passengers":{"kind":"qpxexpress#passengerCounts","adultCount":1},"tax":[{"kind":"qpxexpress#taxInfo","id":"US_001","chargeType":"GOVERNMENT","code":"US","country":"US","salePrice":"USD26.38"},{"kind":"qpxexpress#taxInfo","id":"AY_001","chargeType":"GOVERNMENT","code":"AY","country":"US","salePrice":"USD11.20"},{"kind":"qpxexpress#taxInfo","id":"XF","chargeType":"GOVERNMENT","code":"XF","country":"US","salePrice":"USD9.00"},{"kind":"qpxexpress#taxInfo","id":"ZP","chargeType":"GOVERNMENT","code":"ZP","country":"US","salePrice":"USD8.00"}],"fareCalculation":"CHI UA WAS 175.81VAA00DWN UA CHI 175.81VAA00DWN USD 351.62 END ZP ORD DCA XT 26.38US 8.00ZP 11.20AY 9.00XF ORD4.50 DCA4.50","latestTicketingTime":"2016-05-02T07:59-04:00","ptc":"ADT"}]}]}}';

      var FlightResponse=jQuery.parseJSON(tempResult);
      showResults(FlightResponse);
    };
  
});
//end button click;

//search functionality
$("#hotel-search").click( function(){
  console.log("http://terminal2.expedia.com:80/x/nlp/results?q="+$("#hotelChain").val()+"%20hotels%20in%20"+$("#hotelAddress").val()+"&limit="+maxHotels+"&verbose=true");
  $.ajax({
     type: "GET",
     //Set up your request URL and API Key.
     url: "http://terminal2.expedia.com:80/x/nlp/results?q="+$("#hotelChain").val()+"%20hotels%20in%20"+$("#hotelAddress").val()+"&limit="+maxHotels+"&verbose=true", 
    headers: {
      "Authorization": "expedia-apikey key=ZzVBVgbv0JtKWAK4sPaqU2yTO5BQiuDM"
      },
     dataType: 'json',
     success: function (data) {
       console.log("Success!" + JSON.stringify(data));
      //Once we get the result you can either send it to console or use it anywhere you like.
       showHotelResults(data);
     },
      error: function(){
       alert("Access to Search API Failed.");
     }
   });
});
//end button click;