// Basic Server for the Raspberry Project
// Implemented in Node.js for simplicity

const udp = require('dgram')
const server = udp.createSocket('udp4')

const port = 2000

server.on('listening', () => {
    const address = server.address()
    console.log('Listening at port ', address.port)
})

server.on('message', (message, info) => {
    console.log('RaspberryPi Server by David Andrino and Fernando Sanz')

    let count = 0
    let aX = [], aY = [], aZ = [], aR = [], aG = [], aB = []

    console.log('Data received at ' + Date().toLocaleString('es-ES'))
    JSON.parse(message).forEach(e => {
        console.log(`\tSample ${e.sample}:\n\t\tAcceleration: (x, y, z)=(${round(e.acceleration.x)}, ${round(e.acceleration.y)}, ${round(e.acceleration.z)})\n\t\tColor: (r, g, b)=(${round(e.color.r)}, ${round(e.color.g)}, ${round(e.color.b)})`)
        aX.push(e.acceleration.x)
        aY.push(e.acceleration.y)
        aZ.push(e.acceleration.z)
        aR.push(e.color.r)
        aG.push(e.color.g)
        aB.push(e.color.b)
    });
     
    let [mX, dX] = calculateParams(aX)
    let [mY, dY] = calculateParams(aY)
    let [mZ, dZ] = calculateParams(aZ)
    let [mR, dR] = calculateParams(aR)
    let [mG, dG] = calculateParams(aG)
    let [mB, dB] = calculateParams(aB)

    console.log(`Average data:\n\t(x, y, z) = (${round(mX)}, ${round(mY)}, ${round(mZ)})\n\t(r, g, b) = (${round(mR)}, ${round(mG)}, ${round(mB)})`) 
    console.log(`Standard dev:\n\t(x, y, z) = (${round(dX)}, ${round(dY)}, ${round(dZ)})\n\t(r, g, b) = (${round(dR)}, ${round(dG)}, ${round(dB)})`) 

    const response = Buffer.from('ACK')
    server.send(response, info.port, info.address, (err) => {})
})

function calculateParams(arr) {
    if (!arr || arr === 0) return [0, 0]

    const n      = arr.length;
    const mean   = arr.reduce((sum, x) => sum + x, 0) / n;
    const stdDev = Math.sqrt(arr.reduce((sum, x) => sum + (x - mean) ** 2, 0) / n);

    return [mean, stdDev];
}

const round = (num) => Math.round(1000 * num) / 1000

server.bind(port)
