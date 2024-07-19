# lemmatize.py
import sys
import spacy

def lemmatize(word):
    nlp = spacy.load('fr_core_news_sm')  # Assurez-vous d'avoir le bon modèle
    doc = nlp(word)
    return doc[0].lemma_  # Retourne le lemme du premier token

if __name__ == '__main__':
    word = sys.argv[1]
    lemma = lemmatize(word)
    print(lemma)  # Utilisez print pour retourner le résultat à Node.js
