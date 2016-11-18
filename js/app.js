var map;

var markers = [];

function initMap() {

	var styles = [
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "hue": "#0066ff"
            },
            {
                "saturation": 74
            },
            {
                "lightness": 100
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "weight": 0.6
            },
            {
                "saturation": -85
            },
            {
                "lightness": 61
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#5f94ff"
            },
            {
                "lightness": 26
            },
            {
                "gamma": 5.86
            }
        ]
    }
]

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:40.843434, lng: -111.933587},
		zoom: 12,
		styles: styles,
		mapTypeControl: false
	});
	var locations = [
	{title: 'Park Ave Penthouse', location: {lat: 40.7, lng: -73.4 }},
	{title: 'Park Ave Penthouse', location: {lat: 40.8, lng: -73.5 }},
	{title: 'Park Ave Penthouse', location: {lat: 40.784636, lng: -73.63301 }},
	{title: 'Park Ave Penthouse', location: {lat: 41.0, lng: -73.7 }},
	{title: 'Park Ave Penthouse', location: {lat: 41.1, lng: -73.8 }},
	];

	var largeInfowindow = new google.maps.InfoWindow();

	var defaultIcon = makeMarkerIcon('0091ff');

	var highlightedIcon = makeMarkerIcon('FFFF24');



	var bounds = new google.maps.LatLngBounds();

	for(var i = 0; i < locations.length; i++) {
		var position = locations[i].location;
		var title = locations[i].title;
		var marker = new google.maps.Marker({
			position: position,
			title: title,
			// icon: defaultIcon,
			animation: google.maps.Animation.DROP,
			id: i
		});
		markers.push(marker);

		bounds.extend(marker.position);

		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});

		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});

		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});
	}


	document.getElementById('show-listings').addEventListener('click', showListings);
	document.getElementById('hide-listings').addEventListener('click', hideListings);

	function populateInfoWindow(marker, infowindow) {
		if (infowindow.marker != marker) {
			infowindow.marker = marker;
			infowindow.setContent('<div>'+ marker.title + '</div>');
			infowindow.open(map, marker);
			infowindow.addListener('closeclick', function(){
				infowindow.marker = null;
			});
			var streetViewService = new google.maps.StreetViewService();
			var radius = 50;

			function getStreetView(data, status) {
				if (status == google.maps.StreetViewStatus.OK) {
					var nearStreetViewLocation = data.location.latLng;
					var heading = google.maps.geometry.spherical.computeHeading(
						nearStreetViewLocation, marker.position);
						infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
						var panoramaOptions = {
							position: nearStreetViewLocation,
							pov: {
								heading: heading,
								pitch: 30
							}
						};
					var panorama = new google.maps.StreetViewPanorama(
						document.getElementById('pano'), panoramaOptions);

				} else {
					infowindow.setContent('<div>' + marker.title + '</div>' +
						'<div>No Street View Found</div>');
				}
			}

			streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

			infowindow.open(map, marker);
		}
	}

	function showListings(){
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(map);
			bounds.extend(markers[i].position);
		}
		map.fitBounds(bounds);
	}

	function hideListings(){
		for(var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
	}


	function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }
}




