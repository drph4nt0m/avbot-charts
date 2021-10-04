# Playbooks for AvBot 📔

This file will assist you with everything you need to know about [**_how playbooks works_**], [**_playbooks definations_**],[**_writing playbooks for different countries_**], and [**_submitting a playbook_**].

## How playbooks works 📔⚙

In order to get charts, Avbot needs some information about how to scrap the required information about the airodromes and airports from a specific country [**eAIP(electronic Aeronautical Information Publication) 🛫**](https://en.wikipedia.org/wiki/Aeronautical_Information_Publication).

A playbook is a JSON file that will be used by our [scraping engine](./app/engines/axios.js) to get charts.See [**_playbook for India_** :india:](./playbooks/IN.json) for reference.

## Playbooks definations 📔

| Keys          | Description                                            | Data type        | Required | Parent key | Example                                                                                                                          |
| ------------- | ------------------------------------------------------ | ---------------- | -------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| iso           | ISO code of country                                    | String           | Yes      | Country    | `"iso":"IN"`                                                                                                                     |
| name          | Name of the country                                    | String           | Yes      | Country    | `"name": "India"`                                                                                                                |
| source        | Source of information                                  | String           | Yes      | source     | `"source": "Airports Authority of India"`                                                                                        |
| engine        | Name of scraping engine(Axios currently)               | String           | Yes      | scraper    | `"engine": "axios"`                                                                                                              |
| baseUrl       | URL for charts website(eAIP)                           | String           | Yes      | features   | `"baseUrl": "https://aim-india.aai.aero/eaip-v2-02-2021"`                                                                        |
| paths         | Path for getting charts from eAIP                      | Array            | Yes      | features   | [See example](https://github.com/drph4nt0m/avbot-charts/blob/ec58c14ae01da70bcff68a4360027a2142a80366/playbooks/AU.json#L11-L15) |
| route         | Route for the front page                               | String           | Yes      | paths      | `"route": "/index-en-GB.html"`                                                                                                   |
| navigations   | Navigations for the engine to get charts page          | Array            | Optional | paths      | [See example](https://github.com/drph4nt0m/avbot-charts/blob/ec58c14ae01da70bcff68a4360027a2142a80366/playbooks/IN.json#L14-L23) |
| chart.baseUrl | URL for charts page from eAIP                          | String           | Yes      | chart      | [See example](https://github.com/drph4nt0m/avbot-charts/blob/ec58c14ae01da70bcff68a4360027a2142a80366/playbooks/IN.json#L26-L30) |
| selector      | HTML element selector                                  | String or Regexp | Yes      | chart      | `"selector": "a[title=\"${icao}\"]"`                                                                                             |
| attribute     | Attribute of HTML selector                             | String           | Yes      | chart      | `"attribute": "href"`                                                                                                            |
| regex         | Regular Expression for finding selectors based on icao | Regexp           | Optional | chart      | `"regex": "\\(${icao}\\)" `                                                                                                      |
| xpath         | Special syntax for finding selectors                   | String           | Optional | chart      | `"xpath": "//a[contains(text(),'${icao}')]"`                                                                                     |

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
