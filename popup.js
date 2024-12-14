document.addEventListener('DOMContentLoaded', () => {
  const siteDataDiv = document.getElementById('site-data')

  // Fetch stored site data from chrome.storage.local
  chrome.storage.local.get('siteData', (data) => {
    console.log('Retrieved site data:', data) // Log retrieved data
    const siteData = data.siteData || {}

    if (Object.keys(siteData).length > 0) {
      siteDataDiv.innerHTML = Object.entries(siteData)
        .map(([site, time]) => {
          return `<div>${site}: ${Math.floor(time / 1000)}s</div>`
        })
        .join('')
    } else {
      siteDataDiv.textContent = 'No data available'
    }
  })

  // Add placeholder functionality for buttons
  document.getElementById('button1').addEventListener('click', () => {
    alert('Button1 clicked')
  })

  document.getElementById('button2').addEventListener('click', () => {
    alert('Button2 clicked')
  })
})
