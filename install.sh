#!/bin/sh

pkgMan="yarn"

echo "Performing checks . . ."

if [ ! "$(yarn -v)" ]; then
    pkgMan="npm i"
fi

if [ ! "$(npm -v)" ]; then
    echo "Neither yarn nor npm package managers were found. Make sure you install NodeJS https://nodejs.org/en/ and NPM"

    exit 1
fi

if [ ! "$(node -v)" ]; then
    echo "NodeJS not found. Installing will be useless. Make sure the node command is in PATH and you have NodeJS https://nodejs.org/en/ installed"

    exit 1
fi

if [ ! "$(npx -v)" ]; then
    echo "NPX not found. Installing will not be successful. Make sure the node command is in PATH and you have NodeJS https://nodejs.org/en/ installed"

    exit 1
fi

echo "Installing . . ."

if [ ! -d lib ]; then
    "$pkgMan" || exit 1

    npx tsc -p tsconfig.json || exit 1
    npx tsc -p tsconfig.cli.json || exit 1
else
    "$pkgMan" --production || exit 1
fi

if [ ! -f .env ]; then
    cp -v .env.example .env

    echo "Make sure you add the proper credentials to your .env file. AUTHTOKEN is the Discord authentication token, and APIKEY is the Google Sheets API key."
fi

echo "Installation finished! You can run ./start to start the bot."
