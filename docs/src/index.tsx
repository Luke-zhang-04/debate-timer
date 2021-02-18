/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.4.1
 * @license BSD-3-Clause
 */

declare const DeStagnate: typeof import("destagnate")

const minute = 60

/**
 * Turns seconds into human readable time
 * E.g `formatTime(90)` -> `"1:30"`
 * Stolen from Discord bot source code
 * @param secs - seconds to format
 * @returns the formatted time
 */
const formatTime = (secs: number): string => {
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

interface State {
    time: number,
    paused: boolean,
}

class Timer extends DeStagnate.Component<{}, State> {

    private _intervalId = 0

    public constructor (parent: HTMLElement) {
        super(parent)

        this.state = {
            time: 0,
            paused: true,
        }
    }

    public spacebar = (): void => {
        if (this.state.paused) {
            this.startTimer()
        } else {
            clearInterval(this._intervalId)
        }

        this.setState({paused: !this.state.paused})
    }

    public startTimer = (): void => {
        const id = setInterval(() => {
            this.setState({time: this.state.time + 1})
        }, 1000)

        this._intervalId = Number(`${id}`)
    }

    public speechStatus = (): HTMLElement | void => {
        if (
            this.state.time <= 30 ||
            this.state.time >= 270 && this.state.time < 300
        ) {
            return <p class="status">Protected Time</p>
        } else if (this.state.time >= 300) {
            return <p class="status">Times up!</p>
        }
    }

    public reset = (): void => {
        clearInterval(this._intervalId)
        this.setState({
            paused: true,
            time: 0,
        })
    }

    public render = (): HTMLElement[] | HTMLElement => {
        if (this.state.time === 0 && this.state.paused) {
            return [
                <h1 class="header">Debate Timer</h1>,
                <p class="subheader">Space to pause/start. r to restart.</p>,
            ]
        }

        const status = this.speechStatus()
        const content: HTMLElement = <div class="container">
            <p class="time">{formatTime(this.state.time)}</p>
            <p class="status">{this.state.paused ? "Paused" : ""}</p>
            {status ? status : null}
        </div>

        return content
    }

}

const root = document.getElementById("root")

if (root) {
    const timer = new Timer(root)

    timer.mount()

    document.addEventListener("keydown", (event) => {
        if (event.key === " ") {
            timer.spacebar()
        } else if (event.key === "r") {
            timer.reset()
        }
    })
} else {
    alert("Could not load timer. Something went wrong: #root not found x_x.")
}
