const newTicketButton = document.getElementById('new-ticket-button')
const newTicketForm = document.getElementById('new-ticket-form')
const cancelTicketButton = document.getElementById('cancel-ticket-button')
const ticketDetails = document.getElementById('selected-ticket-details')
const deleteTicketButton = document.getElementById('delete-ticket-button')
const deleteDialog = document.getElementById('delete-ticket-dialog')


newTicketButton.addEventListener('click', ()=>{ 
      ticketDetails.hidden = true
      newTicketForm.hidden = false
      document.getElementById('ticket-title').focus()
})

cancelTicketButton.addEventListener('click', ()=>{ 
      newTicketForm.reset()
      newTicketForm.hidden = true
      ticketDetails.hidden= false
      newTicketButton.focus()
})


newTicketForm.addEventListener('submit', (event)=>{
      event.preventDefault()
      console.table(Object.fromEntries(new FormDataEvent(newTicketForm)))
})

deleteTicketButton.addEventListener('click', ()=>{ 
      deleteDialog.showModal()
})