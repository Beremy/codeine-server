import spacy
import sys
import json

def tokenize_french_text(text):
    # Chargement du modèle de langue français
    nlp = spacy.load('fr_dep_news_trf')
    
    # Traitement du texte
    doc = nlp(text)

    # Créer une liste de dictionnaires pour stocker les informations des tokens
    tokens_info = []
    
    # Parcourir les tokens
    for token in doc:
        token_info = {
            "text": token.text,
            "is_punctuation": token.is_punct  # Vérifie si le token est une ponctuation
        }
        tokens_info.append(token_info)

    return tokens_info

text = sys.argv[1]
tokens_info = tokenize_french_text(text)
print(json.dumps(tokens_info))
