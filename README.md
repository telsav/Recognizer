# Face Recognition Authentication

-----------------

| **`Linux CPU`** | **`Linux GPU`** | **`Mac OS CPU`** | **`Windows CPU`** | **`Android`** |
|-----------------|---------------------|------------------|-------------------|---------------|
| [![Build Status](https://ci.tensorflow.org/buildStatus/icon?job=tensorflow-master-cpu)](https://github.com/WangCharlie/Recognizer) | [![Build Status](https://ci.tensorflow.org/buildStatus/icon?job=tensorflow-master-linux-gpu)](https://github.com/WangCharlie/Recognizer) | [![Build Status](https://ci.tensorflow.org/buildStatus/icon?job=tensorflow-master-mac)](https://github.com/WangCharlie/Recognizer) | [![Build Status](https://ci.tensorflow.org/buildStatus/icon?job=tensorflow-master-win-cmake-py)](https://github.com/WangCharlie/Recognizer) | [![Build Status](https://ci.tensorflow.org/buildStatus/icon?job=tensorflow-master-android)](https://github.com/WangCharlie/Recognizer) |

## First of all, install python3.5 if you have mutil-version [python](https://www.python.org/downloads/release/python-350/)

## Second, upgrade pip 

```
$ python -m pip install --upgrade pip
```

and install tensorflow via pip

```
$ pip3 install --upgrade tensorflow
```

## if encountered error pls do the following steps and solved problems
* 1. conda uninstall -c conda-forge opencv3
* 2. conda install python=3.5
* 3. conda install -c conda-forge opencv
* 4. conda install -c pyqt

## if encountered this error 
RuntimeError: module compiled against API version 0xb but this version of numpy is 0xa

```
pip install numpy --upgrade
```
## Installation commands:

There is a CPU and a GPU version, you can install either or both if you wish so. The commands are as follows:

CPU:
```
pip install --upgrade
  https://storage.googleapis.com/tensorflow/windows/cpu/tensorflow-0.12.0rc0-cp35-cp35m-win_amd64.whl
```
GPU:
```
pip install --upgrade
  https://storage.googleapis.com/tensorflow/windows/gpu/tensorflow_gpu-0.12.0rc0-cp35-cp35m-win_amd64.whl
```

## Contributing

Please read before starting work on a pull request: https://github.com/WangCharlie/Recognizer/wiki/How_to_contribute

Summary of guidelines:

* One pull request per issue;
* Choose the right base branch;
* Include tests and documentation;
* Clean up "oops" commits before submitting;
* Follow the coding style guide.

## Resources
 1. http://www.learnopencv.com/install-opencv3-on-windows/
 2. https://github.com/opencv/opencv
 3. https://www.tensorflow.org/install/install_windows
 4. https://www.solarianprogrammer.com/2016/09/17/install-opencv-3-with-python-3-on-windows/
 5. more information please read this [tensorflow](https://github.com/tensorflow/tensorflow)
