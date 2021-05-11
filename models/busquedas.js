const fs = require('fs')

const axios = require('axios')

//Endpoints de las API's:
// https://www.mapbox.com
// https://docs.mapbox.com/api/search/geocoding/

class Busquedas {
    historial = []
    dbPath = './db/database.json'

    constructor() {
        this.leerDb()
    }

    get paramMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get historialCapitalizado() {
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ')
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1))
            return palabras.join(' ')
        })
    }

    get paramOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async ciudades(lugar = ''){
        // console.log('ciudad', lugar)
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramMapbox
            })

            const resp = await instance.get()
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))

        } catch (error) {
            return []
        }

    }

    async climaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: { ...this.paramOpenWeather, lat, lon }
            })

            const resp = await instance.get()
            const { weather, main } = resp.data
            const { description } = weather[0]
            const { temp_min, temp_max, temp } = main
            
            return {
                desc: description,
                min: temp_min,
                max: temp_max,
                temp: temp
            }
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = '') {

        if (this.historial.includes(lugar.toLowerCase())) {
            return;
        }

        this.historial = this.historial.splice(0,5)

        this.historial.unshift(lugar.toLowerCase())
        this.guardarDb()
    }

    guardarDb(){
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDb(){
        if (!fs.existsSync(this.dbPath)) {
            return null
        }

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })
        const data = JSON.parse(info)

        this.historial = data.historial
    }
}

module.exports = Busquedas;