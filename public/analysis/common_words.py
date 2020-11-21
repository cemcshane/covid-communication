from collections import Counter
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import glob
import os
import os.path
import sys
import csv 

directory = sys.argv[1]


def strip_stop_words(data):
    f = open("demofile.txt", "r")
    data = data.readlines()
    stop_words = set(stopwords.words('english'))
    tokeized_data = word_tokenize(data)
    function_words = []
    for word in tokeized_data:
        if word not in stop_words:
            function_words.append(word)

    return function_words

def output_most_common(directory):
    files = glob.glob(os.path.join(directory, "*.txt"))
    for file in files:
        file = strip_stop_words(file).split()

        # with open(file, 'w') as csv_file:  
        #     writer = csv.writer(csv_file)
        #     writer.writerow(['Word', 'Frequency'])  
        #     for key, value in hold_diffs.items():
        #         writer.writerow([key, value])

        # return file

        print(Counter=Counter.most_common(50))


output_most_common(directory)
