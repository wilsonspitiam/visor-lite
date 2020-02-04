import * as map from './map'
import * as mapController from './mapController'

let schemaPolygon = {
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": []
    },
    "properties": {
      "name": ""
    }
}

let schemaMultiPolygon = {
    "type": "Feature",
    "geometry": {
      "type": "MultiPolygon",
      "coordinates": []
    },
    "properties": {
      "name": ""
    }
}

let schemaLine = {
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": []
    },
    "properties": {
      "name": ""
    }
}

let schemaPoint = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": []
    },
    "properties": {
      "name": ""
    }
}

export function init() {
    // changeSelect()
    // radioChanged()
    // radioChangedArea()
    // baseMapSelected()
    // activeLeftPanel()
    // dataSelected()
}

export function transformPoly(polygon){
    const isMultiPoly = /\{(\{[-]?[0-9]+[.][0-9]+\,[-]?[0-9]+[.][0-9]+\}[,]?)+\}/gmi;
    const numberPolygons = /(\{[-]?[0-9]+[.][0-9]+\,[-]?[0-9]+[.][0-9]+\})/gmi;
    const numberPoints = /(\{[-]?[0-9]+[.][0-9]+\,[-]?[0-9]+[.][0-9]+\})/gmi;

    let m;
    let countMultiPoly = 0
    let arrayPolygons = []
    let arrayCoordinates = []
    while ((m = isMultiPoly.exec(polygon)) !== null) {
        if (m.index === isMultiPoly.lastIndex) {
            isMultiPoly.lastIndex++;
        }
        countMultiPoly++;
        arrayPolygons.push(m["0"])
    }
    if(countMultiPoly > 1){
        // console.log('Es un multipoligono', arrayPolygons);
        for(let a = 0; a < arrayPolygons.length; a++){
            let countPoly = 0
            arrayCoordinates = []
            while ((m = numberPolygons.exec(arrayPolygons[0])) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === numberPolygons.lastIndex) {
                    numberPolygons.lastIndex++;
                }
                countPoly++;
                arrayCoordinates.push(m["0"])
            }
            if(countPoly == 1){
                loadFigure(arrayCoordinates, schemaPoint, "Point")
            }
            else{
                if(arrayCoordinates[0] == arrayCoordinates[arrayCoordinates.length -1]){
                    loadFigure(arrayCoordinates, schemaPolygon, "Polygon")
                }
                else{
                    loadFigure(arrayCoordinates, schemaLine, "Line")
                }
            }
        }
    }
    else{
        let countPoly = 0
        while ((m = numberPolygons.exec(polygon)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === numberPolygons.lastIndex) {
                numberPolygons.lastIndex++;
            }
            countPoly++;
            arrayCoordinates.push(m["0"])
        }
        if(countPoly == 1){
            loadFigure(arrayCoordinates, schemaPoint, "Point")
        }
        else{
            if(arrayCoordinates[0] == arrayCoordinates[arrayCoordinates.length -1]){
                loadFigure(arrayCoordinates, schemaPolygon, "Polygon")
            }
            else{
                loadFigure(arrayCoordinates, schemaLine, "Line")
            }
        }
    }
}

function loadFigure(arrayCoordinates, schema, type){
    arrayCoordinates.forEach((element, index, array) => {
        array[index] = element.replace(/\{/gi,'').replace(/\}/gi,'').split(",")
    });

    arrayCoordinates.forEach((element, index, array) => {
        array[index][0] = parseFloat(element[0])
        array[index][1] = parseFloat(element[1])
    });

    if(type == "Polygon"){
        schema.geometry.coordinates = [arrayCoordinates]
    }
    else if(type == "Line"){
        schema.geometry.coordinates = arrayCoordinates
    }
    else if(type == "Point"){
        schema.geometry.coordinates = [arrayCoordinates[0][0], arrayCoordinates[0][1]]
    }

    // console.log(schema)

    map.drawPolygon(schema)
}

export function showTexto (text){
    let textShow = '';
    text = text.replace(/\{/gi,'').replace(/\}/gi,'').split(",")

    text.forEach((element, index, array) => {
        array[index] = element.split(":")
    })

    textShow += '<div id="content">'+
    '<div id="bodyContent">';

    text.forEach(elem => {
        textShow += '<p><b>' + elem[0] + ': </b>' + elem[1] + '</p>'
    })
    textShow += '</div></div>'

    map.showInfoWindow(textShow)
}

function changeSelect() {
    document.querySelector("#listaMpios").addEventListener("change", (d) =>{
        let value = getValueMpio()
        let checkedRadio = getChecked()
        let checkedRadioArea = getCheckedArea()
        let urlFetch
        let typeArea

        if(checkedRadioArea == "type-layer-area-urbana"){
            typeArea = 'U'
        }
        else if(checkedRadioArea == "type-layer-area-rural"){
            typeArea = 'R'
        }
        if(checkedRadio == "type-layer-manzana"){
            urlFetch = 'data/' + value + '_' + typeArea + 'MANZANA.json'
        }
        else if(checkedRadio == "type-layer-construccion"){
            urlFetch = 'data/' + value + '_' + typeArea + 'CONSTRUCCION.json'
        }
        else if(checkedRadio == "type-layer-terreno"){
            urlFetch = 'data/' + value + '_' + typeArea + 'TERRENO.json'
        }

        fetchPoly(urlFetch);
    })
}

function radioChanged() {
    let elementsArray = document.querySelectorAll('input[name=type-layer]');

    elementsArray.forEach((elem) => {
        elem.addEventListener("change", (d) =>{
            let value = getValueMpio()
            let checkedRadio = getChecked()
            let checkedRadioArea = getCheckedArea()
            let urlFetch
            let typeArea

            if(checkedRadioArea == "type-layer-area-urbana"){
                typeArea = 'U'
            }
            else if(checkedRadioArea == "type-layer-area-rural"){
                typeArea = 'R'
            }
            if(checkedRadio == "type-layer-manzana"){
                urlFetch = 'data/' + value + '_' + typeArea + 'MANZANA.json'
            }
            else if(checkedRadio == "type-layer-construccion"){
                urlFetch = 'data/' + value + '_' + typeArea + 'CONSTRUCCION.json'
            }
            else if(checkedRadio == "type-layer-terreno"){
                urlFetch = 'data/' + value + '_' + typeArea + 'TERRENO.json'
            }
      
            fetchPoly(urlFetch);
        });
    });
}

function radioChangedArea() {
    let elementsArray = document.querySelectorAll('input[name=type-layer-area]');

    elementsArray.forEach((elem) => {
        elem.addEventListener("change", (d) =>{
            let checkedRadioArea = getCheckedArea()
            let typeArea

            if(checkedRadioArea == "type-layer-area-urbana"){
                typeArea = 'U'    
                document.querySelector("#type-layer-manzana").disabled = false            
            }
            else if(checkedRadioArea == "type-layer-area-rural"){
                typeArea = 'R'
                if(document.querySelector("#type-layer-manzana").checked){
                    document.querySelector("#type-layer-manzana").disabled = true
                    document.querySelector("#type-layer-manzana").checked = false
                    document.querySelector("#type-layer-construccion").checked = true
                }
            }


            let value = getValueMpio()
            let checkedRadio = getChecked()
            let urlFetch
            if(checkedRadio == "type-layer-manzana"){
                urlFetch = 'data/' + value + '_' + typeArea + 'MANZANA.json'
            }
            else if(checkedRadio == "type-layer-construccion"){
                urlFetch = 'data/' + value + '_' + typeArea + 'CONSTRUCCION.json'
            }
            else if(checkedRadio == "type-layer-terreno"){
                urlFetch = 'data/' + value + '_' + typeArea + 'TERRENO.json'
            }
      
            fetchPoly(urlFetch);
        });
    });
}

function baseMapSelected(){
    let elementsArray = document.querySelectorAll('input[name=type-base-layer]');

    elementsArray.forEach((elem) => {
        elem.addEventListener("change", (d) =>{
            let elementSelected = getSelectedBase();

            console.log(elementSelected)

            if(elementSelected == "type-google-rm"){
                mapController.loadGoogleRM()
            }
            else if(elementSelected == "type-google-st"){
                mapController.loadGoogleST()
            }
            else if(elementSelected == "type-bing"){
                mapController.loadBing()
            }
            else if(elementSelected == "type-maxar-fb"){
                mapController.loadMaxar()
            }
            else if(elementSelected == "type-osm"){
                mapController.loadOSM()
            }
        })
    })
}

function activeLeftPanel(){    
    document.querySelector(".top-bar__btn").addEventListener("click", (d) =>{
        if(document.querySelector(".left-bar").classList.contains("active")){
            document.querySelector(".left-bar").classList.remove('active')

            document.querySelector(".arrow-left").classList.remove('--active')
            document.querySelector(".arrow-left").classList.add('--inactive')

            document.querySelector(".arrow-right").classList.add('--active')            
            document.querySelector(".arrow-right").classList.remove('--inactive')
        }
        else{
            document.querySelector(".left-bar").classList.add('active')

            document.querySelector(".arrow-right").classList.remove('--active')
            document.querySelector(".arrow-right").classList.add('--inactive')

            document.querySelector(".arrow-left").classList.add('--active')
            document.querySelector(".arrow-left").classList.remove('--inactive')
        }
    })
}

function dataSelected(){
    document.querySelector("#type-data").addEventListener("change", (d) =>{
        if(document.querySelector("#type-data").checked){
            map.getMap().data.setMap(map.getMap())
        }
        else{
            map.getMap().data.setMap(null)
        }
    })
}

function fetchPoly(urlFetch){
    document.querySelector(".loader").className += " active";

    fetch(urlFetch)
        .then((response) => {
            if (response.status !== 200) {
                if(response.status == 404){
                    throw new Error("Archivo no encontrado")
                }
                else{                    
                    throw new Error("Ocurrio un error")
                }
            } else {
                return response.json()
            }            
        })
        .then((myJson) => {
            map.drawPolygon(myJson)
        })
        .catch((err) => {
            alert(err)
            document.querySelector(".loader").className = "loader";
        });
}

function getChecked(){
    let radioButtons = document.getElementsByName("type-layer")
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) return radioButtons[i].id
    }
}

function getCheckedArea(){
    let radioButtons = document.getElementsByName("type-layer-area")
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) return radioButtons[i].id
    }
}

function getSelectedBase(){
    let radioButtons = document.getElementsByName("type-base-layer")
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) return radioButtons[i].id
    }
}

function getValueMpio(){
    let elementsArray = document.querySelectorAll("#listaMpios option")
    for (let i = 0; i < elementsArray.length; i++) {
        if (elementsArray[i].selected) return elementsArray[i].value
    }
}
