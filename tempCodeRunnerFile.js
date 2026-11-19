import express from 'express'


const tickets = [
{     
      id: 1, 
      title: 'Computer wont turn on.',
      description: 'My computer wont turn on even though the power is plugged in and everything is connected',
      priority: 'critical',
      status: 'open',
      createdAt: '11/19/26',
      supportNotes : ''
},
{     
      id: 2, 
      title: 'Computer wont turn on.',
      description: 'My computer wont turn on even though the power is plugged in and everything is connected',
      priority: 'critical',
      status: 'open',
      createdAt: '11/19/26',
      supportNotes : ''
},
{
      id: 3,
      title: 'Laptop will not connect to Wi-Fi',
      description: 'The laptop sees the office network but disconnects as soon as I sign in.',
      priority: 'high',
      status: 'open',
      createdAt: '11/19/26',
      supportNotes: ''
},
{
      id: 4,
      title: 'Cannot access shared drive',
      description: 'I get an access denied error when opening the Accounting folder.',
      priority: 'medium',
      status: 'open',
      createdAt: '11/18/26',
      supportNotes: 'Confirmed the user can open other shared folders.'
},
{
      id: 5,
      title: 'Printer stuck on paper jam warning',
      description: 'The second-floor printer still shows a jam after I removed the paper.',
      priority: 'low',
      status: 'resolved',
      createdAt: '11/17/26',
      supportNotes: 'Removed a torn piece of paper from the rear tray and printed a test page.'
},
{
      id: 6,
      title: 'Monitor goes black after sign-in',
      description: 'The external monitor shows the login screen and then goes black.',
      priority: 'medium',
      status: 'resolved',
      createdAt: '11/16/26',
      supportNotes: 'Replaced the faulty HDMI cable and confirmed the monitor works after sign-in.'
}
]




const app = express()

app.use(express.static('public'))

app.get('/api/tickets',(req,res)=>{ 
      res.json(tickets)
})

app.delete('/api/tickets/:id', (req,res) =>{ 
      const index = tickets.findIndex(ticket => String(ticket.id) === req.params.id)
      if(index === -1){ 
            return res.status(404).json({error: 'ticket not found'})
      }
      tickets.splice(index, 1)
      res.sendStatus(204)
})

app.listen(3000)
