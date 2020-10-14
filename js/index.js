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
    
    $('#search').change(()=> {
        d.data.forEach(dt => {
            if(d.name == $('#search').val()) {
                 let covid = this.getCOVID(dt.alpha3Code);
        
                    $('h1').text(dt.name);
                    $('.city-detail').html(`
                        <li>Nome nativo: ${d.nativeName}</li>
                        <li>Capital: ${dt.capital}</li>
                        <li>Area: ${dt.area}</li>
                        <li>População: ${dt.population}</li>
                        <li>Região: ${dt.region}</li>
                        <li>Bandeira: <a href='${dt.flag}' style='background-image: url(${dt.flag});' target='blank'></a></li>
                        <li>Moeda: ${dt.currencies[0].name} (${dt.currencies[0].symbol})</li>
                        <li>Idioma: ${dt.languages[0].name}</li>
                    `);

                    if(covid != undefined) {

                        let mortalidade = (100*(parseInt(covid.deaths.value)/parseInt(covid.confirmed.value))).toFixed(1);

                        $('.covid').html(`<div class='covid'>
                                 <h3>COVID-19</h3>
                                <ul></ul>
                            </div>
                        `);

                        $('.covid ul').html(`
                            <li>Confirmados: ${covid.confirmed.value}</li>
                            <li>Recuperados: ${covid.recovered.value}</li>
                            <li>Mortes: ${covid.deaths.value}</li>
                            <li>Taxa de mortalidade: ${mortalidade}%</li>
                            <li>Data: ${covid.lastUpdate.substr(0, 10)}</li>
                        `);
                    } else {
                        $('.covid').html(``);
                        $('.covid h3').text(' ');
                        $('.covid ul').html(``);
                    }  
                }   
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
