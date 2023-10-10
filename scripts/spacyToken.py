import spacy
import sys
import json

def tokenize_french_text(text):
    # Chargement du modèle de langue français
    nlp = spacy.load('fr_dep_news_trf')
    
    doc = nlp(text)

    tokens_info = []
    for token in doc:
        token_info = {
            "text": token.text_with_ws,
            "is_punctuation": token.is_punct 
        }
        tokens_info.append(token_info)

    return tokens_info

text = sys.argv[1]
tokens_info = tokenize_french_text(text)
print(json.dumps(tokens_info))
