/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.2.1
 * @license BSD-3-Clause
 */

const minute = 60

 /**
 * Turns seconds into human readable time
 * E.g `formatTime(90)` -> `"1:30"`
 * Stolen from Discord bot source code
 * @param {number} secs - seconds to format
 * @returns {string} the formatted time
 */
const formatTime = (secs) => {
    const remainingSeconds = secs % minute // Get the remainder seconds
    const minutes = (secs - remainingSeconds) / minute // Get the number of whole minutes

    /**
     * Add 0 to beginning if remainder seconds is less than 10
     * E.g `"1:3"` -> `"1:03"`
     */
    const remainingSecondsStr = remainingSeconds < 10
        ? `0${remainingSeconds}`
        : remainingSeconds.toString()

    return minutes > 0 // Return the seconds if no minutes have passed
        ? `${minutes}:${remainingSecondsStr}`
        : secs.toString()
}

class Timer extends DeStagnate.Component {

    constructor (parent) {
        super(parent)

        this.state = {
            time: 0,
            paused: true,
        }
    }

    _intervalId = 0

    spacebar = () => {
        if (this.state.paused) {
            this.startTimer()

            this.setState({paused: false})
            return
        }

        clearInterval(this._intervalId)
        this.setState({paused: true})
    }

    startTimer = () => {
        const id = setInterval(() => this.setState({time: this.state.time + 1}), 1000)

        this._intervalId = id
    }

    speechStatus = () => {
        if (
            this.state.time <= 30 ||
            this.state.time >= 270 && this.state.time < 300
        ) {
            return this.createElement("p", {class: "time"}, "Protected Time")
        } else if (this.state.time >= 300) {
            return this.createElement("p", {class: "time"}, "Times up!")
        }
    }

    time = () => [
        this.createElement("p", {class: "time"}, formatTime(this.state.time)),
        this.createElement("p", {class: "status"},
            this.state.paused ? "Paused" : "",
        ),
        this.speechStatus(),
    ]

    reset = () => {
        clearInterval(this._intervalId)
        this.setState({
            paused: true,
            time: 0,
        })
    }

    render = () => {
        const createElement = this.createElement,
            content = this.state.time === 0 && this.state.paused
                ? [createElement("p", {class: "time"}, "Space to pause/start. r to restart.")]
                : this.time()

        return [
            createElement("h1", {class: "header"}, "Debate Timer"),
            ...content,
        ]
    }

}

const timer = new Timer(document.getElementById("root"))

timer.mount()

document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        timer.spacebar()
    } else if (event.key === "r") {
        timer.reset()
    }
})
