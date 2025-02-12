import User from './User'

export default class AdminUser extends User {
  constructor(id, name, email, avatar) {
    super(id, name, email, 'ADMIN', avatar)
  }

  login() {
    console.log(`${this.name} is logging in as an Admin...`)
    this.token = 'admin-token' // Simulate token generation
    console.log(`${this.name} logged in as ${this.role}`)
  }
  grantPermissions() {
    console.log(`${this.name} granted ${this.role} permissions`)
  }
}
