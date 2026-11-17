import express from 'express'

const app = express()

app.use(express.static('public'))

// app.get('/', (request, response) => { 
//       response.send('Help desk tracker is running')
// })

app.listen(3000)
