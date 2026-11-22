const newTicketButton = document.getElementById('new-ticket-button')
const newTicketForm = document.getElementById('new-ticket-form')
const cancelTicketButton = document.getElementById('cancel-ticket-button')
const ticketDetails = document.getElementById('selected-ticket-details')
const deleteDialog = document.getElementById('delete-ticket-dialog')

let selectedTicketId = null
let ticketToDeleteId = null

const loadTickets = async () =>{ 
      const response = await fetch('/api/tickets', {cache: 'no-store'})
      const tickets = await response.json()

      const activeTickets = tickets.filter(ticket => ticket.status !== 'resolved')
      const resolvedTickets = tickets.filter(ticket => ticket.status === 'resolved')

      const activeList = document.getElementById('active-ticket-list')
      const resolvedList = document.getElementById('resolved-ticket-list')

      activeList.replaceChildren()
      resolvedList.replaceChildren()

      for(const ticket of tickets){ 

            const isResolved = ticket.status === 'resolved'
           

            const card = document.createElement('div')
            card.className = 'border rounded-3 p-3 mt-3'
            const header = document.createElement('div')
            header.className = 'd-flex justify-content-between gap-2'
            const body = document.createElement('div')
            body.className = 'd-flex flex-wrap justify-content-between align-items-center gap-2 my-2'
            const bottom = document.createElement('div')
            bottom.className = 'd-flex gap-2 mt-3 justify-content-end'

            const title = document.createElement('h3')
            title.className = 'h6 mb-0'
            title.textContent = ticket.title
    
            const id = document.createElement('span')
            id.className = 'text-muted'
            id.textContent = `#${ticket.id}`

            const date = document.createElement('span')
            date.className = 'small text-muted'
            date.textContent = ticket.createdAt

            const status = document.createElement('span')
            status.textContent = ticket.status
            status.className = isResolved ? 'badge-bg-success' : 'badge bg-primary'

            const priority = document.createElement('span')
            priority.className = 'small text-muted'
            priority.textContent = ticket.priority

            const open = document.createElement('button')
            open.className = 'btn btn-primary btn-sm'
            open.type = 'button'
            open.textContent = 'Open'
            

            
            open.addEventListener('click', ()=>{ 
                  selectedTicketId = ticket.id
                  document.getElementById('detail-ticket-id').textContent = `#${ticket.id}`
                  document.getElementById('detail-date-created').textContent = ticket.createdAt
                  document.getElementById('detail-ticket-priority').textContent = ticket.priority
                  document.getElementById('detail-title').textContent = ticket.title
                  document.getElementById('detail-description').textContent = ticket.description
                  document.getElementById('support-notes').value = ticket.supportNotes ?? ''
                  document.getElementById('detail-status').value = ticket.status

                  newTicketForm.hidden = true
                  ticketDetails.hidden = false

            })
            const close = document.createElement('button')
            close.className = 'btn btn-outline-danger btn-sm'
            close.type = 'button'
            close.textContent = 'Delete'
            close.addEventListener('click', () =>{ 
                  console.log('ticket to delete:', ticket.id)
                  ticketToDeleteId = ticket.id
                  deleteDialog.showModal()
            })

        
            header.append(title, id)
            body.append(date, status)
            card.append(header, body)

            if (!isResolved) {
                  body.append(priority)
                  bottom.append(open, close)
                  card.append(bottom)
            }

           
            const targetList = isResolved ? resolvedList : activeList
            targetList.append(card)
      }

      console.table(activeTickets)
      console.table(resolvedTickets)
      
      return tickets

}     


      const confirmDeleteButton = document.getElementById('delete-ticket-button')
      confirmDeleteButton.addEventListener('click', async()=>{ 
             const id = ticketToDeleteId
            confirmDeleteButton.disabled = true
                  try{
                  const response = await fetch(`/api/tickets/${id}`,{ 
                              method : 'DELETE'
                        })

                  if(!response.ok){ 
                        alert('could not delete the ticket')
                        return
                  }
                  
                  deleteDialog.close()
                  if(selectedTicketId === id){ 
                        selectedTicketId = null
                        ticketDetails.hidden = true
                  }

                  await loadTickets()
            }catch(error){
                  console.error(error)
                  alert('could not complete the requets, refresh page to see tickets.')
            }finally{ 
                  confirmDeleteButton.disabled = false
            }
      })

newTicketButton.addEventListener('click', ()=>{ 
      ticketDetails.hidden = true
      newTicketForm.hidden = false
      document.getElementById('ticket-title').focus()
})

cancelTicketButton.addEventListener('click', ()=>{ 
      newTicketForm.reset()
      newTicketForm.hidden = true
      ticketDetails.hidden = selectedTicketId === null
      newTicketButton.focus()
})


newTicketForm.addEventListener('submit', async(event)=>{ 
      event.preventDefault()
      const fields = Object.fromEntries(new FormData(event.currentTarget))

      try{
            const response = await fetch('api/tickets', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify(fields)
            })
            if(!response.ok){ 
                  alert('could not create a ticket check the form fields')
                  return
            }

      }catch(error){ 
            console.log(error)
            alert('could not reach the server')
            return
      }
      newTicketForm.reset()
      newTicketForm.hidden = true
      ticketDetails.hidden = selectedTicketId === null
      await loadTickets()

})

const saveTicketButton = document.getElementById('save-ticket-button')

saveTicketButton.addEventListener('click', async()=>{
      if(selectedTicketId === null) return
      const id = selectedTicketId

      const updates ={ 
            supportNotes: document.getElementById('support-notes').value,
            status: document.getElementById('detail-status').value
      }

      try{ 
            const response = await fetch(`/api/tickets/${selectedTicketId}`, { 
                  method: 'PATCH',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify(updates)
            })
            if(!response.ok){ 
                  alert('could not save changes, check the selected status')
                  return
            }
         
            // await loadTickets()
            const refreshedTickets = await loadTickets()
            const updatedTicket = refreshedTickets.find(ticket => ticket.id === id)

            if(updatedTicket && selectedTicketId === id){ 
                  document.getElementById('support-notes').value = updatedTicket.supportNotes ?? ''
                  document.getElementById('detail-status').value = updatedTicket.status
            }
      }catch(error){ 
            console.error(error)
            alert('could not reach the server')
            return
      }

})

loadTickets()