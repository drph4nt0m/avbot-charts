# Playbook Guide 📔

This file will assist you with everything you need to know about
  - [What is a playbook 😕](#what-is-a-playbook-)
  - [Playbooks definitions 🧾](#playbooks-definitions-)
  - [Writing playbooks for different countries 🌍](#writing-playbooks-for-different-countries-)
  - [Submitting a playbook](#submitting-a-playbook)


## What is a playbook 😕

In order to get charts, Avbot needs some information about how to scrape the required information about the airdromes and airports from a specific country.

A playbook is a JSON file that will be used by one of our [scraping engines](./app/engines/) to get the charts. See [**_playbook for India_** :india:](./playbooks/IN.json) for reference.

## Playbooks definitions 🧾

| Key                                                | Description                                                                                                       | Type         | Required                                   | Example                                                   |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------ | --------------------------------------------------------- |
| `country`                                          | Country details                                                                                                   | JSON         | Yes                                        | [See example](playbooks/IN.json)                          |
| `country.iso`                                      | [alpha-2 code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) of the country | String       | Yes                                        | `"iso": "IN"`                                             |
| `country.name`                                     | Name of the country                                                                                               | String       | Yes                                        | `"name": "India"`                                         |
| `source`                                           | Source/Publisher of the eAIP information                                                                          | String       | Yes                                        | `"source": "Airports Authority of India"`                 |
| `scraper`                                          | Scrapper configuration                                                                                            | JSON         | Yes                                        | [See example](playbooks/IN.json)                          |
| `scraper.engine`                                   | [Scraper engine](app/engines/) to be used                                                                         | "axios"      | Yes                                        | `"engine": "axios"`                                       |
| `scraper.features`                                 | Scrapping features for the engine                                                                                 | JSON         | Yes                                        | [See example](playbooks/IN.json)                          |
| `scraper.features.baseUrl`                         | Constant prefix part of the URL to be used by the routes                                                          | String       | Yes                                        | `"baseUrl": "https://aim-india.aai.aero/eaip-v2-02-2021"` |
| `scraper.features.paths`                           | Collection of multiple routes the scrapper needs to take to reach the final chart page                            | Array        | Yes                                        | [See example](playbooks/IN.json)                          |
| `scraper.features.paths / route`                   | Suffix path to be used along with `scraper.features.baseUrl` to visit pages                                       | String       | Yes                                        | `"route": "/index-en-GB.html"`                            |
| `scraper.features.paths / navigations`             | CSS selector based navigation to be performed on the current `scraper.features.paths | route`                     | Array        | Optional                                   | [See example](playbooks/IN.json)                          |
| `scraper.features.paths / navigations / selector`  | CSS Selector for the element that is to be used for navigation                                                    | String       | Yes                                        | `"selector": "frame[name=\"eAISNavigationBase\"]"`        |
| `scraper.features.paths / navigations / attribute` | URL route giving attribute of the selected element                                                                | String       | Yes                                        | `"attribute": "src"`                                      |
| `scraper.features.chart`                           | The CSS selector based configuration for getting and formatting the final chart URL                               | JSON         | Yes (can either use `chart` or `search`)   | [See example](playbooks/IN.json)                          |
| `scraper.features.chart.baseUrl`                   | Constant prefix part of the URL to be used for all chart URLs                                                     | String       | Yes                                        | `"baseUrl": "${baseUrl}/eAIP/"`                           |
| `scraper.features.chart.selector`                  | CSS Selector for the element that is to be used for getting the final chart URL                                   | String       | Yes (can either use `selector` or `xpath`) | `"selector": "a[title=\"${icao}\"]"`                      |
| `scraper.features.chart.xpath`                     | XPath of the                                                                                                      | String       | Yes (can either use `selector` or `xpath`) | `"xpath": "//a[contains(text(),'${icao}')]"`              |
| `scraper.features.chart.attribute`                 | Chart URL route giving attribute of the selected element                                                          | String       | Yes                                        | `"attribute": "href"`                                     |
| `scraper.features.search`                          | The content text based search configuration for getting and formatting the final chart URL                        | JSON         | Yes (can either use `chart` or `search`)   | [See example](playbooks/AU.json)                          |
| `scraper.features.search.selector`                 | CSS Selector for the element whose content is to be used for searching the final chart URL                        | String       | Yes                                        | `"selector": "h3[style=\"text-align:left\"]"`             |
| `scraper.features.search.regex`                    | RegEx to be searched                                                                                              | RegEx String | Yes                                        | `"regex": "\\(${icao}\\)"`                                |
| `scraper.features.search.text`                     | The text to be passed that will be part of the URL (will mostly be similar to the regex)                          | String       | Yes                                        | `"text": "${icao}"`                                       |

## Writing playbooks for different countries 🌍

Writing a playbook is really straightforward.

### Step 1: Find that country eAIP

A great resource for finding AIPs is [https://erau.libguides.com/UAS/eAIP](https://erau.libguides.com/UAS/eAIP).

### Step 2: Create playbook

- Right click and inspect element on the AIP page.
- Navigate around and find all the routes and selectors needed.
- Save them in the [playbook format](#playbooks-definitions-).

### Step 3: Add test cases for the playbook

- Add a test case for `getAirport` in [tests/getAirport.test.js](tests/getAirport.test.js).
- Add a test case for `getChart` in [tests/getChart.test.js](tests/getChart.test.js).

Test that your changes didn't break anything using

```bash
npm run test
```

## Submitting a playbook 🚀

Follow `## Submitting your code` under [CONTRIBUTING.md](CONTRIBUTING.md#Submitting-your-code) to submit a playbook.
