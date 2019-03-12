module.exports = replicaSet => {
  const { name, nodes } = replicaSet
  const hosts = nodes.map(({ host }) => host).join(',')

  return `mongodb://${hosts}?replicaSet=${name}`
}
