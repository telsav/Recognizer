# -*- coding:utf-8 -*-
import cv2

from train import Model
from image_show import show_image

# https://realpython.com/blog/python/face-detection-in-python-using-a-webcam/
if __name__ == '__main__':
    cap = cv2.VideoCapture(0)
    cascade_path = "C:\Program Files\Anaconda3\Library\etc\haarcascades\haarcascade_frontalface_default.xml"
    model = Model()

    model.load()
    while True:
        _, frame = cap.read()

        # 灰度变换
        frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # 获取级联分类的特征量
        cascade = cv2.CascadeClassifier(cascade_path)

        # 物体识别的执行（面部识别）
        facerect = cascade.detectMultiScale(frame_gray, scaleFactor=1.2, minNeighbors=3, minSize=(10, 10))
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
                    show_image()
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

