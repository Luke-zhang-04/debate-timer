# Debate timer bot

A discord bot and web timer

<p align="center">
    <a href="https://aws.amazon.com/"><img src="https://img.shields.io/badge/Runs%20on-AWS%20EC2-orange?style=for-the-badge&logo=amazon-aws&logoColor=orange" alt="AWS EC2"/></a>
    <a href="https://github.com/Luke-zhang-04/debate-timer/actions"><img src="https://img.shields.io/github/workflow/status/luke-zhang-04/debate-timer/Node.js%20CI?label=Build%20and%20Tests&logo=Github" alt="workflow badge"/></a>
</p>

[Web timer](https://luke-zhang-04.github.io/debate-timer/)

![Screenshot](./assets/screenshot.png)

## NodeJS Versions
This bot only works on Node JS >= 12. This is because Discord JS only supports Node >= 12. Therefore, we don't test for, nor support Node JS 10 or 8.

When installing Node JS for the first time with a package manager such as Yum or dnf, it may install Node 10. Make sure you install Node 12.

## Using the bot

Clone the latest version from git like so
```bash
git clone --single-branch --branch release https://github.com/Luke-zhang-04/debate-timer.git && cd debate-timer
```

Install dependencies
```bash
./install.bash

# Or
bash install.bash
```

Get credentials
- You need to put a [Google Sheets API key](https://developers.google.com/sheets/api/quickstart/js#step_1_turn_on_the) in your .env file for the value APIKEY
- You need to put your [Discord auth token](https://github.com/Tyrrrz/DiscordChatExporter/wiki/Obtaining-Token-and-Channel-IDs) in your .env file for the value AUTHTOKEN

Note that these values are sensitive and should not be shown publicly

Run
```bash
node .

# To run it in the background
node . & disown
```
