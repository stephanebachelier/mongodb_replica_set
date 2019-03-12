module.exports = async (mongo, replicaSet) => {
  try {
    const db = mongo.db()

    const { name, nodes } = replicaSet
    const conf = {
      _id: name,
      members: nodes.map(({ host }, index) => ({
        _id: index,
        host
      }))
    }

    const data = await db.executeDbAdminCommand({ replSetInitiate: conf })
    const { ok, codeName } = data

    if (ok !== 1) {
      return {
        codeName
      }
    }

    return data
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
