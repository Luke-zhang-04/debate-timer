# Timer

All timer related things go here

## changeTime
- Exports the `changeTime` function which lets members add or remove time from timers

## index
Main entry points of timer.
- Exports the the `start` function which can start a timer.

## kill
- Exports the `kill` function which lets members kill/end/stop a timer

## playPause
- Exports the `playPause` function, which lets members play or pause a timer

## utils
- Exports the `formatTime` function, which turns seconds into human readable time E.g `formatTime(90)` -> `"1:30"`
- Exports the `nextKey` function, which returns the smallest number that is not in the array E.g `[0, 1, 4]` -> `3`
- Exports the `muteUser` function, which mutes a user for 1 second after their speech
- Exports the `isauthorizedToModifyTimer` function, which returns whether or not a user is authorized to modify a timer. A user may modify the timer if: they were mentioned on creation of the timer, they created the timer, or they have an admin role
