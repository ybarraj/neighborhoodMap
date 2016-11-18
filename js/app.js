var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:40.843434, lng: -111.933587},
		zoom: 12
	});
	var geocoder = new google.maps.Geocoder();
	document.getElementById('submit').addEventListener('click', function(){
		geocodeAddress(geocoder, map);
	})
	var slc = {lat: 40.760779, lng: -111.891047};
	var marker = new google.maps.Marker({
		position: slc, 
		map: map,
		title: 'First Marker'
	});
}




