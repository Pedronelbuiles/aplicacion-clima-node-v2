const inquirer = require('inquirer')
require('colors')

const pregunta = [
    {
        type: 'input',
        name: 'pausa',
        message: `Presione ${'ENTER'.green} para continuar`
    }
]

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]
    }
]

const inquirerMenu = async () => {
    console.clear();
    console.log('============================='.green);
    console.log('   Seleccione una opción'.white);
    console.log('=============================\n'.green);

    const { opcion } = await inquirer.prompt(preguntas)

    return opcion
}

const pausa = async () => {
    console.log('\n');
    return await inquirer.prompt(pregunta)
}

const leerInput = async (message) => {
    const question = {
        type: 'input',
        name: 'desc',
        message,
        validate(value){
            if (value.length === 0) {
                return 'Por favor ingrese un valor'
            }
            return true
        }
    }

    const { desc } = await inquirer.prompt(question)
    return desc
}

const listarLugares = async (lugares = []) => {
    const choices = lugares.map((lugar, index) => {
        return {
            value: lugar.id,
            name: `${((index + 1) +'.').green} ${lugar.nombre}`
        }
    })

    choices.unshift({
        value: '0',
        name: `${'0.'.green} Cancelar`
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas)
    return id;
}

const confirmar = async (message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]

    const { ok } = await inquirer.prompt(question)
    return ok
}

const mostrarListadoChecklist = async (tareas = []) => {
    const choices = tareas.map((tarea, index) => {
        return {
            value: tarea.id,
            name: `${((index + 1)+'.').green} ${tarea.desc}`,
            checked: (tarea.compleadoEn) ? true : false
        }
    })

    const preguntas = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }
    ]

    const { ids } = await inquirer.prompt(preguntas)
    return ids;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
}