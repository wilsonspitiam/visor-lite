import * as map from './map'

export function init(){
    document.querySelector(".btn-zoom-in").addEventListener("click", (d) =>{
        map.getMap().setZoom(map.getMap().getZoom() + 1)
    })

    document.querySelector(".btn-zoom-out").addEventListener("click", (d) =>{
        map.getMap().setZoom(map.getMap().getZoom() - 1)
    })

    document.querySelector(".btn-location").addEventListener("click", (d) =>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((c) => {
                let center = {lat: c.coords.latitude, lng: c.coords.longitude};
                map.getMap().setCenter(center);
                map.getMap().setZoom(14);
            })
        } 
        else {
            alert("El navegador no sorportal a Geolocalización")
        }        
    })

    document.querySelector(".btn-layer-base").addEventListener("click", (d) =>{
        if(!document.querySelector(".right-bar").classList.contains("active")){
            document.querySelector(".right-bar").classList.toggle('active');

            document.querySelector(".btn-layer-base").classList.add('active');
            document.querySelector(".btn-layer-data").classList.remove('active');
            document.querySelector(".layer-base-info").classList.add('active');
            document.querySelector(".layer-base-data").classList.remove('active');
        }
        else{
            if(document.querySelector(".layer-base-info").classList.contains("active")){
                document.querySelector(".right-bar").classList.toggle('active');
                document.querySelector(".btn-layer-base").classList.remove('active');
            }
            else{
                document.querySelector(".btn-layer-base").classList.add('active');
                document.querySelector(".btn-layer-data").classList.remove('active');
                document.querySelector(".layer-base-info").classList.add('active');
                document.querySelector(".layer-base-data").classList.remove('active');
            }
        }
    })    

    document.querySelector(".btn-layer-data").addEventListener("click", (d) =>{
        if(!document.querySelector(".right-bar").classList.contains("active")){
            document.querySelector(".right-bar").classList.toggle('active');

            document.querySelector(".btn-layer-data").classList.add('active');
            document.querySelector(".btn-layer-base").classList.remove('active');
            document.querySelector(".layer-base-info").classList.remove('active');
            document.querySelector(".layer-base-data").classList.add('active');
        } 
        else{
            if(document.querySelector(".layer-base-data").classList.contains("active")){
                document.querySelector(".right-bar").classList.toggle('active');
                document.querySelector(".btn-layer-data").classList.remove('active');
            }
            else{
                document.querySelector(".btn-layer-data").classList.add('active');
                document.querySelector(".btn-layer-base").classList.remove('active');
                document.querySelector(".layer-base-info").classList.remove('active');
                document.querySelector(".layer-base-data").classList.add('active');
            }
        }     
    })
}

export function loadMaxar(){
    var TILE_URL = 'https://www.facebook.com/maps/ml_roads?theme=ml_road_vector&collaborator=fbid&token=ASZUVdYpCkd3M6ZrzjXdQzHulqRMnxdlkeBJWEKOeTUoY_Gwm9fuEd2YObLrClgDB_xfavizBsh0oDfTWTF7Zb4C&hash=ASYM8LPNy8k1XoJiI7A&result_type=satellite_raster_tile&materialize=true&x={x}&y={y}&z={z}';

    // Name the layer anything you like.
    var layerID = 'Maxar';

    // Create a new ImageMapType layer.
    return new google.maps.ImageMapType({
        name: layerID,
        getTileUrl: function(coord, zoom) {
            var url = TILE_URL
            .replace('{x}', coord.x)
            .replace('{y}', coord.y)
            .replace('{z}', zoom);
            return url;
        },
        tileSize: new google.maps.Size(256, 256),
        minZoom: 11,
        maxZoom: 18
    });
}

export function loadBing(){
    var TILE_URL = 'https://ecn.t{switch:0,1,2,3}.tiles.virtualearth.net/tiles/a{u}.jpeg?g=587&mkt=en-gb&n=z';

    // Name the layer anything you like.
    var layerID = 'Bing';

    // Create a new ImageMapType layer.
    return new google.maps.ImageMapType({
        name: layerID,
        getTileUrl: function(coord, zoom) {
            var url = TILE_URL
            .replace(/\{switch:([^}]+)\}/, function(s, r) {
                var subdomains = r.split(',');
                return subdomains[(coord.x + coord.y) % subdomains.length];
            })
            .replace('{u}', function() {
                var u = '';
                if(zoom > 0){
                    for (var z = zoom; z > 0; z--) {
                        var b = 0;
                        var mask = 1 << (z - 1);
                        if ((coord.x & mask) !== 0) b++;
                        if ((coord.y & mask) !== 0) b += 2;
                        u += b.toString();
                    }
                }
                else{
                    u = '132301231011023'
                }
                return u;
            });
            return url;
        },
        tileSize: new google.maps.Size(256, 256),
        minZoom: 1,
        maxZoom: 20
    });
}

export function loadOSM(){
    var TILE_URL = 'https://{switch:a,b,c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    
    // Name the layer anything you like.
    var layerID = 'OSM';

    // Create a new ImageMapType layer.
    return new google.maps.ImageMapType({
        name: layerID,
        getTileUrl: function(coord, zoom) {
            var url = TILE_URL
            .replace('{x}', coord.x)
            .replace('{y}', coord.y)
            .replace('{z}', zoom)            
            .replace(/\{switch:([^}]+)\}/, function(s, r) {
                var subdomains = r.split(',');
                return subdomains[(coord.x + coord.y) % subdomains.length];
            })
            return url;
        },
        tileSize: new google.maps.Size(256, 256),
        minZoom: 1,
        maxZoom: 20
    });
}

export function loadGoogleRM(){
    map.getMap().setMapTypeId('roadmap');
}

export function loadGoogleST(){
    map.getMap().setMapTypeId('satellite');
}

//https://ecn.t0.tiles.virtualearth.net/tiles/a1323012310103130.jpeg?g=587&mkt=en-gb&n=z