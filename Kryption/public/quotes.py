import json

quotes_txt = open("quotes.txt", "r", encoding="utf-8")

def quote_length_sorter():
    quotes = [line.replace("\n", "").replace("  ", " ").replace("  ", " ") for line in quotes_txt.readlines()]
    quote_lengths = quote_length_calculator(quotes)

    quotes_dict = {}

    for q in range(len(quotes)):
        quote = quotes[q]
        quote_length = quote_lengths[q]

        if quote_length in quotes_dict.keys():
            quotes_dict[quote_length] = list(quotes_dict[quote_length]) + [quote]
        else:
            quotes_dict[quote_length] = [quote]

    quotes_json_obj = json.dumps(quotes_dict)
    quotes_json = open("quotes.json", "w", encoding="utf-8")
    quotes_json.write(quotes_json_obj)
    quotes_json.close()

def quote_length_calculator(quotes):
    quotes_nodash = [quote.replace("-", " ").replace("  ", " ").replace("  ", " ").split(" ") for quote in quotes]

    quote_lengths = [len(quote) for quote in quotes_nodash]

    print(min(quote_lengths), max(quote_lengths))

    return quote_lengths

quote_length_sorter()