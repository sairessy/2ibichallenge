class Data {
    constructor() {
        this.data = this.getCountries();
        this.country = Math.round(Math.random()*(this.data.length-1));    
        
        for(let i=0; i<this.data.length; i++) {
            if(this.data[i].latlng.length == 0) { 
                this.data.splice(i, 1);
            }
        }

    }   

    getCountries() {
        let d = [];
        
        $.ajax({
            url: 'https://restcountries.eu/rest/v2/all',
            async: false,
            data: {},
            success: (data) => {
                d = data;
            }
        });

        return d;
    }

    show() {
        let covid = this.getCOVID(this.data[this.country].alpha3Code);

        $('h1').text(this.data[this.country].name);
        $('.city-detail').html(`
            <li>Nome nativo: ${this.data[this.country].nativeName}</li>
            <li>Capital: ${this.data[this.country].capital}</li>
            <li>Area: ${this.data[this.country].area}</li>
            <li>População: ${this.data[this.country].population}</li>
            <li>Região: ${this.data[this.country].region}</li>
            <li>Bandeira: <a href='${this.data[this.country].flag}' style='background-image: url(${this.data[this.country].flag});' target='_blank'></a></li>
            <li>Moeda: ${this.data[this.country].currencies[0].name} (${this.data[this.country].currencies[0].symbol})</li>
            <li>Idioma: ${this.data[this.country].languages[0].name}</li>
        `);

        if(covid) {
            $('.covid').append(`<div class='covid'>
                    <h3>COVID-19</h3>
                    <ul></ul>
                </div>
            `);

            $('.covid ul').append(`
                <li>Confirmados: ${covid.confirmed.value}</li>
                <li>Recuperados: ${covid.recovered.value}</li>
                <li>Mortes: ${covid.deaths.value}</li>
            `);
        }
    }

    showCountry(id) {
        let covid = this.getCOVID(this.data[this.country].alpha3Code);

        $('h1').text(this.data[id].name);
        $('.city-detail').html(`
            <li>Nome nativo: ${this.data[id].nativeName}</li>
            <li>Capital: ${this.data[id].capital}</li>
            <li>Area: ${this.data[id].area}</li>
            <li>População: ${this.data[id].population}</li>
            <li>Região: ${this.data[id].region}</li>
            <li>Bandeira: <a href='${this.data[id].flag}' style='background-image: url(${this.data[id].flag});' target='blank'></a></li>
            <li>Moeda: ${this.data[id].currencies[0].name} (${this.data[id].currencies[0].symbol})</li>
            <li>Idioma: ${this.data[id].languages[0].name}</li>
        `);

        if(covid != {}) {
            $('.covid').html(`<div class='covid'>
                    <h3>COVID-19</h3>
                    <ul></ul>
                </div>
            `);

            $('.covid ul').html(`
                <li>Confirmados: ${covid.confirmed.value}</li>
                <li>Recuperados: ${covid.recovered.value}</li>
                <li>Mortes: ${covid.deaths.value}</li>
                <li>Ultima actualização:</br> ${covid.lastUpdate}</li>
            `);
        } else {
            $('.covid').html(``);
            $('.covid h3').text(' ');
            $('.covid ul').html(``);
        }  
    }

    getCountry() {
        return this.data[this.country];
    }

    getCOVID(code) {
        let covid = {};
        
        $.ajax({
            url: 'https://covid19.mathdro.id/api/countries/'+code,
            async: false,
            data: {},
            success: (data) => {
                covid = data;

            }
        });

        return covid;
    }
}
