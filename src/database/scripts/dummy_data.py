from faker import Faker
import pandas as pd
import numpy as np
import psycopg2

fake = Faker()


# conference data generation 

conferenceName = []
conferenceLocation = []
submissionDeadline = []
biddingDeadline = []
reviewDeadline = []
announcementTime = []



conferenceName.append(fake.word())
conferenceLocation.append(fake.city())
submissionDeadline.append(fake.date_time_between_dates('-1y', 'now'))
biddingDeadline.append(fake.date_time_between_dates('-1y', 'now'))
reviewDeadline.append(fake.date_time_between_dates('-1y', 'now'))
announcementTime.append(fake.date_time_between_dates('-1y', 'now'))



#account data generation

email = []
username = []
hashedpassword = []
salt = []
accountType = []
accountstatus = []
conferenceid = []


while len(email) < 100:
    fakeEmail = fake.email()
    if fakeEmail not in email:
        email.append(fakeEmail)

for i in range(100):
    username.append(fake.name())

for i in range(100):
    hashedpassword.append(fake.word())

for i in range(100):
    salt.append(fake.word())

accountType.append('ADMIN')

for i in range(9):
    accountType.append(fake.word(ext_word_list=['CHAIR']))

for i in range(90):
    accountType.append(fake.word(ext_word_list=['AUTHOR', 'REVIEWER']))


for i in range(11):
    accountstatus.append('ACCEPTED')


for i in range(100):
    accountstatus.append(fake.word(ext_word_list=['PENDING','ACCEPTED','REJECTED']))

for i in range(100):

    conferenceid.append(1)



#chair data generation

chairAccountId = []

for i in range(2, 10):

    chairAccountId.append(i)





authorAccountId = []

for i in range (accountType.count('AUTHOR')):

    authorAccountId.append(fake.random_int(min = 11, max = 100))

#reviewer data generation
bidPoints = []
paperWorkLoad = []
reviewerAccountId = []


while len(reviewerAccountId) < (accountType.count('REVIEWER')):
    reviewerId = fake.random_int(min = 11, max = 100)
    if reviewerId not in reviewerAccountId:
        reviewerAccountId.append(reviewerId)

for i in range(accountType.count('REVIEWER')):
    bidPoints.append(fake.random_int(min = 50, max = 100))

for i in range(accountType.count('REVIEWER')):
    paperWorkLoad.append(fake.random_int(min = 1, max = 5))

#paper data generation


title = []
paperStatus = []
submittedTime = []
fileLocation = []
authorId = []
coauthors = []

for i in range(100):
    title.append(fake.text(max_nb_chars=20))

for i in range(100):
    paperStatus.append(fake.word(ext_word_list=['ACCEPTED','REJECTED']))

for i in range(100):
    submittedTime.append(fake.date_time_between_dates('-1y', 'now'))

for i in range(100):
    
    fileLocation.append(fake.file_path(depth=3, extension = 'pdf'))



while len(authorId) < 100:
    
    authorId.append(fake.random_int(min = 1, max = len(authorAccountId)))


for i in range(100):
    coauthors.append(fake.name())

#comment data generation

comment = []
commentPaperId = []
commentReviewerId = []

for i in range(200):
    comment.append(fake.paragraph(nb_sentences=3))

for i in range (200):
    commentPaperId.append(fake.random_int(min = 1, max = 99))


while len(commentReviewerId) < 200:
    
    commentReviewerId.append(fake.random_int(min = 1, max = len(reviewerAccountId)))

#bids data generation

bidAmount = []
bidsReviewerId = []
bidsPaperid = []

for i in range(100):
    bidAmount.append(fake.random_int(min = 0, max = 5))

while len(bidsReviewerId) < 100:
    
    bidsReviewerId.append(fake.random_int(min = 1, max = len(reviewerAccountId)))

for i in range (100):
    bidsPaperid.append(fake.random_int(min = 1, max = 100))



#review data generation


review = []
paperRating = []
reviewRating = []
reviewPaperId = []
reviewReviewerId = []

for i in range(100):
    review.append(fake.paragraph(nb_sentences=3))

for i in range (100):
    paperRating.append(fake.random_int(min = 1, max = 10))

for i in range (100):
    reviewRating.append(fake.random_int(min = 1, max = 10))

for i in range (100):
    reviewPaperId.append(fake.random_int(min = 0, max = 99))

while len(reviewReviewerId) < 100:
    
    reviewReviewerId.append(fake.random_int(min = 1, max = len(reviewerAccountId)))







connection = psycopg2.connect(user="USERNAME",
                                  password="PASSWORD",
                                  host="HOST",
                                  port="5432",
                                  database="DATEBASE")

postgres_insert_query = """INSERT INTO conference(conferencename, conferencelocation, submissionDeadline, biddingDeadline, reviewDeadline, announcementTime)
VALUES (%s, %s, %s, %s, %s, %s)"""

cursor = connection.cursor()
record_to_insert = (conferenceName[0], conferenceLocation[0], submissionDeadline[0], biddingDeadline[0], reviewDeadline[0], announcementTime[0])
cursor.execute(postgres_insert_query, record_to_insert)
connection.commit()


postgres_insert_query = """INSERT INTO account(email, username, hashedPassword, salt, accounttype, accountstatus, conferenceid)
VALUES (%s, %s, %s, %s, %s, %s, %s)"""

for i in range(100):
    record_to_insert = (email[i], username[i], hashedpassword[i], salt[i], accountType[i], accountstatus[i], conferenceid[i])
    cursor.execute(postgres_insert_query, record_to_insert)
    connection.commit()

postgres_insert_query = """INSERT INTO chair(accountid)
VALUES (%s)"""

for i in range(len(chairAccountId)):
    cursor.execute(postgres_insert_query, (chairAccountId[i],))
    connection.commit()

postgres_insert_query = """INSERT INTO author(accountid)
VALUES (%s)"""

for i in range(len(authorAccountId)):
    cursor.execute(postgres_insert_query, (authorAccountId[i],))
    connection.commit()

postgres_insert_query = """INSERT INTO reviewer(bidpoints, paperworkload, accountid)
VALUES (%s, %s, %s)"""

for i in range(len(reviewerAccountId)):
    record_to_insert = (bidPoints[i], paperWorkLoad[i], reviewerAccountId[i],)
    cursor.execute(postgres_insert_query, record_to_insert)
    connection.commit()

postgres_insert_query = """INSERT INTO paper(title, filelocation, paperstatus, authorid, coauthors)
VALUES (%s, %s, %s, %s, %s)"""



for i in range(100):
    record_to_insert = (title[i], fileLocation[i], paperStatus[i], authorId[i], coauthors[i])
    cursor.execute(postgres_insert_query, record_to_insert)
    connection.commit()


postgres_insert_query = """INSERT INTO comment(comment, reviewerid, paperid)
VALUES (%s, %s, %s)"""



for i in range(200):
    record_to_insert = (comment[i], commentReviewerId[i], commentPaperId[i])
    cursor.execute(postgres_insert_query, record_to_insert)
    connection.commit()

postgres_insert_query = """INSERT INTO bids(bidamount, reviewerid, paperid)
VALUES (%s, %s, %s)"""



for i in range(100):
    record_to_insert = (bidAmount[i], bidsReviewerId[i], bidsPaperid[i])
    cursor.execute(postgres_insert_query, record_to_insert)
    connection.commit()


postgres_insert_query = """INSERT INTO review(review, paperrating, reviewrating, reviewerid, paperid)
VALUES (%s, %s, %s, %s, %s)"""



for i in range(100):
    record_to_insert = (review[i], paperRating[i], reviewRating[i], reviewReviewerId[i], reviewPaperId[i],)
    cursor.execute(postgres_insert_query, record_to_insert)
    connection.commit()

