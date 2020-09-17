$(document).ready(()=> {
    let d = new Data();
    

    d.show();


    // DEAL WITH THE MAP
    var mymap = L.map('mapid').setView([51.505, -0.09], 2);

    // Init the map

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);

    let markers = [];

    // Put markers on the map
    for (let i = 0; i < d.data.length-1; i++) {
        
        let lat = d.data[i].latlng[0].toFixed(4);
        let lng = d.data[i].latlng[1].toFixed(4);

        markers[i] = L.marker([lat, lng]).addTo(mymap);
        markers[i]._lefleat_id = i;
        markers.push(L.marker([lat, lng]));                
    }

    // Atach events on the markers
    markers.forEach(marker => {
        marker.on('click', ()=> {
            let id = marker._lefleat_id;
            d.country = id;
            d.showCountry(id);
            mymap.setView(new L.LatLng(d.data[id].latlng[0], d.data[id].latlng[1]));
            
        });
    });

    let csvStr;

    // DEAL WIT XLS EXPORT
    function downloadXLS(name) {
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvStr);
        hiddenElement.target = '_blank';
        hiddenElement.download = name+'.csv';
        hiddenElement.click();
    }

    $('button').click(()=> {
        csvStr = `sep=,
        Nome nativo,Capital,Area,Região
        ${d.getCountry().nativeName}, ${d.getCountry().capital}, ${d.getCountry().area}, ${d.getCountry().region}
        `;
        downloadXLS(d.getCountry().name);
    });
});