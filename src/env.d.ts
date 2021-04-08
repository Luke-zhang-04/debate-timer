/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.7.0
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

declare namespace NodeJS {
    interface ProcessEnv {
        AUTHTOKEN: string // Authentication Token
        APIKEY: string // Google sheets API key
    }
}
