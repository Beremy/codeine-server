import spacy
import sys

def process_text(text):
    # # Chargement du modèle de langue français
    nlp = spacy.load('fr_dep_news_trf')

    # Traitement du texte
    doc = nlp(text)

    # Séparation en phrases
    sentences = [sent.text for sent in doc.sents]

    # Séparation en tokens
    tokens = [token.text for token in doc]

    return sentences, tokens

text = sys.argv[1]  

sentences, tokens = process_text(text)

print("Phrases:")
print(sentences)
print("\nTokens:")
print(tokens)