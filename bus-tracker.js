var map;
var markers = [];

// Initialize map
function init() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ3NvYXJlcyIsImEiOiJjbDFkemF0cmgwMXduM2JtaXd5Z2U4NDNrIn0.-1sNdNoqxUKtqZ-78iywHw';
    map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [-71.101, 42.358], // starting position [lng, lat]
        zoom: 12 // starting zoom
    });

    // Add markers
    addMarkers();
}

// Add bus markers to map
async function addMarkers(){
    // get bus data
    var locations = await getBusLocations();

    // loop through data, add bus markers
    locations.forEach(function(bus){
        var marker = getMarker(bus.id);		
        if (marker){
            moveMarker(marker.marker,bus);
        }
        else{
            addMarker(bus);			
        }
    });

    // timer
    console.log(new Date());
    setTimeout(addMarkers,15000);
}

// Request bus data from MBTA
async function getBusLocations(){
    var url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
    var response = await fetch(url);
    var json     = await response.json();
    console.log(json.data);
    return json.data;
}

function addMarker(bus){
    var icon = getIcon(bus);

    // Create a DOM element for each marker.
    let el = document.createElement('div');
    const width = 25;
    const height = 25;
    el.className = 'marker';
    el.style.backgroundImage = `url(${icon})`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = '100%';


    // Create marker
    var marker = new mapboxgl.Marker(el)
        .setLngLat([bus.attributes.longitude, bus.attributes.latitude])
        .addTo(map);

    // Push to marker array
    markers.push({
        id: bus.id,
        marker: marker});
}

function getIcon(bus){
    // select icon based on bus direction
    if (bus.attributes.direction_id === 0) {
        return './images/red.png';
    }
    return './images/blue.png';	
}

function moveMarker(marker,bus) {
    // change icon if bus has changed direction
    var icon = getIcon(bus);
    var markerElement = marker.getElement();
    markerElement.style.backgroundImage = icon;

    // move icon to new lat/lon
    marker.setLngLat( [
        bus.attributes.longitude,
        bus.attributes.latitude
    ]);
}

function getMarker(id) {
    var marker = markers.find(function(item) {
        return item.id === id;
    });
    return marker;
}

window.onload = init;
