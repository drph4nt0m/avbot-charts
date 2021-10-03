# Playbooks for AvBot 📔

This file will assist you with everything you need to know about [**_how playbooks works_**], [**_playbooks definations_**],[**_writing playbooks for different countries_**], and [**_submitting a playbook_**].

## How playbooks works 📔⚙

In order to get charts, Avbot needs some information about how to scrap the required information about the airodromes and airports from a specific country [**eAIP(electronic Aeronautical Information Publication) 🛫**](https://en.wikipedia.org/wiki/Aeronautical_Information_Publication).

A playbook is a JSON file that will be used by our [scraping engine](./app/engines/axios.js) to get charts.See [**_playbook for India_** :india:](./playbooks/IN.json) for reference.

## Playbooks definations 📔

```js
{
  "country": {
    "iso": "IN", // ISO code of country.
    "name": "India" // Name of the country
  },
  "source": "Airports Authority of India", // Source of information
  "scraper": {
    "engine": "axios",
    "features": {
      "baseUrl": "https://aim-india.aai.aero/eaip-v2-02-2021", //baseUrl is eAIP URL
      "paths": [ // Paths are for navigating the scraper to required sections i.e Charts Section
        {
          "route": "/index-en-GB.html", // Route for the front index page.
          "navigations": [ //The scraping engine selects all the selectors and get thier src and progressively make his way through it.
            {
              "selector": "frame[name=\"eAISNavigationBase\"]",
              "attribute": "src"
            },
            // A selector can be anything that has a src or href to guide the engine
            {
              "selector": "frame[name=\"eAISNavigation\"]",
              "attribute": "src"
            }
          ]
        }
      ],
      // Then we look for aerodromes and airport charts. The aerodromes are identified by thier
      // icao codes. We select a selector on basis of icao code.
      "chart": {
        "baseUrl": "${baseUrl}/eAIP/",
        "selector": "a[title=\"${icao}\"]",
        "attribute": "href"
      }
    }
  }
}
```

## Writing playbooks for different countries 🌍

Writing a playbook is really straightforward.

### Step 1: Find that country eAIP

A great resource for finding AIPs is [this](https://erau.libguides.com/UAS/eAIP)

### Step 2: Get the routes and selectors for paths

Go through page source and find selectors that lead you to the charts page. Write those selectors under paths in playbook.

### Step 3: Find the property which help in getting the link.

Most AIPs have buttons with title property set as ICAO code. Get the selector according to title and set chart selector with it.

NOTE : Not all AIPs follow the same pattern. Make sure that the [Axios Engine](./app/engines/axios.js) finds your selector.

## Submitting a playbook

- After you wrote the playbook for a country. Make sure your code runs

  ```bash
  node app/main.js --icao <ICAO CODE>
  ```

- Make sure you add a test for your playbook in [getChart.test.js](./tests/getChart.test.js)

- Finally submit your Playbook as Pull Request.

## All Done.

Thanks for reading !
