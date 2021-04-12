# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.9.0]

### Added

-   feat(commands): add changelog command
-   feat(commands): add shuffle command

### Changed

-   perf: use `Math.random()` because it's probably faster and security doesn't matter in this case

## [1.8.0] - 2021-04-08

### Added

-   feat(timers): add per channel timer limits
-   feat: add case insensitive commands
-   feat: add verbosity option
-   feat(timer): show list of timers if timer id can't be inferred
-   feat(teamGen): add ability to swap out a motion in a generated round
-   feat(poll): add raw option to prevent pinging members

### Changed

-   perf: add filterMap function
-   feat(help): decrease the size of help a bit
-   feat(poll): don't show empty data for getPoll

### Fixed

-   fix(poll): duplicate poll entry issue

## [1.7.0] - 2021-03-18

### Added

-   feat: allow replying for teamGen arguments
-   feat: bot will attempt to get timer id by user
-   feat: add improved polls
    -   each user gets their own poll
    -   specific categories can be taken from polls
-   feat: trim incoming messages
-   feat: add broadcast feature
-   feat: for `adminRoleName`, allow `hasPermission:PERM`
-   feat: alias `backwards` and `start` commands
-   feat: add dice command

### Changed

-   feat: use more accurate time to show when timer ended
-   fix: use 60 seconds of protected time if speech is 7 minutes or longer
-   feat: send multiple motions if a number argument is supplied
-   feat: use `Discord.MessageEmbed` for help messages
-   reduce default cooldown time

### Fixed

-   fix welcome message and add new config option

## [1.6.0] - 2021-03-10

### Added

-   feat: add `shouldRespondToUnknownCommand`
-   feat: update batch motion getting
    -   feat: add infoslide to motions that include an infoslide
-   feat: show end time after stopping timer

### Fixed

-   fix: BREAKING: configuration file naming conventions
-   fix: problem where motions would reach max length. The messages are now split into parts.
-   fix: convert to ms not secs

## [1.5.1] - 2021-02-25

### Fixed

-   fix: use esmodules distribution of DatePlus for bundle
    -   Fixes bug where timer wouldn't start

## [1.5.0] - 2021-02-25

### Added

-   feat: add welcome message on join
-   feat: add simplified commands

### Fixed

-   fix: fixed bug with DatePlus

## [1.4.2] - 2021-02-17

### Changed

-   Change module types

### Fixed

-   Fix typos

## [1.4.1] - 2021-01-15

### Fixed

-   fix: false positive admin role
    -   Admin was returning true because `undefined !== null` was true

## [1.4.0] - 2020-12-18

### Added

-   CLI
    -   feat: new coreutils such as cd ls and cat
    -   feat: better interface for dealing with servers, channels, and categories
    -   feat: cool spinners
-   Actual Bot
    -   feat: remove duplicate spaces in commands
    -   feat: include info slide for individual motions
    -   feat: add config option for more bad words
    -   feat: allow for different timer lengths
    -   feat: allow different team formations (Worlds, BP, and CP)
    -   feat: substitute teams with partners

### Fixed

-   fix: handle null motion
-   fix: change google sheet to the correct google sheet
-   fix: catch more errors (uncaught promise rejection)

## [1.3.1] - 2020-11-12

### Added

-   build: add more files/directories to unecessary items
-   feat: limit log file size

## [1.3.0] - 2020-11-12

### Added

-   feat: write to error log file with most recent error first including stack trace
-   feat: add fuzzy string matching
    -   E.g `hekp` is auto corrected to `help`
-   feat: add progress bar and percentage (cool) to timer
-   feat: add list command which lists timers
-   feat: allow config file to be in JSON
-   feat: add `maxTimersPerUser` so one user can't take up all the timer slots
-   feat: add commands `give`, `take`, `forward`, and `backward` to control a timer's time

### Changed

-   Timer ids are custom indexes (starting from 0 and going up)
    -   No more long ids
-   Timers have restricted access; only the timer creators and admins can change the state of timers
-   Keep track of speech stages with object
    -   If interval lags, the real time is still kept. To make sure the significant points of the speech are not missed, we keep track of them with an object.

#### BREAKING

-   `play` command renamed to `resume`

## [1.2.1] - 2020-10-29

### Changed

-   remove .git, keep package.json in install.bash for the remove unnecessary files option

## [1.2.0] - 2020-10-29

### Added

-   Play and pause

### Changed

-   Update installation files and processes

## [1.1.1] - 2020-10-28

### Fixed

-   fix install.bash and it's associate scripts

## [1.1.0] - 2020-10-28

### Added

-   Option to not mute user after killing timer
-   Minify and mangle compiled code
-   Add poll feature

### Changed

-   Improvements to install.sh and its respective scripts
-   Bot shows version
-   Output with ES2018 instead of 2015 as Node 12 is ok with it

## [1.0.0] - 2020-10-27

-   Initial Release
