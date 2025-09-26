// Mock data for CRM customers and deals
export const customers = [
  {
    id: "1",
    name: "Acme Corp",
    contact: "John Doe",
    email: "john.doe@acmecorp.com",
    phone: "+1 555 123 4567",
    status: "Active",
    value: 100000,
    lastContact: "2023-10-26",
  },
  {
    id: "2",
    name: "Beta Solutions",
    contact: "Jane Smith",
    email: "jane.smith@betasolutions.com",
    phone: "+1 555 987 6543",
    status: "Inactive",
    value: 50000,
    lastContact: "2023-10-18",
  },
  {
    id: "3",
    name: "Gamma Industries",
    contact: "Peter Jones",
    email: "peter.jones@gammaindustries.com",
    phone: "+1 555 234 5678",
    status: "Active",
    value: 75000,
    lastContact: "2023-10-22",
  },
]

export const deals = [
  {
    id: "1",
    title: "Acme Corp - Project Alpha",
    customerId: "1",
    value: 50000,
    stage: "Proposal",
    probability: 70,
    expectedCloseDate: "2023-11-15",
    status: "Active",
  },
  {
    id: "2",
    title: "Beta Solutions - Migration Project",
    customerId: "2",
    value: 25000,
    stage: "Negotiation",
    probability: 40,
    expectedCloseDate: "2023-10-30",
    status: "Active",
  },
  {
    id: "3",
    title: "Gamma Industries - Training Program",
    customerId: "3",
    value: 30000,
    stage: "Closed Won",
    probability: 100,
    expectedCloseDate: "2023-10-15",
    status: "Closed",
  },
]

export const users = [
  {
    id: "user1",
    name: "Admin User",
    email: "admin@example.com",
    role: "Administrator",
  },
  {
    id: "user2",
    name: "Manager User", 
    email: "manager@example.com",
    role: "Manager",
  },
]

// Helper functions
export function getCustomerById(id: string) {
  return customers.find(customer => customer.id === id)
}

export function getDealsByCustomerId(customerId: string) {
  return deals.filter(deal => deal.customerId === customerId)
}

export function getDealById(id: string) {
  return deals.find(deal => deal.id === id)
}

export function getUserById(id: string) {
  return users.find(user => user.id === id)
}