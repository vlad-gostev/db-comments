/* eslint-disable no-constructor-return */
abstract class Repository {
  static _instance: Repository | null = null

  constructor() {
    if (Repository._instance) {
      return Repository._instance
    }

    Repository._instance = this
  }
}

export default Repository
