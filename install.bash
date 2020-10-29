#!/bin/bash

pkgInstall="yarn"
pkgRemove="yarn remove"
removeDevDependencies="y"
removeSources="y"
validResponseValues=("y" "N")

echo "Performing checks . . ."

if [[ ! "$(yarn -v)" ]]; then
    pkgInstall="npm i"
    pkgRemove="npm uninstall"
fi

if [[ ! "$(npm -v)" ]]; then
    echo "Neither yarn nor npm package managers were found. Make sure you install NodeJS https://nodejs.org/en/ and NPM"

    exit 1
fi

if [[ ! "$(node -v)" ]]; then
    echo "NodeJS not found. Installing will be useless. Make sure the node command is in PATH and you have NodeJS https://nodejs.org/en/ installed"

    exit 1
fi

if [[ ! "$(npx -v)" ]]; then
    echo "NPX not found. Installing will not be successful. Make sure the node command is in PATH and you have NodeJS https://nodejs.org/en/ installed"

    exit 1
fi

echo "Installing . . ."

cleanIntall() {
    echo "Building from sources"
    printf "Remove development dependencies after install? [y/N] "
    read -r removeDevDependencies

    if [[ "$removeDevDependencies" == "" ]]; then
        removeDevDependencies="y"
    elif [[ ! "${validResponseValues[*]}" =~ $removeDevDependencies ]]; then
        echo "Unknown response. Response should either be y, N, or nothing"

        exit 1
    fi


    printf "Remove source files after install? [y/N] "
    read -r removeSources

    if [[ "$removeSources" == "" ]]; then
        removeDevDependencies="y"
    elif [[ ! "${validResponseValues[*]}" =~ $removeSources ]]; then
        echo "Unknown response. Response should either be y, N, or nothing"

        exit 1
    fi

    "$pkgInstall" || exit 1

    ./scripts/compile || exit 1

    if [[ "$removeSources" == "y" ]]; then
        rm -rfv scr
        rm -rv cli/index.ts
    fi

    if [[ "$removeDevDependencies" == "y" ]]; then
        "$pkgRemove" $(./scripts/listDevDependencies) # Have to do it like this for some reason
    fi
}

if [ ! -d lib ]||[ ! -f cli/index.js ]; then
    cleanIntall
else
    echo "Compiled JavaScript found. Installing production dependencies only."

    "$pkgInstall" --production || exit 1
fi

if [ ! -f .env ]; then
    cp -v .env.example .env

    echo "Make sure you add the proper credentials to your .env file. AUTHTOKEN is the Discord authentication token, and APIKEY is the Google Sheets API key."
fi

echo "Installation finished! You can run ./start to start the bot."
