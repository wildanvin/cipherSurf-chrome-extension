console.log('Background script is running :o')

let currentSite = null
let startTime = Date.now()
const siteData = {} // Object to store time spent on each site

// Helper function to update the time spent on the current site
function updateSiteTime() {
  if (currentSite) {
    const timeSpent = Date.now() - startTime

    // Update the total time for the current site
    if (!siteData[currentSite]) {
      siteData[currentSite] = 0
    }
    siteData[currentSite] += timeSpent

    console.log(
      `Updated time for ${currentSite}: ${siteData[currentSite] / 1000} seconds`
    )
    startTime = Date.now() // Reset start time
  }
}

// Save siteData to Chrome storage
function saveDataToLocalStorage() {
  chrome.storage.local.set({ siteData }, () => {
    console.log('Site data saved:', siteData)
  })
}

// Listen for when a tab becomes active
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    // Update time spent on the previous site
    updateSiteTime()

    const tab = await chrome.tabs.get(activeInfo.tabId)

    // Log the raw tab object for debugging
    console.log('Tab object:', tab)

    // Check if the tab has a valid URL
    if (tab.url && tab.url.startsWith('http')) {
      console.log(`Switched to tab: ${tab.title}, URL: ${tab.url}`)
      currentSite = new URL(tab.url).hostname
      startTime = Date.now() // Start timing for the new site
    } else {
      console.log(
        `Switched to a tab with no valid URL: ${tab.url || 'unknown'}`
      )
      currentSite = null
    }
  } catch (error) {
    console.error('Error retrieving tab details:', error)
  }
})

// Save data periodically (every 5 seconds)
setInterval(() => {
  updateSiteTime()
  saveDataToLocalStorage()
}, 5000)

// Save data when the extension is unloaded
chrome.runtime.onSuspend.addListener(() => {
  updateSiteTime()
  saveDataToLocalStorage()
})
