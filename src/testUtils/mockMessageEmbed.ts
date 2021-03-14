/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.6.1
 * @license BSD-3-Clause
 */

type Stringable = {
    toString: ()=> string,
}

interface EmbedFieldData {
    name: Stringable,
    value: Stringable,
    inline?: boolean,
}

export class MockMessageEmbed {

    private _content = ""

    public addField = (
        name: Stringable,
        value: Stringable,
        _?: boolean,
    ): this => {
        this._content += `\n${name.toString()}\n${value.toString()}`

        return this
    }

    public addFields = (
        ...fields: EmbedFieldData[] | EmbedFieldData[][]
    ): this => {
        for (const field of fields) {
            if (field instanceof Array) {
                this.addFields(field)
            } else {
                this.addField(
                    field.name.toString(),
                    field.value.toString(),
                    field.inline,
                )
            }
        }

        return this
    }

    public setAuthor = (
        name: Stringable,
        ..._: Stringable[]
    ): this => {
        this._content += `\n${name.toString()}`

        return this
    }

    public setColor = (..._: Stringable[]): this => this

    public setDescription = (desc: Stringable): this => {
        this._content += `\n${desc.toString()}`

        return this
    }

    public setFooter = (text: Stringable, ..._: Stringable[]): this => {
        this._content += `\n${text.toString()}`

        return this
    }

    public setImage = (_: string): this => this

    /* eslint-disable @typescript-eslint/member-ordering */
    public setThumbnail = this.setImage

    public setTimestamp = (_?: Date | number): this => this

    public setTitle = this.setDescription

    /* eslint-enable @typescript-eslint/member-ordering */

    public setURL = (_: string): this => this

    public toString = (): string => this._content

}

export default MockMessageEmbed
