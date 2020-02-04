import * as map from './js/map'
import * as mapController from './js/mapController'
import * as actions from './js/actions'

import { library, dom } from "@fortawesome/fontawesome-svg-core"
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import homeStyle from './css/style.css'
import logo from './img/logo.png'
import header from './img/header.png'
import loader from './img/loader.gif'
import favicon from './favicon.ico'

library.add(fas, far, fab) 
dom.watch()


var url_string = window.location.href
var url = new URL(url_string)
var x = url.searchParams.get("x")
var y = url.searchParams.get("y")
var z = url.searchParams.get("zoom")

var polygon = url.searchParams.get("polygon")
var texto = url.searchParams.get("texto")

map.init(x,y,z)
// mapController.init()
actions.init()

if(polygon){
    actions.transformPoly(polygon)
    if(texto){
        actions.showTexto(texto)
    }
}

