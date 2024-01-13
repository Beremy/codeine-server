import spacy
import sys
import json

def tokenize_text_with_sentences(text):
    nlp = spacy.load('fr_dep_news_trf')
    doc = nlp(text)

    tokens_info = []
    sentences_info = []
    sentence_position = 1

    for sentence in doc.sents:
        sentences_info.append({
            "content": sentence.text,
            "position": sentence_position
        })
        token_position = 1
        for token in sentence:
            token_info = {
                "text": token.text_with_ws,
                "is_punctuation": token.is_punct,
                "sentence_position": sentence_position,
                "position": token_position
            }
            tokens_info.append(token_info)
            token_position += 1
        sentence_position += 1

    return {
        "tokens": tokens_info,
        "sentences": sentences_info
    }

text = sys.argv[1] if len(sys.argv) > 1 else ""
result = tokenize_text_with_sentences(text)
print(json.dumps(result))
