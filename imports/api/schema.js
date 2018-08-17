const typeDefs = [`
  
  scalar Date

  type Tours {
    _id: ID!,
    tour: String, 
    date: Date, 
    truckId: String, 
    driverId: String, 
    note: String, 
    createdAt: Date, 
    createdBy: String, 
    modifiedAt: Date, 
    modifiedBy: String
  }
  
  type rootQuery {
    tours(limit: Int): [Tours]
  }
  
  schema {
    query: rootQuery
  }
`]


export default typeDefs
