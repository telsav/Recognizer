# Recognizer

-----------------

| **`Linux CPU`** | **`Linux GPU`** | **`Mac OS CPU`** | **`Windows CPU`** | **`Android`** |
|-----------------|---------------------|------------------|-------------------|---------------|

## First of all, install python3.5 if you have mutil-version [python](https://www.python.org/downloads/release/python-350/)

## Second, upgrade pip 

```
$ python -m pip install --upgrade pip
```

and install tensorflow via pip

```
$ pip3 install --upgrade tensorflow
```

## more information please read this [tensorflow](https://github.com/tensorflow/tensorflow)


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

## Contributing

Please read before starting work on a pull request: https://github.com/WangCharlie/Recognizer/wiki/How_to_contribute

Summary of guidelines:

* One pull request per issue;
* Choose the right base branch;
* Include tests and documentation;
* Clean up "oops" commits before submitting;
* Follow the coding style guide.

## Refenerce
http://www.learnopencv.com/install-opencv3-on-windows/
