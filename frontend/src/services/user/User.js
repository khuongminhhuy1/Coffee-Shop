export default class User {
  constructor(name, email, role) {
    if (new.target === User) {
      throw new Error('Cannot instantiate an abstract class directly')
    }
    this.name = name
    this.email = email
    this.role = role
  }
  login() {
    throw new Error('Method "login" must be implemented')
  }
  logout() {
    console.log(`${this.name} logged out`)
  }
}
