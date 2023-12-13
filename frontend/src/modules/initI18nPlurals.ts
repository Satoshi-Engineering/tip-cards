export function russianPluralRules(choice: number, choiceLength: number) {
    const name = new Intl.PluralRules('ru').select(choice)
    // https://www.unicode.org/cldr/charts/43/supplemental/language_plural_rules.html#ru
    const index = {
        one:   0, // 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … (из 1 книги за 1 день)
        few:   1, // 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … (из 2 книг за 2 дня)
        many:  2, // 0, 5~19, 100, 1000, 10000, 100000, 1000000, … (из 5 книг за 5 дней)
        other: 2, // 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, … (из 1,5 книги за 1,5 дня)

        zero:  2, // should not be returned - just for type of typescript
        two:   2, // should not be returned - just for type of typescript

    }[name]
    return index >= choiceLength ? choiceLength - 1 : index
}

export function czechPluralRules(choice: number, choiceLength: number) {
    const name = new Intl.PluralRules('cs').select(choice)
    // https://www.unicode.org/cldr/charts/43/supplemental/language_plural_rules.html#cs
    const index = {
        one:   0, // 1   (1 den)
        few:   1, // 2~4 (2 dny)
        many:  2, // 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, … (1,5 dne)
        other: 2, // 0, 5~19, 100, 1000, 10000, 100000, 1000000, … (5 dní)

        zero:  2, // should not be returned - just for type of typescript
        two:   2, // should not be returned - just for type of typescript

    }[name]
    return index >= choiceLength ? choiceLength - 1 : index
}
