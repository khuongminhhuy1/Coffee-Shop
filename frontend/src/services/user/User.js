export default class User {
  constructor(id, name, email, role, avatar) {
    if (new.target === User) {
      throw new Error('Cannot instantiate an abstract class directly')
    }

    this.id = id
    this.name = name
    this.email = email
    this.role = role
    this.avatar = avatar
  }
  login() {
    throw new Error('Method "login" must be implemented')
  }
  logout() {
    console.log(`${this.name} logged out`)
  }
}
