module.exports = async mongo => {
  try {
    const db = mongo.db()

    const data = await db.executeDbAdminCommand({ replSetGetStatus: 1 })
    const { ok, codeName, members } = data

    if (ok !== 1) {
      return {
        codeName
      }
    }

    return {
      members: members.map(({ name, stateStr }) => ({
        name,
        state: stateStr
      }))
    }
  } catch (e) {
    const { ok, codeName } = e

    if (ok === 0) {
      return {
        codeName
      }
    }

    throw e
  }
}
