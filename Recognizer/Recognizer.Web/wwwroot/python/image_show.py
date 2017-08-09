
# -*- coding: utf-8 -*-
import sys

from PyQt5 import QtGui
from PyQt5.QtWidgets import *


def show_image(image_path='./data/other/dummy.jpg'):
    app = QApplication(sys.argv)
    pixmap = QtGui.QPixmap(image_path)
    screen = QLabel("");
    screen.setPixmap(pixmap)
    screen.showFullScreen()
    sys.exit(app.exec_())


if __name__ == '__main__':
    show_image()