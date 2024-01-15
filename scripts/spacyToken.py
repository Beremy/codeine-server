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
            "is_punctuation": token.is_punct,
            "position": token.i
        }
        tokens_info.append(token_info)

    # Calcul de la longueur du texte en nombre de tokens
    text_length = len(doc)

    return tokens_info, text_length

text = sys.argv[1]
tokens_info, text_length = tokenize_french_text(text)

# Création d'un dictionnaire pour la sortie
output = {
    "tokens": tokens_info,
    "length": text_length
}

print(json.dumps(output))
