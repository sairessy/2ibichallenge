$(document).ready(()=> {
    let d = new Data();
    

    d.show();


    // DEAL WITH THE MAP

    // Init the map
    
    var mymap = L.map('mapid', {
    'center': [51.505, -0.09],
    'zoom': 3,
    'layers': [
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                'attribution': 'Map data &copy; OpenStreetMap contributors'
            })
        ]
    });

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
    
    d.data.forEach(dt=> {
        $('datalist').append(`<option>${dt.name}</option>`);
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
