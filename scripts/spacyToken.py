import spacy
import sys
import json

def tokenize_french_text(text):
    # Chargement du modèle de langue français
    nlp = spacy.load('fr_dep_news_trf')
    
    # Traitement du texte
    doc = nlp(text)

    # Affichage des tokens
    tokens = [token.text for token in doc]
    return tokens

text = sys.argv[1]
tokens = tokenize_french_text(text)
print(json.dumps(tokens))
