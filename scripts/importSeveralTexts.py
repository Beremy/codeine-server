import spacy
from spacy.language import Language
import sys
import json

@Language.component("custom_sentencizer")
def custom_sentencizer(doc):
    punct_chars = ['!', '.', '?']
    for token in doc:
        token.is_sent_start = False
    for i, token in enumerate(doc[:-1]):
        if token.text in punct_chars:
            doc[i + 1].is_sent_start = True
    doc[0].is_sent_start = True
    return doc

def process_text(text, nlp):
    doc = nlp(text)
    tokens_info = []
    sentences_info = []
    sentence_position = 1

    for sentence in doc.sents:
        sentences_info.append({
            "content": sentence.text.strip(),
            "position": sentence_position
        })

        for token in sentence:
            tokens_info.append({
                "text": token.text_with_ws,
                "is_punctuation": token.is_punct,
                "sentence_position": sentence_position,
                "position": token.i,
            })

        sentence_position += 1

    return {
        "tokens": tokens_info,
        "sentences": sentences_info
    }

def main():
    input_file = sys.argv[1] if len(sys.argv) > 1 else None
    if not input_file:
        print(json.dumps({"error": "Input JSON file is required"}))
        return

    try:
        with open(input_file, "r") as file:
            texts = json.load(file)
    except Exception as e:
        print(json.dumps({"error": f"Failed to read input file: {str(e)}"}))
        return

    nlp = spacy.load("fr_core_news_md")
    nlp.add_pipe("custom_sentencizer", before="parser")
    results = []

    for text_data in texts:
        result = process_text(text_data["content"], nlp)
        results.append({
            "num": text_data["num"],
            "origin": text_data["origin"],
            "result": result
        })

    print(json.dumps(results))

if __name__ == "__main__":
    main()
