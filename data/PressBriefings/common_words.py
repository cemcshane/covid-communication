import nltk 
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import re 
from collections import Counter
import glob
import os
import os.path
import sys
import csv 

directory = sys.argv[1]

def count(file_name):
    data = []
    function_words = []
    with open(file_name, "r", encoding='ascii', errors='ignore') as f:
        data = f.read()
    words = re.findall(r'\w+', data)
    for word in words: 
        if word not in stopwords.words('english'):
            function_words.append(word)
    normalize_words = [word.upper() for word in function_words] 
    word_counts = Counter(normalize_words)
    print(type(word_counts))
    return word_counts


def write_counts():
    path = '/Users/emmabaker/Documents/Github/Class/457/Assignments/covid-communication/data/PressBriefings'
    files = glob.glob(os.path.join("*.txt"))
    for filename in files:
        print(filename)
        counts = count(filename)
        with open("COUNTS_"+filename+".csv", 'w') as csv_file:  
            writer = csv.writer(csv_file)
            writer.writerow(['Word', 'Frequency'])  
            for key, value in counts.items():
                writer.writerow([key, value])
    return filename
write_counts()
