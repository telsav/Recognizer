# -*- coding:utf-8 -*-
# import the necessary packages
from __future__ import print_function
from imutils.video import WebcamVideoStream
from imutils.video import FPS
import argparse
import imutils
import cv2

from train import Model
from image_show import show_image


#Id=raw_input('enter your id: ')
#sampleNum=0

# https://realpython.com/blog/python/face-detection-in-python-using-a-webcam/
if __name__ == '__main__':
    cap = cv2.VideoCapture()

    cv2.namedWindow("preview")

    cap.open('rtmp://123.207.24.118/live/mystream')

    #cap.open('http//123.207.24.118/live/mystream?.mjpeg')

    cascade_path = "C:\Program Files\Anaconda3\Library\etc\haarcascades\haarcascade_frontalface_default.xml"
    model = Model()

    model.load()
    while True:
        _, frame = cap.read()

        #Test
        # Display the resulting frame

        # 灰度变换
        frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # 获取级联分类的特征量
        cascade = cv2.CascadeClassifier(cascade_path)

        # 物体识别的执行（面部识别）
        facerect = cascade.detectMultiScale(frame_gray, scaleFactor=1.2, minNeighbors=3, minSize=(10, 10))

        # Draw a rectangle around the faces
        for (x, y, w, h) in facerect:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

            cv2.putText(frame, "Press ESC to close.", (5, 25),cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255,255,255))
            #incrementing sample number 
            #sampleNum=sampleNum+1
            #saving the captured face in the dataset folder
            #cv2.imwrite("dataSet/user."+Id+'.'+str(sampleNum)+".jpg",gray[y:y+h,x:x+w])

            cv2.imshow("preview", frame)

        #facerect = cascade.detectMultiScale(frame_gray, scaleFactor=1.01, minNeighbors=3, minSize=(3, 3))
        if len(facerect) > 0:
            print('face detected')
            color = (255, 255, 255)  # 白
            for rect in facerect:
                # 创建围绕检测的面部的矩形
                #cv2.rectangle(frame, tuple(rect[0:2]), tuple(rect[0:2] + rect[2:4]), color, thickness=2)

                x, y = rect[0:2]
                width, height = rect[2:4]
                image = frame[y - 10: y + height, x: x + width]

                result = model.predict(image)
                if result == 0:  # boss
                    print('Boss is approaching')
                    #show_image()
                else:
                    print('Not boss')

        #10msec键输入等待
        k = cv2.waitKey(100)
        #Esc退出按下该键
        if k == 27:
            break

    #退出拍摄
    cap.release()
    cv2.destroyAllWindows()

