import React from 'react'
import { WorkflowNode } from './index'
import { ReactFlowProvider } from '@xyflow/react'

describe('WorkflowNode Component Test', () => {
  const mockData = {
    label: 'Cypress AI Node',
    description: 'Testing in component mode',
    type: 'tool',
    meta: {
      status: 'ready'
    }
  }

  it('renders correctly on the canvas', () => {
    cy.mount(
      <div style={{ width: '500px', height: '500px', background: '#000' }}>
        <ReactFlowProvider>
          <WorkflowNode data={mockData} isPreview={false} />
        </ReactFlowProvider>
      </div>
    )

    cy.contains('Cypress AI Node').should('be.visible')
    cy.contains('MCP TOOL').should('be.visible')
  })

  it('shows action buttons in preview mode', () => {
    cy.mount(
      <div style={{ width: '500px', height: '500px', background: '#000' }}>
        <ReactFlowProvider>
          <WorkflowNode data={mockData} isPreview={true} />
        </ReactFlowProvider>
      </div>
    )

    cy.contains('ADD').should('be.visible')
    cy.contains('Ask Trymate').should('be.visible')
  })
})
