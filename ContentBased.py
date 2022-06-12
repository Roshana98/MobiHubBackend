import random
import pandas as pd  
import numpy as np  
from bson import ObjectId 
from pymongo import MongoClient 
import sys 
from sklearn.feature_extraction.text import TfidfVectorizer 
from sklearn.metrics.pairwise import sigmoid_kernel 

AllPhones=[]
selectedPhones=[]

client = MongoClient("mongodb+srv://mobihub:mobihub@cluster0.e4sf0.mongodb.net/test?retryWrites=true&w=majority")
mydb = client.get_database('MobiHub')

mobiles = pd.read_csv("phone_details.csv")  # reading the dataSet
mobiles_df = mobiles.drop(["brand","phone_price"], axis=1)

mobiles_df.head(1)['phone_name']

tfv = TfidfVectorizer(min_df=3, max_features=None,
                      strip_accents='unicode', analyzer='word', token_pattern=r'\w{1,}',
                      ngram_range=(1, 3),  # take the combination of 1 to 3 different kind of words
                      stop_words='english')  # remove all the unnecessary characters

mobiles_df['phone_name'] = mobiles_df['phone_name'].fillna('')  

tfv_matrix = tfv.fit_transform(mobiles_df['phone_name']) 


sigmoid = sigmoid_kernel(tfv_matrix,tfv_matrix) 
indexes = pd.Series(mobiles_df.index, index=mobiles_df['phone_name'])


def getRandomPhones(brand, sigmoid=sigmoid):
    ind = indexes[brand]
    sigmoid_scores = list(enumerate(sigmoid[ind]))
    sigmoid_scores = sorted(sigmoid_scores, key=lambda x: x[1], reverse=True)
    sigmoid_scores = sigmoid_scores[1:11]
    mobile_indexes = [i[0] for i in sigmoid_scores]

    for i in range(len(mobile_indexes)):
        AllPhones.append(mobiles_df['phone_name'].iloc[mobile_indexes[i]])
    return AllPhones

records = mydb.customers


for doc in records.find( { "_id": ObjectId(sys.argv[1])}):
    name = doc['searchedItems']

    for x in range(len(doc['searchedItems'])):
        name = doc['searchedItems'][x]

        AllPhones = getRandomPhones(name)

for x in range(10):
    random_item_from_list = random.choice(AllPhones)
    AllPhones = list(filter((random_item_from_list).__ne__, AllPhones))
    selectedPhones.append(random_item_from_list)
    
print(selectedPhones)

