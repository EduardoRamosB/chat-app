describe('Happy happy scenario!', () => {

  it('should get two messages from OpenAI', async () => {
    cy.fixture("happy_path").then(data => {
      // Visit main page
      cy.viewport(1000, 900)
      cy.visit('http://localhost:5173')
      cy.wait(500)
      cy.contains('< Chat App />')

      // Create an Agent
      cy.get('[data-testid="btnMenuAgent"]').click()
      cy.wait(1000)
      cy.get('[data-testid="txtAgentName"]').type(data.name)
      cy.wait(500)
      cy.get('[data-testid="txtAgentPrompt"]').type(data.prompt)
      cy.get('[data-testid="btnAgentDalle"]').click()
      cy.wait(13000)  // average time for dall-e 2
      cy.get('[data-testid="imgAgentDalle"]')
      cy.get('[data-testid="btnCreateAgent"]').click()
      cy.wait(1000)
      cy.contains(data.name)
      cy.wait(1000)
      cy.get('[data-testid="btnCloseCreateAgent"]').click()
      cy.wait(1000) 

      // Create a Chat with the previous added Agent
      cy.get('[data-testid="btnMenuChat"]').click()
      cy.get('[data-testid="txtChatTitle"]').type(data.title)
      cy.get('[data-testid="sltChatAgent"]').select(data.name)
      cy.get('[data-testid="txtChatDesciption"]').type(data.description)
      cy.wait(500)
      cy.get('[data-testid="btnCreateChat"]').click()
      cy.get('[data-testid="btnCloseCreateChat"]').click()
      cy.wait(500)
      cy.contains(data.title)
      cy.wait(1000)

      cy.contains(data.title).click()

      // First answer when the user does not attach a file to their message
      cy.get('[data-testid="txtChatContent"]').type(data.userMsgs[0])
      cy.wait(1000)
      cy.get('[data-testid="btnChatCreateMessage"]').click()
      cy.contains(data.userMsgs[0])
      cy.wait(1000)

      // Second answer when the user attaches a file to their message
      cy.get('[data-testid="txtChatContent"]').type(data.userMsgs[1])
      cy.get('[data-testid="btnUChatHandleClickImg"]').selectFile(data.filePath, {force: true})
      cy.wait(1000)
      cy.get('[data-testid="btnChatCreateMessage"]').click()
      cy.contains(data.userMsgs[1])
    })
  })

})
