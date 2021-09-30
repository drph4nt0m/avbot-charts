# Contributing to AvBot-Charts

First of all, _thank you for considering contributing_. It helps a **lot** and
helps remove some of the burden from our developer team.

This file will assist you with everything you need to know about
[**_setting up a AvBot-Charts development/testing environment_**](#setting-up-a-developmenttesting-environment),
[**_writing code that will be approved_**](#writing-code-that-will-be-approved),
and [**_submitting your code_**](#submitting-your-code).

## Setting up a development/testing environment

In order to work on AvBot-Charts, you need a working development environment.

### Step 1: Prerequisites

AvBot-Charts has some prerequisites that need to be met in order to test your new
features.

#### Node.js

For AvBot-Charts to function, you need to install the
[Node.js JavaScript Runtime](https://nodejs.org/).

Install version `16.5.x`.

#### NPM

NPM comes built in with [Node.js](#nodejs), so there isn't a need to worry about
it.

### Step 2: Installing dependencies

Now, run the command `npm install` in your terminal. This will install all of
our dependencies.

### Step 3: Environment variables

Run `cp .env.example .env` and fill all the variables.

You can use [MongoDB Atlas](https://cloud.mongodb.com/) to create a free MongoDB database.

## Writing code that will be approved

When you write your code, it should be fit enough to be merged.

Your code should be formatted with Prettier after you write it, if you don't
then a bot will detect your pull request and do that for you.

Your code should pass all test cases.

Code should be reasonable, and we think you are able to understand what that
means.

## Submitting your code

### WARNING

Ensure you are on your _fork_ before continuing. Create one on GitHub.

### Step 1: Commiting

Run the following command:

```bash
git commit -m "Describe your changes here. Try to use less than 50 characters."

# Or, for an extended description:

git commit -m "Describe your changes here. Try to use less than 50 characters.

Put your extended description here."
```

### Step 2: Pushing

Push to your fork with this command:

```bash
git push
```

#### If you get a "cannot find upstream branch" error, run

```bash
git push --set-upstream origin main
```

### Step 3: Creating a Pull Request

On GitHub, select `Pull Requests` and open a new one.

#### Step 3.1: Fill out the template

Fill out our Pull Request template.

Put useful information about the changes there.

### Step 4: All done

Your changes will be reviewed soon. Keep an eye on your pull request!
