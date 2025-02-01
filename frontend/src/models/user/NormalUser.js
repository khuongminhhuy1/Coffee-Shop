import User from './User'

export default class NormalUser extends User {
  constructor(name, email) {
    super(name, email)
    this.role = 'USER'
  }
  login() {
    console.log(`${this.name} is logging in as a regular user...`)
    this.token = 'user-token' // Simulate a generated token for the regular user
    console.log(`${this.name} is now logged in as ${this.role}`)
  }
}
