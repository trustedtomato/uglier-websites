let registerPromise = null

const updateDomainSelectors = async (domainSelectors) => {
  // unregister obsolote domain selectors
  if (registerPromise) {
    const registered = await registerPromise
    registered.unregister()
  }

  // specify which domains should match
  const matches = domainSelectors.flatMap(({ name, subdomains}) => {
    let host = name
    if (subdomains) {
      host = `*.${host}`
    }
    return [
      `https://${host}/*`,
      `http://${host}/*`
    ]
  })

  if (matches.length === 0) return;

  // (re-)register domain selectors
  registerPromise = browser.contentScripts.register({
    matches,
    js: [{ file: '/uglify.js' }],
    runAt: 'document_end'
  })
}

// (on browser startup) register existing domain selectors 
browser.storage.sync
  .get({ domainSelectors: [] })
  .then(({ domainSelectors }) => {
    if (registerPromise) return
    return updateDomainSelectors(domainSelectors)
  })

// re-register domain selectors when requested
browser.runtime.onMessage.addListener(
  ({ type, data }) => {
    if (type === 'updateDomainSelectors') {
      return updateDomainSelectors(data).then(() => true)
    }
  }
)