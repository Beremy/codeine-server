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

# Exemple d'utilisation
text = sys.argv[1]  # récupérer le texte depuis l'argument de la ligne de commande
tokens = tokenize_french_text(text)
print(json.dumps(tokens))
