require('dotenv').config()
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
    
    let opt;
    const busquedas = new Busquedas();
    
    do {
        opt = await inquirerMenu()

        switch (opt) {
            case 1:
                const termino = await leerInput('Ciudad: ');
                const lugares = await busquedas.ciudades(termino)
                const id = await listarLugares(lugares)

                if (id === '0') continue;

                const { nombre, lat, lng } = lugares.find(lugar => lugar.id === id)

                busquedas.agregarHistorial(nombre)

                const { desc, min, max, temp } = await busquedas.climaLugar(lat,lng)

                console.log('\nInformación de la ciudad \n'.green);
                console.log(`Ciudad: ${nombre.green}`);
                console.log(`Lat: ${(lat + '').green}`);
                console.log(`Lng: ${(lng + '').green}`);
                console.log(`Temperatura: ${(temp + '°').green}`);
                console.log(`Mínima: ${(min + '°').green}`);
                console.log(`Máxima: ${(max + '°').green}`);
                console.log(`Como está el clima: ${desc.green}`);

                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, index) => {
                    console.log(`${((index + 1)+'.').green} ${lugar}`);
                })
                break;
        }

        await pausa()
    } while (opt !== 0);
}

main()