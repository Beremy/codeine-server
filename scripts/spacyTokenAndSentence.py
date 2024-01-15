import spacy
from spacy.language import Language
import sys
import json

@Language.component("custom_sentencizer")
def custom_sentencizer(doc):
    punct_chars = ['!', '.', '?']  # Caractères de ponctuation personnalisés
    for token in doc:
        token.is_sent_start = False
    for i, token in enumerate(doc[:-1]):
        if token.text in punct_chars:
            doc[i + 1].is_sent_start = True
    doc[0].is_sent_start = True
    return doc

def tokenize_text_with_sentences(text):
    nlp = spacy.load('fr_dep_news_trf')
    nlp.add_pipe("custom_sentencizer", before="parser")

    doc = nlp(text)

    tokens_info = []
    sentences_info = []
    sentence_position = 1
    previous_sentence_end_with_newline = False

    for sentence in doc.sents:
        sentence_text = sentence.text.strip()
        if previous_sentence_end_with_newline:
            # Ajoute un saut de ligne à la fin de la phrase précédente
            sentences_info[-1]["content"] += "\n"

        if sentence_text and not sentence_text.isspace():
            sentences_info.append({
                "content": sentence_text,
                "position": sentence_position
            })
            previous_sentence_end_with_newline = sentence.text.endswith("\n")
        else:
            previous_sentence_end_with_newline = True

        token_position = 1
        for token in sentence:
            token_info = {
                "text": token.text_with_ws,
                "is_punctuation": token.is_punct,
                "sentence_position": sentence_position,
                "position": token.i
            }
            tokens_info.append(token_info)
            token_position += 1

        if sentence_text and not sentence_text.isspace():
            sentence_position += 1

    return {
        "tokens": tokens_info,
        "sentences": sentences_info
    }


text = sys.argv[1] if len(sys.argv) > 1 else ""
result = tokenize_text_with_sentences(text)
print(json.dumps(result))
