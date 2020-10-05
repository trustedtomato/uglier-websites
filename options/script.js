const $domainSelectorTemplate = document.getElementById('domain-selector-template')
const $domainSelectors = document.getElementById('domain-selectors')
const $addDomainSelector = document.getElementById('add-domain-selector')
const $save = document.getElementById('save');
const $status = document.getElementById('status');

let status = {}
const setStatus = (newStatus = {}) => {
  status = newStatus
  if (newStatus.saved) {
    $status.className = 'saved'
    $status.textContent = 'Succesfully saved!'
  } else if (newStatus.error) {
    $status.className = 'error'
    $status.textContent = newStatus.error
  } else if (newStatus.message) {
    $status.className = 'message'
    $status.textContent = newStatus.message
  } else {
    $status.className = ''
  }
}

const getInputValue = input => input.type === 'checkbox'
  ? input.checked
  : input.value

const setInputValue = (input, value) => input.type === 'checkbox'
  ? input.checked = value
  : input.value = value

const addDomainSelector = (data) => {
  setStatus()

  const $domainSelectorFragment = $domainSelectorTemplate.content.cloneNode(true)
  const $domainSelector = $domainSelectorFragment.querySelector('.domain-selector')

  const inputs = $domainSelector.querySelectorAll('*[data-store-name]')

  if (data) {
    for (const input of inputs) {
      const value = data[input.dataset.storeName]
      setInputValue(input, value)
    }
  }

  for (const input of inputs) {
    input.addEventListener('input', () => {
      setStatus()
    })
  }
  
  $domainSelector.querySelector('.domain-selector__delete').addEventListener('click', () => {
    setStatus()
    $domainSelectors.removeChild($domainSelector)
  })

  $domainSelectors.appendChild($domainSelector)
  return $domainSelector
}

$addDomainSelector.addEventListener('click', () => {
  addDomainSelector()
})

// load existing settings
browser.storage.sync.get({ domainSelectors: [] }).then(({ domainSelectors }) => {
  domainSelectors.forEach(addDomainSelector)
})

// initalize saving
$save.addEventListener('click', () => {
  if (status.saved) return

  setStatus({ message: 'Saving...' })
  const data = [...$domainSelectors.children].map($domainSelector =>
    Object.fromEntries(
      [...$domainSelector.querySelectorAll('*[data-store-name]')]
        .map(input => [input.dataset.storeName, getInputValue(input)])
    )
  )
  browser.storage.sync.set({
    domainSelectors: data
  }).then(() => {
    if (status.message !== 'Saving...') return
    setStatus({ saved: true })
  }).catch((err) => {
    if (status.message !== 'Saving...') return
    setStatus({ error: err.message})
  })
  console.log(data)
})