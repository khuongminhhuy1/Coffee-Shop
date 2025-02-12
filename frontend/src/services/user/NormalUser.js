import User from './User'

export default class NormalUser extends User {
  constructor(id, name, email, avatar) {
    super(id, name, email, 'USER', avatar)
  }
  login() {
    console.log(`${this.name} is logging in as a regular user...`)
    this.token = 'user-token' // Simulate a generated token for the regular user
    console.log(`${this.name} is now logged in as ${this.role}`)
  }
}
