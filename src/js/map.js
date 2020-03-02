import * as mapController from './mapController'

let map
let bounds
let infowindow

export function init(lng, lat, zoom){
  let center, z
  center = {lat: 6.235359424848101, lng: -75.27566613217365}
  z = 6
  if(lng != null & lat != null & zoom != null){
    center = {lat: parseFloat(lat), lng: parseFloat(lng)}
    z = parseFloat(zoom)
  }

  
  
  
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: z, 
    maxZoom: 20,
    center: center,    
    disableDefaultUI: true,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      mapTypeIds: ['roadmap', 'satellite','Maxar','Bing','OSM']
    }
  })

  map.mapTypes.set('Maxar', mapController.loadMaxar());
  map.mapTypes.set('Bing', mapController.loadBing());
  map.mapTypes.set('OSM', mapController.loadOSM());

  bounds = new google.maps.LatLngBounds()
  
  map.data.addListener('addfeature', function(e) {
    processPoints(e.feature.getGeometry(), bounds.extend, bounds)
    map.fitBounds(bounds)
  })

  map.data.addListener('click', function(e) {
    infowindow.open(map)
  })

  loadCapa()

}
function loadCapa(){
  //http://34.70.32.87:8080/geoserver/GLocation/wms?service=WMS&version=1.1.0&request=GetMap&layers=GLocation%3Apredios_neiva&bbox=-75.3120880126953%2C2.88615846633911%2C-75.2361373901367%2C2.98631620407104&width=582&height=768&srs=EPSG%3A4326&format=image%2Fpng
  var getTileUrl = function(coord, zoom) {
    var proj = map.getProjection();
    var zfactor = Math.pow(2, zoom);
    // get Long Lat coordinates
    var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
    var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));
    //corrections for the slight shift of the SLP (mapserver)
    var deltaX = 0; //0.0013;
    var deltaY = 0; //0.00058;
    //create the Bounding box string
    var bbox = (top.lng() + deltaX) + "," +
        (bot.lat() + deltaY) + "," +
        (bot.lng() + deltaX) + "," +
        (top.lat() + deltaY);
    return (
      "http://34.70.32.87:8080/geoserver/GLocation/wms?" +
      "&REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1" +
      "&LAYERS=GLocation%3Apredios_neiva" +
      "&FORMAT=image/png&TRANSPARENT=true" +
      "&SRS=EPSG:4326&WIDTH=256&HEIGHT=256" +
      "&STYLES=terrenos" +
      "&BBOX=" + bbox
    );
  };

  var landcover = new google.maps.ImageMapType({
    getTileUrl: getTileUrl,
    name: "Landcover",
    alt: "National Land Cover Database 2016",
    minZoom: 0,
    maxZoom: 19,
    opacity: 1.0
  });
  map.overlayMapTypes.push(landcover);
}

export function drawPolygon(json){
  map.data.forEach((feature) => {
    map.data.remove(feature)
  })
  map.data.addGeoJson(json)
  document.querySelector(".loader").className = "loader"
}

export function showInfoWindow(text){
  infowindow = new google.maps.InfoWindow({
    content: text
  })

  infowindow.open(map)
  infowindow.setPosition(bounds.getCenter())
}

export function getMap(){
  return map
}

function processPoints(geometry, callback, thisArg) {
  if (geometry instanceof google.maps.LatLng) {
    callback.call(thisArg, geometry)
  } else if (geometry instanceof google.maps.Data.Point) {
    callback.call(thisArg, geometry.get())
  } else {
    geometry.getArray().forEach(function(g) {
      processPoints(g, callback, thisArg)
    })
  }
}