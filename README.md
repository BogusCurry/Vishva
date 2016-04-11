# Vishva 

Vishva - A hindi word for "World"

A simple live scene editor for [BabylonJS](http://www.babylonjs.com/) a 3D HTML Webgl framework.

Developed in Java using [JSweet](http://www.jsweet.org/), a java to javscript transpiler

## to run

* download project

* cd to "webapp" folder. Open "index.html" in browser. If you are using firefox browser then you can open it directly from disk. For others you will have to serve the file via. some http server due to cross origin requests restrictions. See [here for some helpful information](https://github.com/mrdoob/three.js/wiki/How-to-run-things-locally)

* move your avatar using the "w a s d" keys. To run press shift and "w". Right click and drag mouse to look around. 

## to build

* download project, if you haven't already done so.

* cd to the project root folder. This should have the maven "pom.xml" file.

* run command 

```
mvn generate-sources
(This will transpile the java source code files to javascript files and store them in "target/js" folder)
```

## demo
For a demo  see [http://ssatguru.appspot.com/babylonjs/Vishva/webapp/index.html](http://ssatguru.appspot.com/babylonjs/Vishva/webapp/index.html)

This is about 8.6 MB (or 3.4 MB GZIPed if your browser supports it) So give it a few seconds to download

Note:This is still work in progress.

## build using
* [BabylonJS](http://www.babylonjs.com/)
* [Java](https://www.oracle.com/java/index.html)
* [JSweet](http://www.jsweet.org/)
* [JQuery UI] (https://jqueryui.com/)
* [FlexiColorPicker](https://github.com/DavidDurman/FlexiColorPicker)
