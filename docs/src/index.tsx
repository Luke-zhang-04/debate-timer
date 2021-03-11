/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.5.0
 * @license BSD-3-Clause
 */

import DeStagnate from "destagnate"

const minute = 60

const parseNumber = (val: unknown): number | undefined => {
    const number = Number(val ?? undefined)

    return isNaN(number) ? undefined : number
}

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
    protectedTime: number,
    totalTime: number,
}

class Timer extends DeStagnate.Component<{}, State> {

    private _timeForm = DeStagnate.createRef<HTMLInputElement>()

    private _protectedForm = DeStagnate.createRef<HTMLInputElement>()

    private _intervalId = 0

    public constructor (parent: HTMLElement) {
        super(parent)

        const time = parseNumber(localStorage.getItem("time"))
        const protectedTime = parseNumber(localStorage.getItem("protectedTime"))

        this.state = {
            time: 0,
            paused: true,
            protectedTime: protectedTime ?? 30,
            totalTime: time ?? 5,
        }
    }

    public spacebar = (): void => {
        if (this.state.paused) {
            this.startTimer()

            if (this.state.time === 0) {
                const newTime = parseNumber(this._timeForm.current?.value)
                const newProtected = parseNumber(this._protectedForm.current?.value)

                if (
                    newTime !== this.state.totalTime ||
                    newProtected !== this.state.protectedTime
                ) {
                    localStorage.setItem("time", newTime?.toString() ?? "5")
                    localStorage.setItem("protectedTime", newProtected?.toString() ?? "30")

                    this.setState({
                        protectedTime: newProtected,
                        totalTime: newTime,
                    })
                }
            }
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

    public speechStatus = (): JSX.Element | undefined => {
        const totalTime = this.state.totalTime * 60

        if (
            this.state.time <= this.state.protectedTime ||
            this.state.time >= totalTime - this.state.protectedTime &&
                this.state.time < totalTime
        ) {
            return <p class="status">Protected Time</p>
        } else if (this.state.time >= totalTime) {
            return <p class="status">Times up!</p>
        }

        return
    }

    public reset = (): void => {
        clearInterval(this._intervalId)
        this.setState({
            paused: true,
            time: 0,
        })
    }

    public render = (): JSX.Element => {
        if (this.state.time === 0 && this.state.paused) {
            return <div class="container">
                <h1 class="header">Debate Timer</h1>
                <p class="subheader">Space to pause/start. r to restart.</p>

                <form
                    class="form"
                    onSubmit={() => {
                        console.log("SUBMIT")
                    }}
                >
                    <label for="time">Time</label>
                    <input
                        type="number"
                        name="time"
                        value={this.state.totalTime}
                        ref={this._timeForm}
                    />
                    <span>How long the timer should last in minutes</span>

                    <label for="protected">Protected Time</label>
                    <input
                        type="number"
                        name="protected"
                        value={this.state.protectedTime}
                        ref={this._protectedForm}
                    />
                    <span>Protected time at the beginning and end in seconds</span>
                    <button type="submit">Start</button>
                </form>
            </div>
        }

        const status = this.speechStatus()

        return <div class="container">
            <p class="time">{formatTime(this.state.time)}</p>
            <p class="status">{this.state.paused ? "Paused" : ""}</p>
            {status ? status : null}
        </div>
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
