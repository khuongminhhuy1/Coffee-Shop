import User from './User'

export default class AdminUser extends User {
  constructor(name, email) {
    super(name, email)
    this.role = 'ADMIN'
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
