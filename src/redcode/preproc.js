export default function preprocess(str) {
    // Capture Groups
    // [1] Label
    // [2] Macro

    // const rx_macro = make_regexp(String.raw`
    //     [ \x20 \t \r \f \v ]*
    //     (
    //         [a-z _] \w*
    //     )
    //     [ \x20 \t \r \f \v ]*
    //     :?
    //     [ \x20 \t \r \f \v ]*
    //     EQU \x20
    //     (
    //         [^\n]*
    //     )
    // `, 'ig')

    const rx_macro = new RegExp(String.raw`[\x20\t\r\f\v]*([a-z_]\w*)[\x20\t\r\f\v]*:?[\x20\t\r\f\v]*EQU\x20([^\n]*)`, 'ig')

    let match, index = 0, input = ''
    const macros = new Map()
    while ((match = rx_macro.exec(str))) {
        macros.set(match[1], match[2])
        input += str.slice(index, match.index)
        index = match.index + match[0].length
    }
    input += str.slice(index)

    return [input, macros]
}
