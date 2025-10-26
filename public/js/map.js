//used leaflet for showing map    https://leafletjs.com/
//used opencage for geocoding     https://opencagedata.com/
var map = L.map('map').setView([coordinates[1], coordinates[0]], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([coordinates[1], coordinates[0]]).addTo(map)
    .bindPopup('<h6>Exact location will be shared after booking</h6>')
    .openPopup('<h6>Exact location will be shared after booking</h6>');