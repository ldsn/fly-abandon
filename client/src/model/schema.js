import Param from './param'

class Schema {
  constructor (index = 1) {
    this.status = 200
    this.statusText = `状态${index}`
    this.example = null
    this.params = [new Param()]
  }
}

export default Schema
