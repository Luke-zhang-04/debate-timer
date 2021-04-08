/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.8.0
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import DeStagnate from "destagnate"

const enum Time {
    Minute = 60,
}

const parseNumber = (val: unknown): number | undefined => {
    const number = Number(val ?? undefined)

    return isNaN(number) ? undefined : number
}

/**
 * Turns seconds into human readable time E.g `formatTime(90)` -> `"1:30"` Stolen from Discord bot
 * source code
 *
 * @param secs - Seconds to format
 * @returns The formatted time
 */
const formatTime = (secs: number): string => {
    const remainingSeconds = secs % Time.Minute // Get the remainder seconds
    const minutes = (secs - remainingSeconds) / Time.Minute // Get the number of whole minutes

    /**
     * Add 0 to beginning if remainder seconds is less than 10 E.g `"1:3"` -> `"1:03"`
     */
    const remainingSecondsStr =
        remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds.toString()

    return minutes > 0 // Return the seconds if no minutes have passed
        ? `${minutes}:${remainingSecondsStr}`
        : secs.toString()
}

interface State {
    time: number
    paused: boolean
    protectedTime: number
    totalTime: number
}

class Timer extends DeStagnate.Component<{}, State> {
    private _timeForm = DeStagnate.createRef<HTMLInputElement>()

    private _protectedForm = DeStagnate.createRef<HTMLInputElement>()

    private _intervalId = 0

    private _startTime: number | undefined

    private _pausedTime: number | undefined

    public constructor(parent: HTMLElement) {
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

    public shouldComponentUpdate = (): boolean => this.stateDidChange(["time", "paused"])

    public spacebar = (): void => {
        if (this.state.paused) {
            if (this._pausedTime !== undefined) {
                this._startTime =
                    (this._startTime ??= Date.now()) + (Date.now() - this._pausedTime)
            }

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

            this._pausedTime = undefined
        } else {
            clearInterval(this._intervalId)
            this._pausedTime = Date.now()
        }

        this.setState({paused: !this.state.paused})
    }

    public startTimer = (): void => {
        this.setState({
            time: Math.round((Date.now() - (this._startTime ??= Date.now())) / 1000),
        })

        const id = setInterval(() => {
            this.setState({
                time: Math.round((Date.now() - (this._startTime ??= Date.now())) / 1000),
            })
        }, 1000)

        this._intervalId = Number(`${id}`)
    }

    public speechStatus = (): JSX.Element | undefined => {
        const totalTime = this.state.totalTime * 60

        if (
            this.state.time <= this.state.protectedTime ||
            (this.state.time >= totalTime - this.state.protectedTime &&
                this.state.time < totalTime)
        ) {
            return <p class="status">Protected Time</p>
        } else if (this.state.time >= totalTime && this.state.time <= totalTime + 15) {
            return <p class="status">Grace Time</p>
        }

        return
    }

    public reset = (): void => {
        clearInterval(this._intervalId)
        this._startTime = undefined
        this._pausedTime = undefined
        this.setState({
            paused: true,
            time: 0,
        })
    }

    public onKeyDown = (event: KeyboardEvent) => {
        if (event.key === " " || event.code == "Enter") {
            this.spacebar()
        } else if (event.key === "r") {
            this.reset()
        }
    }

    public render = (): JSX.Element => {
        const corner = document.getElementById("github-corner")
        const barContainer = document.querySelector<HTMLElement>(".progress-bar-container")
        const bar = barContainer?.querySelector<HTMLElement>(".progress-bar")

        if (this.state.time === 0 && this.state.paused) {
            if (corner) {
                corner.style.display = "block"
            }

            if (bar) {
                bar.style.width = "0"
                bar.style.display = "none"
            }

            if (barContainer) {
                barContainer.classList.remove("red")
            }

            return (
                <div class="container">
                    <h1 class="header">Debate Timer</h1>
                    <p class="subheader">Space to pause/start. r to restart.</p>
                    <form
                        class="form"
                        onSubmit={(event: Event) => {
                            event.preventDefault()
                            this.spacebar()
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
            )
        }

        const status = this.speechStatus()
        const totalTime = this.state.totalTime * 60

        if (corner) {
            corner.style.display = "none"
        }

        if (bar) {
            bar.style.width = `${(this.state.time / (this.state.totalTime * 60)) * 100}%`
            bar.style.display = "block"
        }

        if (barContainer) {
            if (this.state.time >= totalTime) {
                barContainer.classList.add("red")
            } else {
                barContainer.classList.remove("red")
            }
        }

        return (
            <div class="container">
                {this.state.time <= totalTime + 15 ? (
                    <p class="time">{formatTime(this.state.time)}</p>
                ) : (
                    <p class="time text-red">Time&apos;s Up!</p>
                )}
                <p class="status">{this.state.paused ? "Paused" : ""}</p>
                {status ? status : null}
            </div>
        )
    }
}

const root = document.getElementById("root")

if (root) {
    const timer = new Timer(root)

    timer.mount()
} else {
    alert("Could not load timer. Something went wrong: #root not found x_x.")
}
