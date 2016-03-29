# Vishva 

Vishva - A hindi word for "World"

A small world created using [BabylonJS](http://www.babylonjs.com/) a 3D HTML Webgl framework and [JSweet](http://www.jsweet.org/)  a java to javscript transpiler

To build

1. download project

2. cd to the project root folder. This should have the maven "pom.xml" file.

3. run command 
```
mvn generate-sources
(This will transpile the java source code files to javascript files and store them in "target/js" folder)
```
To run

1. open "webapp/index.html" in browser. If you are using firefox browser then you can open it directly from disk. For others you will have to serve the file via. some http server. Other browsers do not allow cross origin requests.
2. move your avatar using the "w a s d" keys. To run press shift and "w". Right click and drag mouse to look around. Click the "Vincent" or "Joan" button to swtich between male , female avatar.

For demo see [http://ssatguru.appspot.com/babylonjs/Vishva/webapp/index.html](http://ssatguru.appspot.com/babylonjs/Vishva/webapp/index.html)

Note: The above demo is a newer much enhanced version, the source code for which hasn't been uploaded yet. I will be uploading it soon though.
