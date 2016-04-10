"Generated from Java with JSweet 1.1.0-SNAPSHOT - http://www.jsweet.org";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var org;
(function (org) {
    var ssatguru;
    (function (ssatguru) {
        var babylonjs;
        (function (babylonjs) {
            var EditControl = org.ssatguru.babylonjs.component.EditControl;
            var ActionManager = BABYLON.ActionManager;
            var Animation = BABYLON.Animation;
            var ArcRotateCamera = BABYLON.ArcRotateCamera;
            var AssetsManager = BABYLON.AssetsManager;
            var Axis = BABYLON.Axis;
            var Color3 = BABYLON.Color3;
            var CubeTexture = BABYLON.CubeTexture;
            var DirectionalLight = BABYLON.DirectionalLight;
            var Engine = BABYLON.Engine;
            var ExecuteCodeAction = BABYLON.ExecuteCodeAction;
            var HemisphericLight = BABYLON.HemisphericLight;
            var Mesh = BABYLON.Mesh;
            var Quaternion = BABYLON.Quaternion;
            var Scene = BABYLON.Scene;
            var SceneLoader = BABYLON.SceneLoader;
            var SceneSerializer = BABYLON.SceneSerializer;
            var ShadowGenerator = BABYLON.ShadowGenerator;
            var Sound = BABYLON.Sound;
            var StandardMaterial = BABYLON.StandardMaterial;
            var Tags = BABYLON.Tags;
            var Texture = BABYLON.Texture;
            var Vector3 = BABYLON.Vector3;
            var WaterMaterial = BABYLON.WaterMaterial;
            /**
             * @author satguru
             */
            var Vishva = (function () {
                function Vishva(scenePath, sceneFile, canvasId, editEnabled, assets) {
                    var _this = this;
                    this.actuator = "none";
                    this.skyboxTextures = "vishva/internal/textures/skybox-default/default";
                    this.avatarFolder = "vishva/internal/avatar/";
                    this.avatarFile = "starterAvatars.babylon";
                    this.groundTexture = "vishva/internal/textures/ground.jpg";
                    this.primTexture = "vishva/internal/textures/Birch.jpg";
                    this.editAlreadyOpen = false;
                    /**
                     * use this to prevent users from switching to another mesh during edit.
                     */
                    this.switchDisabled = false;
                    this.avatarSpeed = 0.05;
                    this.prevAnim = null;
                    this.showBoundingBox = false;
                    this.cameraCollision = false;
                    this.focusOnAv = true;
                    this.cameraAnimating = false;
                    this.jumpCycleMax = 25;
                    this.jumpCycle = this.jumpCycleMax;
                    this.wasJumping = false;
                    this.isMeshSelected = false;
                    this.cameraTargetPos = new Vector3(0, 0, 0);
                    this.saveAVcameraPos = new Vector3(0, 0, 0);
                    this.animFunc = function () { return _this.animateCamera(); };
                    this.animFunc2 = function () { return _this.justReFocus(); };
                    if (!Engine.isSupported()) {
                        alert("not supported");
                        return;
                    }
                    this.editEnabled = editEnabled;
                    this.assets = assets;
                    this.key = new Key();
                    this.initAnims();
                    this.canvas = document.getElementById(canvasId);
                    this.engine = new Engine(this.canvas, true);
                    this.scene = new Scene(this.engine);
                    window.addEventListener("resize", function (event) { return _this.onWindowResize(event); });
                    window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); }, false);
                    window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); }, false);
                    this.scenePath = scenePath;
                    this.sceneFile = sceneFile;
                    this.engine.hideLoadingUI();
                    if (sceneFile == null) {
                        this.onSceneLoaded(this.scene);
                    }
                    else {
                        this.loadSceneFile(scenePath, sceneFile + ".js", this.scene);
                    }
                }
                Vishva.prototype.loadSceneFile = function (scenePath, sceneFile, scene) {
                    var _this = this;
                    var am = new AssetsManager(scene);
                    var task = am.addTextFileTask("sceneLoader", scenePath + sceneFile);
                    task.onSuccess = function (obj) { return _this.onTaskSuccess(obj); };
                    task.onError = function (obj) { return _this.onTaskFailure(obj); };
                    am.load();
                };
                Vishva.prototype.onTaskSuccess = function (obj) {
                    var _this = this;
                    var tfat = obj;
                    var foo = JSON.parse(tfat.text);
                    this.snas = foo["VishvaSNA"];
                    var sceneData = "data:" + tfat.text;
                    SceneLoader.ShowLoadingScreen = false;
                    SceneLoader.Append(this.scenePath, sceneData, this.scene, function (scene) { return _this.onSceneLoaded(scene); });
                };
                Vishva.prototype.onTaskFailure = function (obj) {
                    alert("scene load failed");
                };
                Vishva.prototype.initAnims = function () {
                    this.walk = new AnimData("walk", 7, 35, 1);
                    this.walkBack = new AnimData("walkBack", 39, 65, 0.5);
                    this.idle = new AnimData("idle", 203, 283, 1);
                    this.run = new AnimData("run", 69, 95, 1);
                    this.jump = new AnimData("jump", 101, 103, 0.5);
                    this.turnLeft = new AnimData("turnLeft", 107, 151, 0.5);
                    this.turnRight = new AnimData("turnRight", 155, 199, 0.5);
                    this.strafeLeft = new AnimData("strafeLeft", 0, 0, 1);
                    this.strafeRight = new AnimData("strafeRight", 0, 0, 1);
                    this.anims = [this.walk, this.walkBack, this.idle, this.run, this.jump, this.turnLeft, this.turnRight, this.strafeLeft, this.strafeRight];
                };
                Vishva.prototype.onWindowResize = function (event) {
                    this.engine.resize();
                };
                Vishva.prototype.onKeyDown = function (e) {
                    var event = e;
                    if (event.keyCode == 16)
                        this.key.shift = true;
                    if (event.keyCode == 17)
                        this.key.ctl = true;
                    if (event.keyCode == 32)
                        this.key.jump = false;
                    if (event.keyCode == 27)
                        this.key.esc = false;
                    var chr = String.fromCharCode(event.keyCode);
                    if ((chr == "W") || (event.keyCode == 38))
                        this.key.up = true;
                    if ((chr == "A") || (event.keyCode == 37))
                        this.key.left = true;
                    if ((chr == "D") || (event.keyCode == 39))
                        this.key.right = true;
                    if ((chr == "S") || (event.keyCode == 40))
                        this.key.down = true;
                    if (chr == "Q")
                        this.key.stepLeft = true;
                    if (chr == "E")
                        this.key.stepRight = true;
                    if (chr == "1")
                        this.key.trans = false;
                    if (chr == "2")
                        this.key.rot = false;
                    if (chr == "3")
                        this.key.scale = false;
                    if (chr == "F")
                        this.key.focus = false;
                };
                Vishva.prototype.onKeyUp = function (e) {
                    var event = e;
                    if (event.keyCode == 16)
                        this.key.shift = false;
                    if (event.keyCode == 17)
                        this.key.ctl = false;
                    if (event.keyCode == 32)
                        this.key.jump = true;
                    if (event.keyCode == 27)
                        this.key.esc = true;
                    var chr = String.fromCharCode(event.keyCode);
                    if ((chr == "W") || (event.keyCode == 38))
                        this.key.up = false;
                    if ((chr == "A") || (event.keyCode == 37))
                        this.key.left = false;
                    if ((chr == "D") || (event.keyCode == 39))
                        this.key.right = false;
                    if ((chr == "S") || (event.keyCode == 40))
                        this.key.down = false;
                    if (chr == "Q")
                        this.key.stepLeft = false;
                    if (chr == "E")
                        this.key.stepRight = false;
                    if (chr == "1")
                        this.key.trans = true;
                    if (chr == "2")
                        this.key.rot = true;
                    if (chr == "3")
                        this.key.scale = true;
                    if (chr == "F")
                        this.key.focus = true;
                };
                Vishva.prototype.createPrimMaterial = function () {
                    this.primMaterial = new StandardMaterial("primMat", this.scene);
                    this.primMaterial.diffuseTexture = new Texture(this.primTexture, this.scene);
                    this.primMaterial.diffuseColor = new Color3(1, 1, 1);
                    this.primMaterial.specularColor = new Color3(0, 0, 0);
                };
                Vishva.prototype.setPrimProperties = function (mesh) {
                    if (this.primMaterial == null)
                        this.createPrimMaterial();
                    var r = mesh.getBoundingInfo().boundingSphere.radiusWorld;
                    var placementLocal = new Vector3(0, r, -(r + 2));
                    var placementGlobal = Vector3.TransformCoordinates(placementLocal, this.avatar.getWorldMatrix());
                    mesh.position.addInPlace(placementGlobal);
                    mesh.material = this.primMaterial;
                    mesh.checkCollisions = true;
                    (this.shadowGenerator.getShadowMap().renderList).push(mesh);
                    mesh.receiveShadows = true;
                    Tags.AddTagsTo(mesh, "Vishva.prim Vishva.internal");
                    mesh.id = (new Number(Date.now())).toString();
                    mesh.name = mesh.id;
                };
                Vishva.prototype.addPrim = function (primType) {
                    if (primType == "plane")
                        this.addPlane();
                    else if (primType == "box")
                        this.addBox();
                    else if (primType == "sphere")
                        this.addSphere();
                    else if (primType == "disc")
                        this.addDisc();
                    else if (primType == "cylinder")
                        this.addCylinder();
                    else if (primType == "cone")
                        this.addCone();
                    else if (primType == "torus")
                        this.addTorus();
                };
                Vishva.prototype.addPlane = function () {
                    var mesh = Mesh.CreatePlane("", 1.0, this.scene);
                    this.setPrimProperties(mesh);
                };
                Vishva.prototype.addBox = function () {
                    var mesh = Mesh.CreateBox("", 1, this.scene);
                    this.setPrimProperties(mesh);
                };
                Vishva.prototype.addSphere = function () {
                    var mesh = Mesh.CreateSphere("", 10, 1, this.scene);
                    this.setPrimProperties(mesh);
                };
                Vishva.prototype.addDisc = function () {
                    var mesh = Mesh.CreateDisc("", 0.5, 20, this.scene);
                    this.setPrimProperties(mesh);
                };
                Vishva.prototype.addCylinder = function () {
                    var mesh = Mesh.CreateCylinder("", 1, 1, 1, 20, 1, this.scene);
                    this.setPrimProperties(mesh);
                };
                Vishva.prototype.addCone = function () {
                    var mesh = Mesh.CreateCylinder("", 1, 0, 1, 20, 1, this.scene);
                    this.setPrimProperties(mesh);
                };
                Vishva.prototype.addTorus = function () {
                    var mesh = Mesh.CreateTorus("", 1, 0.25, 20, this.scene);
                    this.setPrimProperties(mesh);
                };
                Vishva.prototype.switchGround = function () {
                    if (!this.isMeshSelected) {
                        return "no mesh selected";
                    }
                    Tags.RemoveTagsFrom(this.ground, "Vishva.ground");
                    this.ground.isPickable = true;
                    this.ground = this.meshPicked;
                    this.ground.isPickable = false;
                    Tags.AddTagsTo(this.ground, "Vishva.ground");
                    this.removeEditControl();
                    return null;
                };
                Vishva.prototype.instance_mesh = function () {
                    if (!this.isMeshSelected) {
                        return "no mesh selected";
                    }
                    var name = (new Number(Date.now())).toString();
                    var inst = this.meshPicked.createInstance(name);
                    inst.position = this.meshPicked.position.add(new Vector3(0.1, 0.1, 0.1));
                    this.meshPicked = inst;
                    this.swicthEditControl(inst);
                    inst.receiveShadows = true;
                    (this.shadowGenerator.getShadowMap().renderList).push(inst);
                    return null;
                };
                Vishva.prototype.clone_mesh = function () {
                    if (!this.isMeshSelected) {
                        return "no mesh selected";
                    }
                    var name = (new Number(Date.now())).toString();
                    var clone = this.meshPicked.clone(name, null, true);
                    delete clone["sensors"];
                    delete clone["actuators"];
                    clone.position = this.meshPicked.position.add(new Vector3(0.1, 0.1, 0.1));
                    this.meshPicked = clone;
                    this.swicthEditControl(clone);
                    clone.receiveShadows = true;
                    (this.shadowGenerator.getShadowMap().renderList).push(clone);
                    return null;
                };
                Vishva.prototype.delete_mesh = function () {
                    if (!this.isMeshSelected) {
                        return "no mesh selected";
                    }
                    this.removeEditControl();
                    SNAManager.getSNAManager().removeSNAs(this.meshPicked);
                    this.meshPicked.dispose();
                    return null;
                };
                Vishva.prototype.setSpaceLocal = function (lcl) {
                    if (this.editControl != null)
                        this.editControl.setLocal(lcl);
                    return;
                };
                Vishva.prototype.isSpaceLocal = function () {
                    if (this.editControl != null)
                        return this.editControl.isLocal();
                    else
                        return true;
                };
                Vishva.prototype.undo = function () {
                    if (this.editControl != null)
                        this.editControl.undo();
                    return;
                };
                Vishva.prototype.redo = function () {
                    if (this.editControl != null)
                        this.editControl.redo();
                    return;
                };
                Vishva.prototype.getSoundFiles = function () {
                    return this.assets["sounds"];
                };
                Vishva.prototype.anyMeshSelected = function () {
                    return this.isMeshSelected;
                };
                Vishva.prototype.getLocation = function () {
                    return this.meshPicked.position;
                };
                Vishva.prototype.getRoation = function () {
                    var euler = this.meshPicked.rotationQuaternion.toEulerAngles();
                    var r = 180 / Math.PI;
                    var degrees = euler.multiplyByFloats(r, r, r);
                    return degrees;
                };
                Vishva.prototype.getScale = function () {
                    return this.meshPicked.scaling;
                };
                Vishva.prototype.getSkelName = function () {
                    if (this.meshPicked.skeleton == null)
                        return null;
                    else
                        return this.meshPicked.skeleton.name;
                };
                Vishva.prototype.getSkeleton = function () {
                    if (this.meshPicked.skeleton == null)
                        return null;
                    else
                        return this.meshPicked.skeleton;
                };
                Vishva.prototype.getAnimationRanges = function () {
                    var skel = this.meshPicked.skeleton;
                    var getAnimationRanges = skel["getAnimationRanges"];
                    var ranges = getAnimationRanges.call(skel);
                    return ranges;
                };
                Vishva.prototype.printAnimCount = function (skel) {
                    var bones = skel.bones;
                    for (var index122 = 0; index122 < bones.length; index122++) {
                        var bone = bones[index122];
                        {
                            console.log(bone.name + "," + bone.animations.length + " , " + bone.animations[0].getHighestFrame());
                            console.log(bone.animations[0]);
                        }
                    }
                };
                Vishva.prototype.playAnimation = function (animName, animRate, loop) {
                    var skel = this.meshPicked.skeleton;
                    if (skel == null)
                        return;
                    var r = parseFloat(animRate);
                    if (isNaN(r))
                        r = 1;
                    skel.beginAnimation(animName, loop, r);
                };
                Vishva.prototype.stopAnimation = function () {
                    if (this.meshPicked.skeleton == null)
                        return;
                    this.scene.stopAnimation(this.meshPicked.skeleton);
                };
                Vishva.prototype.getSensorList = function () {
                    return SNAManager.getSNAManager().getSensorList();
                };
                Vishva.prototype.getActuatorList = function () {
                    return SNAManager.getSNAManager().getActuatorList();
                };
                Vishva.prototype.getSensorParms = function (sensor) {
                    return SNAManager.getSNAManager().getSensorParms(sensor);
                };
                Vishva.prototype.getActuatorParms = function (actuator) {
                    return SNAManager.getSNAManager().getActuatorParms(actuator);
                };
                Vishva.prototype.getSensors = function () {
                    if (!this.isMeshSelected) {
                        return null;
                    }
                    var sens = this.meshPicked["sensors"];
                    if (sens == null)
                        sens = new Array();
                    return sens;
                };
                Vishva.prototype.getActuators = function () {
                    if (!this.isMeshSelected) {
                        return null;
                    }
                    var acts = this.meshPicked["actuators"];
                    if (acts == null)
                        acts = new Array();
                    return acts;
                };
                Vishva.prototype.addSensorbyName = function (sensName) {
                    if (!this.isMeshSelected) {
                        return null;
                    }
                    return SNAManager.getSNAManager().createSensorByName(sensName, this.meshPicked, null);
                };
                Vishva.prototype.addActuaorByName = function (actName) {
                    if (!this.isMeshSelected) {
                        return null;
                    }
                    return SNAManager.getSNAManager().createActuatorByName(actName, this.meshPicked, null);
                };
                Vishva.prototype.add_sensor = function (sensName, prop) {
                    if (!this.isMeshSelected) {
                        return "no mesh selected";
                    }
                    if (sensName == "Touch") {
                        var st = new SensorTouch(this.meshPicked, prop);
                    }
                    else
                        return "No such sensor";
                    return null;
                };
                Vishva.prototype.addActuator = function (actName, parms) {
                    if (!this.isMeshSelected) {
                        return "no mesh selected";
                    }
                    var act;
                    if (actName == "Rotator") {
                        act = new ActuatorRotator(this.meshPicked, parms);
                    }
                    else if (actName == "Mover") {
                        act = new ActuatorMover(this.meshPicked, parms);
                    }
                    else
                        return "No such actuator";
                    return null;
                };
                Vishva.prototype.removeSensor = function (index) {
                    if (!this.isMeshSelected) {
                        return "no mesh selected";
                    }
                    var sensors = this.meshPicked["sensors"];
                    if (sensors != null) {
                        var sens = sensors[index];
                        if (sens != null) {
                            sens.dispose();
                        }
                        else
                            return "no sensor found";
                    }
                    else
                        return "no sensor found";
                    return null;
                };
                Vishva.prototype.removeActuator = function (index) {
                    if (!this.isMeshSelected) {
                        return "no mesh selected";
                    }
                    var actuators = this.meshPicked["actuators"];
                    if (actuators != null) {
                        var act = actuators[index];
                        if (act != null) {
                            act.dispose();
                        }
                        else
                            return "no actuator found";
                    }
                    else
                        return "no actuator found";
                    return null;
                };
                Vishva.prototype.removeSensorActuator = function (sa) {
                    sa.dispose();
                };
                Vishva.prototype.setSunPos = function (d) {
                    var r = Math.PI * (180 - d) / 180;
                    var x = -Math.cos(r);
                    var y = -Math.sin(r);
                    this.sunDR.direction = new Vector3(x, y, 0);
                };
                Vishva.prototype.getSunPos = function () {
                    var sunDir = this.sunDR.direction;
                    var x = sunDir.x;
                    var y = sunDir.y;
                    var l = Math.sqrt(x * x + y * y);
                    var d = Math.acos(x / l);
                    return d * 180 / Math.PI;
                };
                Vishva.prototype.setLight = function (d) {
                    this.sun.intensity = d;
                    this.sunDR.intensity = d;
                };
                Vishva.prototype.getLight = function () {
                    return this.sun.intensity;
                };
                Vishva.prototype.setShade = function (dO) {
                    var d = dO;
                    d = 1 - d;
                    this.sun.groundColor = new Color3(d, d, d);
                };
                Vishva.prototype.getShade = function () {
                    return (1 - this.sun.groundColor.r);
                };
                Vishva.prototype.setFog = function (d) {
                    this.scene.fogDensity = d;
                };
                Vishva.prototype.getFog = function () {
                    return this.scene.fogDensity;
                };
                Vishva.prototype.setFov = function (dO) {
                    var d = dO;
                    this.mainCamera.fov = (d * 3.14 / 180);
                };
                Vishva.prototype.getFov = function () {
                    return this.mainCamera.fov * 180 / 3.14;
                };
                Vishva.prototype.setSky = function (sky) {
                    var mat = this.skybox.material;
                    mat.reflectionTexture.dispose();
                    var skyFile = "vishva/assets/skyboxes/" + sky + "/" + sky;
                    mat.reflectionTexture = new CubeTexture(skyFile, this.scene);
                    mat.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
                };
                Vishva.prototype.getSky = function () {
                    var mat = this.skybox.material;
                    var skyname = mat.reflectionTexture.name;
                    var i = skyname.lastIndexOf("/");
                    return skyname.substring(i + 1);
                };
                Vishva.prototype.setGroundColor = function (gcolor) {
                    var ground_color = gcolor;
                    var r = ground_color[0] / 255;
                    var g = ground_color[1] / 255;
                    var b = ground_color[2] / 255;
                    var color = new Color3(r, g, b);
                    var gmat = this.ground.material;
                    gmat.diffuseColor = color;
                };
                Vishva.prototype.getGroundColor = function () {
                    var ground_color = new Array(3);
                    var gmat = this.ground.material;
                    if (gmat.diffuseColor != null) {
                        ground_color[0] = (gmat.diffuseColor.r * 255);
                        ground_color[1] = (gmat.diffuseColor.g * 255);
                        ground_color[2] = (gmat.diffuseColor.b * 255);
                        return ground_color;
                    }
                    else {
                        return null;
                    }
                };
                Vishva.prototype.toggleDebug = function () {
                    if (this.scene.debugLayer.isVisible()) {
                        this.scene.debugLayer.hide();
                    }
                    else {
                        this.scene.debugLayer.show();
                    }
                };
                Vishva.prototype.saveAsset = function () {
                    if (!this.isMeshSelected) {
                        return null;
                    }
                    this.renameWorldTextures();
                    var clone = this.meshPicked.clone(this.meshPicked.name, null);
                    clone.position = Vector3.Zero();
                    clone.rotation = Vector3.Zero();
                    var meshObj = SceneSerializer.SerializeMesh(clone, false);
                    clone.dispose();
                    var meshString = JSON.stringify(meshObj);
                    var file = new File([meshString], "AssetFile.babylon");
                    return URL.createObjectURL(file);
                };
                Vishva.prototype.saveWorld = function () {
                    if (this.editControl != null) {
                        alert("cannot save during edit");
                        return null;
                    }
                    this.cleanupSkels();
                    this.resetSkels(this.scene);
                    this.cleanupMats();
                    this.renameWorldTextures();
                    var snaObj = SNAManager.getSNAManager().serializeSnAs(this.scene);
                    var snaObjStr = JSON.stringify(snaObj);
                    var sceneObj = SceneSerializer.Serialize(this.scene);
                    sceneObj["VishvaSNA"] = snaObj;
                    var sceneString = JSON.stringify(sceneObj);
                    var file = new File([sceneString], "WorldFile.babylon");
                    return URL.createObjectURL(file);
                };
                /**
                 * resets each skel and assign unique id to each skeleton
                 *
                 * @param scene
                 */
                Vishva.prototype.resetSkels = function (scene) {
                    var i = 0;
                    for (var index123 = 0; index123 < scene.skeletons.length; index123++) {
                        var skel = scene.skeletons[index123];
                        {
                            skel.id = (new Number(i)).toString();
                            i++;
                            skel.returnToRest();
                        }
                    }
                };
                Vishva.prototype.renameWorldTextures = function () {
                    var mats = this.scene.materials;
                    this.renameWorldMaterials(mats);
                    var mms = this.scene.multiMaterials;
                    for (var index124 = 0; index124 < mms.length; index124++) {
                        var mm = mms[index124];
                        {
                            this.renameWorldMaterials(mm.subMaterials);
                        }
                    }
                };
                Vishva.prototype.renameWorldMaterials = function (mats) {
                    var sm;
                    for (var index125 = 0; index125 < mats.length; index125++) {
                        var mat = mats[index125];
                        {
                            if (mat instanceof BABYLON.StandardMaterial) {
                                sm = mat;
                                this.rename(sm.diffuseTexture);
                                this.rename(sm.reflectionTexture);
                                this.rename(sm.opacityTexture);
                                this.rename(sm.specularTexture);
                                this.rename(sm.bumpTexture);
                            }
                        }
                    }
                };
                Vishva.prototype.rename = function (bt) {
                    if (bt == null)
                        return;
                    if (bt.name.substring(0, 2) != "..") {
                        bt.name = "../../../../" + bt.name;
                    }
                };
                /**
                 * remove all materials not referenced by any mesh
                 *
                 */
                Vishva.prototype.cleanupMats = function () {
                    var meshes = this.scene.meshes;
                    var mats = new Array();
                    var mms = new Array();
                    for (var index126 = 0; index126 < meshes.length; index126++) {
                        var mesh = meshes[index126];
                        {
                            if (mesh.material != null) {
                                if (mesh.material instanceof BABYLON.MultiMaterial) {
                                    var mm = mesh.material;
                                    mms.push(mm);
                                    var ms = mm.subMaterials;
                                    for (var index127 = 0; index127 < ms.length; index127++) {
                                        var mat = ms[index127];
                                        {
                                            mats.push(mat);
                                        }
                                    }
                                }
                                else {
                                    mats.push(mesh.material);
                                }
                            }
                        }
                    }
                    var allMats = this.scene.materials;
                    var l = allMats.length;
                    for (var i = l - 1; i >= 0; i--) {
                        if (mats.indexOf(allMats[(i | 0)]) == -1) {
                            allMats[(i | 0)].dispose();
                        }
                    }
                    var allMms = this.scene.multiMaterials;
                    l = allMms.length;
                    for (var i = l - 1; i >= 0; i--) {
                        if (mms.indexOf(allMms[(i | 0)]) == -1) {
                            allMms[(i | 0)].dispose();
                        }
                    }
                };
                /**
                 * remove all skeletons not referenced by any mesh
                 *
                 */
                Vishva.prototype.cleanupSkels = function () {
                    var meshes = this.scene.meshes;
                    var skels = new Array();
                    for (var index128 = 0; index128 < meshes.length; index128++) {
                        var mesh = meshes[index128];
                        {
                            if (mesh.skeleton != null) {
                                skels.push(mesh.skeleton);
                            }
                        }
                    }
                    var allSkels = this.scene.skeletons;
                    var l = allSkels.length;
                    for (var i = l - 1; i >= 0; i--) {
                        if (skels.indexOf(allSkels[(i | 0)]) == -1) {
                            allSkels[(i | 0)].dispose();
                        }
                    }
                };
                Vishva.prototype.loadAssetFile = function (file) {
                    var _this = this;
                    var sceneFolderName = file.name.split(".")[0];
                    SceneLoader.ImportMesh("", "vishva/assets/" + sceneFolderName + "/", file.name, this.scene, function (meshes, particleSystems, skeletons) { return _this.onMeshLoaded(meshes, particleSystems, skeletons); });
                };
                Vishva.prototype.loadAsset = function (assetType, file) {
                    var _this = this;
                    this.assetType = assetType;
                    this.file = file;
                    SceneLoader.ImportMesh("", "vishva/assets/" + assetType + "/" + file + "/", file + ".babylon", this.scene, function (meshes, particleSystems, skeletons) { return _this.onMeshLoaded(meshes, particleSystems, skeletons); });
                };
                Vishva.prototype.onMeshLoaded = function (meshes, particleSystems, skeletons) {
                    var boundingRadius = this.getBoundingRadius(meshes);
                    {
                        var array130 = meshes;
                        for (var index129 = 0; index129 < array130.length; index129++) {
                            var mesh = array130[index129];
                            {
                                mesh.isPickable = true;
                                mesh.checkCollisions = true;
                                var placementLocal = new Vector3(0, 0, -(boundingRadius + 2));
                                var placementGlobal = Vector3.TransformCoordinates(placementLocal, this.avatar.getWorldMatrix());
                                mesh.position.addInPlace(placementGlobal);
                                (this.shadowGenerator.getShadowMap().renderList).push(mesh);
                                mesh.receiveShadows = true;
                                if (mesh.material instanceof BABYLON.MultiMaterial) {
                                    var mm = mesh.material;
                                    var mats = mm.subMaterials;
                                    for (var index131 = 0; index131 < mats.length; index131++) {
                                        var mat = mats[index131];
                                        {
                                            mesh.material.backFaceCulling = false;
                                            mesh.material.alpha = 1;
                                            if (mat instanceof BABYLON.StandardMaterial) {
                                                this.renameAssetTextures(mat);
                                            }
                                        }
                                    }
                                }
                                else {
                                    mesh.material.backFaceCulling = false;
                                    mesh.material.alpha = 1;
                                    var sm = mesh.material;
                                    this.renameAssetTextures(sm);
                                }
                                if (mesh.skeleton != null) {
                                    this.fixAnimationRanges(mesh.skeleton);
                                }
                            }
                        }
                    }
                };
                Vishva.prototype.renameAssetTextures = function (sm) {
                    this.renameAssetTexture(sm.diffuseTexture);
                    this.renameAssetTexture(sm.reflectionTexture);
                    this.renameAssetTexture(sm.opacityTexture);
                    this.renameAssetTexture(sm.specularTexture);
                    this.renameAssetTexture(sm.bumpTexture);
                };
                Vishva.prototype.renameAssetTexture = function (bt) {
                    if (bt == null)
                        return;
                    var textureName = bt.name;
                    if (textureName.indexOf("vishva/") != 0 && textureName.indexOf("../") != 0) {
                        bt.name = "vishva/assets/" + this.assetType + "/" + this.file + "/" + textureName;
                        console.log("renamed to " + bt.name);
                    }
                };
                /**
                 * finds the bounding sphere radius for a set of meshes. for each mesh gets
                 * bounding radius from the local center. this is the bounding world radius
                 * for that mesh plus the distance from the local center. takes the maximum
                 * of these
                 *
                 * @param meshes
                 * @return
                 */
                Vishva.prototype.getBoundingRadius = function (meshes) {
                    var maxRadius = 0;
                    for (var index132 = 0; index132 < meshes.length; index132++) {
                        var mesh = meshes[index132];
                        {
                            var bi = mesh.getBoundingInfo();
                            var r = bi.boundingSphere.radiusWorld + mesh.position.length();
                            if (maxRadius < r)
                                maxRadius = r;
                        }
                    }
                    return maxRadius;
                };
                Vishva.prototype.loadWorldFile = function (file) {
                    var _this = this;
                    this.sceneFolderName = file.name.split(".")[0];
                    var fr = new FileReader();
                    fr.onload = function (e) { return _this.onSceneFileRead(e); };
                    fr.readAsText(file);
                };
                Vishva.prototype.onSceneFileRead = function (e) {
                    var _this = this;
                    this.sceneData = "data:" + e.target.result;
                    this.engine.stopRenderLoop();
                    this.scene.onDispose = function () { return _this.onSceneDispose(); };
                    this.scene.dispose();
                    return null;
                };
                Vishva.prototype.onSceneDispose = function () {
                    var _this = this;
                    this.scene = null;
                    this.avatarSkeleton = null;
                    this.avatar = null;
                    this.prevAnim = null;
                    SceneLoader.Load("worlds/" + this.sceneFolderName + "/", this.sceneData, this.engine, function (scene) { return _this.onSceneLoaded(scene); });
                };
                Vishva.prototype.onSceneLoaded = function (scene) {
                    var _this = this;
                    var avFound = false;
                    var skelFound = false;
                    var sunFound = false;
                    var groundFound = false;
                    var skyFound = false;
                    var cameraFound = false;
                    for (var index133 = 0; index133 < scene.meshes.length; index133++) {
                        var mesh = scene.meshes[index133];
                        {
                            if (Tags.HasTags(mesh)) {
                                if (Tags.MatchesQuery(mesh, "Vishva.avatar")) {
                                    avFound = true;
                                    this.avatar = mesh;
                                    this.avatar.ellipsoidOffset = new Vector3(0, 2, 0);
                                }
                                else if (Tags.MatchesQuery(mesh, "Vishva.sky")) {
                                    skyFound = true;
                                    this.skybox = mesh;
                                    this.skybox.isPickable = false;
                                }
                                else if (Tags.MatchesQuery(mesh, "Vishva.ground")) {
                                    groundFound = true;
                                    this.ground = mesh;
                                }
                            }
                        }
                    }
                    for (var index134 = 0; index134 < scene.skeletons.length; index134++) {
                        var skeleton = scene.skeletons[index134];
                        {
                            if (Tags.MatchesQuery(skeleton, "Vishva.skeleton") || (skeleton.name == "Vishva.skeleton")) {
                                skelFound = true;
                                this.avatarSkeleton = skeleton;
                            }
                        }
                    }
                    if (!skelFound) {
                        console.error("ALARM: No Skeleton found");
                    }
                    for (var index135 = 0; index135 < scene.lights.length; index135++) {
                        var light = scene.lights[index135];
                        {
                            if (Tags.MatchesQuery(light, "Vishva.sun")) {
                                sunFound = true;
                                this.sun = light;
                            }
                        }
                    }
                    if (!sunFound) {
                        console.log("no vishva sun found. creating sun");
                        var hl = new HemisphericLight("Vishva.hl01", new Vector3(0, 1, 0), this.scene);
                        hl.groundColor = new Color3(0.5, 0.5, 0.5);
                        hl.intensity = 0.4;
                        this.sun = hl;
                        Tags.AddTagsTo(hl, "Vishva.sun");
                        this.sunDR = new DirectionalLight("Vishva.dl01", new Vector3(-1, -1, 0), this.scene);
                        this.sunDR.intensity = 0.5;
                        var sl = this.sunDR;
                        this.shadowGenerator = new ShadowGenerator(1024, sl);
                        this.shadowGenerator.useBlurVarianceShadowMap = true;
                        this.shadowGenerator.bias = 1.0E-6;
                    }
                    else {
                        for (var index136 = 0; index136 < scene.lights.length; index136++) {
                            var light = scene.lights[index136];
                            {
                                if (light.id == "Vishva.dl01") {
                                    this.sunDR = light;
                                    this.shadowGenerator = light.getShadowGenerator();
                                    this.shadowGenerator.bias = 1.0E-6;
                                }
                            }
                        }
                    }
                    for (var index137 = 0; index137 < scene.cameras.length; index137++) {
                        var camera = scene.cameras[index137];
                        {
                            if (Tags.MatchesQuery(camera, "Vishva.camera")) {
                                cameraFound = true;
                                this.mainCamera = camera;
                                this.setCameraSettings(this.mainCamera);
                                this.mainCamera.attachControl(this.canvas, true);
                            }
                        }
                    }
                    if (!cameraFound) {
                        console.log("no vishva camera found. creating camera");
                        this.mainCamera = this.createCamera(this.scene, this.canvas);
                        this.scene.activeCamera = this.mainCamera;
                    }
                    if (!groundFound) {
                        console.log("no vishva ground found. creating ground");
                        this.ground = this.createGround(this.scene);
                    }
                    if (!skyFound) {
                        console.log("no vishva sky found. creating sky");
                        this.skybox = this.createSkyBox(this.scene);
                    }
                    if (this.scene.fogMode != Scene.FOGMODE_EXP) {
                        this.scene.fogMode = Scene.FOGMODE_EXP;
                        this.scene.fogDensity = 0;
                    }
                    if (this.editEnabled) {
                        this.scene.onPointerDown = function (evt, pickResult) { return _this.pickObject(evt, pickResult); };
                    }
                    if (!avFound) {
                        console.log("no vishva av found. creating av");
                        this.loadAvatar();
                    }
                    SNAManager.getSNAManager().unMarshal(this.snas, this.scene);
                    this.snas = null;
                    this.render();
                };
                Vishva.prototype.createWater = function () {
                    var waterMesh = Mesh.CreateGround("waterMesh", 512, 512, 32, this.scene, false);
                    waterMesh.position.y = 1;
                    var water = new WaterMaterial("water", this.scene);
                    water.bumpTexture = new Texture("waterbump.png", this.scene);
                    water.windForce = -5;
                    water.waveHeight = 0.5;
                    water.waterColor = new Color3(0.1, 0.1, 0.6);
                    water.colorBlendFactor = 0;
                    water.bumpHeight = 0.1;
                    water.waveLength = 0.1;
                    water.addToRenderList(this.skybox);
                    waterMesh.material = water;
                };
                Vishva.prototype.switch_avatar = function () {
                    if (!this.isMeshSelected) {
                        return "no mesh selected";
                    }
                    if (this.isAvatar(this.meshPicked)) {
                        this.avatar.isPickable = true;
                        Tags.RemoveTagsFrom(this.avatar, "Vishva.avatar");
                        Tags.RemoveTagsFrom(this.avatarSkeleton, "Vishva.skeleton");
                        this.avatarSkeleton.name = "";
                        this.avatar = this.meshPicked;
                        this.avatarSkeleton = this.avatar.skeleton;
                        Tags.AddTagsTo(this.avatar, "Vishva.avatar");
                        Tags.AddTagsTo(this.avatarSkeleton, "Vishva.skeleton");
                        this.avatarSkeleton.name = "Vishva.skeleton";
                        this.setAnimationRange(this.avatarSkeleton);
                        this.avatar.checkCollisions = true;
                        this.avatar.ellipsoid = new Vector3(0.5, 1, 0.5);
                        this.avatar.ellipsoidOffset = new Vector3(0, 2, 0);
                        this.avatar.isPickable = false;
                        this.avatar.rotation = this.avatar.rotationQuaternion.toEulerAngles();
                        this.avatar.rotationQuaternion = null;
                        this.saveAVcameraPos = this.mainCamera.position;
                        this.focusOnAv = false;
                        this.removeEditControl();
                    }
                    else {
                        return "cannot use this as avatar";
                    }
                    return null;
                };
                Vishva.prototype.isAvatar = function (mesh) {
                    if (mesh.skeleton == null) {
                        return false;
                    }
                    return true;
                };
                Vishva.prototype.setAvatar = function (avName, meshes) {
                    var mesh;
                    for (var index138 = 0; index138 < meshes.length; index138++) {
                        var amesh = meshes[index138];
                        {
                            mesh = amesh;
                            if ((mesh.id == avName)) {
                                var saveRotation;
                                var savePosition;
                                if (this.avatar != null) {
                                    saveRotation = this.avatar.rotation;
                                    savePosition = this.avatar.position;
                                }
                                else {
                                    saveRotation = new Vector3(0, Math.PI, 0);
                                    savePosition = new Vector3(0, 0, 0);
                                }
                                this.avatar = mesh;
                                this.avatar.rotation = saveRotation;
                                this.avatar.position = savePosition;
                                this.avatar.visibility = 1;
                                this.avatar.skeleton = this.avatarSkeleton;
                                this.avatar.checkCollisions = true;
                                this.avatar.ellipsoid = new Vector3(0.5, 1, 0.5);
                                this.avatar.ellipsoidOffset = new Vector3(0, 2, 0);
                                this.avatar.isPickable = false;
                            }
                            else {
                                mesh.skeleton = null;
                                mesh.visibility = 0;
                                mesh.checkCollisions = false;
                            }
                        }
                    }
                };
                Vishva.prototype.render = function () {
                    var _this = this;
                    this.scene.registerBeforeRender(function () { return _this.process(); });
                    this.scene.executeWhenReady(function () { return _this.startRenderLoop(); });
                };
                Vishva.prototype.startRenderLoop = function () {
                    var _this = this;
                    this.backfaceCulling(this.scene.materials);
                    if (this.editEnabled) {
                        this.vishvaGUI = new babylonjs.VishvaGUI(this);
                    }
                    else {
                        this.vishvaGUI = null;
                    }
                    this.engine.hideLoadingUI();
                    this.engine.runRenderLoop(function () { return _this.scene.render(); });
                };
                Vishva.prototype.process = function () {
                    if (this.cameraAnimating)
                        return;
                    if (this.mainCamera.radius < 0.75) {
                        this.avatar.visibility = 0;
                    }
                    else {
                        this.avatar.visibility = 1;
                    }
                    if (this.isMeshSelected) {
                        if (this.key.focus) {
                            this.key.focus = false;
                            if (this.focusOnAv) {
                                this.saveAVcameraPos.copyFrom(this.mainCamera.position);
                                this.focusOnAv = false;
                            }
                            this.focusOnMesh(this.meshPicked, 25);
                        }
                        if (this.key.esc) {
                            this.key.esc = false;
                            this.removeEditControl();
                        }
                        if (this.key.trans) {
                            this.key.trans = false;
                            this.editControl.enableTranslation();
                        }
                        if (this.key.rot) {
                            this.key.rot = false;
                            this.editControl.enableRotation();
                        }
                        if (this.key.scale) {
                            this.key.scale = false;
                            this.editControl.enableScaling();
                        }
                    }
                    if (this.focusOnAv) {
                        if (this.editControl == null) {
                            this.moveAvatarCamera();
                        }
                        else {
                            if (!this.editControl.isEditing()) {
                                this.moveAvatarCamera();
                            }
                        }
                    }
                    else if (this.key.up || this.key.down) {
                        if (!this.editControl.isEditing()) {
                            this.switchFocusToAV();
                        }
                    }
                };
                Vishva.prototype.moveAvatarCamera = function () {
                    var anim = this.idle;
                    var moving = false;
                    var speed = 0;
                    var upSpeed = 0.05;
                    var dir = 1;
                    var forward;
                    var backwards;
                    var stepLeft;
                    var stepRight;
                    var up;
                    if (this.key.up) {
                        if (this.key.shift) {
                            speed = this.avatarSpeed * 2;
                            anim = this.run;
                        }
                        else {
                            speed = this.avatarSpeed;
                            anim = this.walk;
                        }
                        if (this.key.jump) {
                            this.wasJumping = true;
                        }
                        if (this.wasJumping) {
                            upSpeed *= 2;
                            if (this.jumpCycle < this.jumpCycleMax / 2) {
                                dir = 1;
                                if (this.jumpCycle < 0) {
                                    this.jumpCycle = this.jumpCycleMax;
                                    upSpeed /= 2;
                                    this.key.jump = false;
                                    this.wasJumping = false;
                                }
                            }
                            else {
                                anim = this.jump;
                                dir = -1;
                            }
                            this.jumpCycle--;
                        }
                        forward = this.avatar.calcMovePOV(0, -upSpeed * dir, speed);
                        this.avatar.moveWithCollisions(forward);
                        moving = true;
                    }
                    else if (this.key.down) {
                        backwards = this.avatar.calcMovePOV(0, -upSpeed * dir, -this.avatarSpeed / 2);
                        this.avatar.moveWithCollisions(backwards);
                        moving = true;
                        anim = this.walkBack;
                        if (this.key.jump)
                            this.key.jump = false;
                    }
                    else if (this.key.stepLeft) {
                        anim = this.strafeLeft;
                        stepLeft = this.avatar.calcMovePOV(-this.avatarSpeed / 2, 0, 0);
                        this.avatar.moveWithCollisions(stepLeft);
                        moving = true;
                    }
                    else if (this.key.stepRight) {
                        anim = this.strafeRight;
                        stepRight = this.avatar.calcMovePOV(this.avatarSpeed / 2, 0, 0);
                        this.avatar.moveWithCollisions(stepRight);
                        moving = true;
                    }
                    if (!moving) {
                        if (this.key.jump) {
                            this.wasJumping = true;
                        }
                        if (this.wasJumping) {
                            upSpeed *= 2;
                            if (this.jumpCycle < this.jumpCycleMax / 2) {
                                dir = 1;
                                if (this.jumpCycle < 0) {
                                    this.jumpCycle = this.jumpCycleMax;
                                    upSpeed /= 2;
                                    this.key.jump = false;
                                    this.wasJumping = false;
                                }
                            }
                            else {
                                anim = this.jump;
                                dir = -1;
                            }
                            this.jumpCycle--;
                        }
                        else
                            dir = dir / 2;
                        this.avatar.moveWithCollisions(new Vector3(0, -upSpeed * dir, 0));
                    }
                    if (!this.key.stepLeft && !this.key.stepRight) {
                        if (this.key.left) {
                            this.mainCamera.alpha = this.mainCamera.alpha + 0.022;
                            if (!moving) {
                                this.avatar.rotation.y = -4.69 - this.mainCamera.alpha;
                                anim = this.turnLeft;
                            }
                        }
                        else if (this.key.right) {
                            this.mainCamera.alpha = this.mainCamera.alpha - 0.022;
                            if (!moving) {
                                this.avatar.rotation.y = -4.69 - this.mainCamera.alpha;
                                anim = this.turnRight;
                            }
                        }
                    }
                    if (moving) {
                        this.avatar.rotation.y = -4.69 - this.mainCamera.alpha;
                    }
                    if (this.prevAnim != anim) {
                        this.avatarSkeleton.beginAnimation(anim.name, true, anim.r);
                        this.prevAnim = anim;
                    }
                    this.mainCamera.target = new Vector3(this.avatar.position.x, (this.avatar.position.y + 1.5), this.avatar.position.z);
                };
                Vishva.prototype.pickObject = function (evt, pickResult) {
                    evt.preventDefault();
                    if (evt.button != 2)
                        return;
                    if (this.key.ctl)
                        return;
                    if (pickResult.hit) {
                        if (!this.isMeshSelected) {
                            this.isMeshSelected = true;
                            this.meshPicked = pickResult.pickedMesh;
                            this.meshPicked.showBoundingBox = this.showBoundingBox;
                            SNAManager.getSNAManager().disableSnAs(this.meshPicked);
                            this.editControl = new EditControl(this.meshPicked, this.mainCamera, this.canvas, 0.75);
                            this.editControl.enableTranslation();
                            this.editAlreadyOpen = this.vishvaGUI.showEditMenu();
                        }
                        else {
                            if (pickResult.pickedMesh == this.meshPicked) {
                                if (this.focusOnAv) {
                                    this.saveAVcameraPos.copyFrom(this.mainCamera.position);
                                    this.focusOnAv = false;
                                }
                                this.focusOnMesh(this.meshPicked, 50);
                            }
                            else {
                                this.swicthEditControl(pickResult.pickedMesh);
                            }
                        }
                    }
                };
                /**
                 * switch the edit control to the new mesh
                 * @param mesh
                 */
                Vishva.prototype.swicthEditControl = function (mesh) {
                    if (this.switchDisabled)
                        return;
                    SNAManager.getSNAManager().enableSnAs(this.meshPicked);
                    this.meshPicked.showBoundingBox = false;
                    this.meshPicked = mesh;
                    this.meshPicked.showBoundingBox = this.showBoundingBox;
                    this.editControl.switchTo(this.meshPicked);
                    SNAManager.getSNAManager().disableSnAs(this.meshPicked);
                };
                Vishva.prototype.removeEditControl = function () {
                    this.isMeshSelected = false;
                    this.meshPicked.showBoundingBox = false;
                    if (!this.focusOnAv) {
                        this.switchFocusToAV();
                    }
                    this.editControl.detach();
                    this.editControl = null;
                    if (!this.editAlreadyOpen)
                        this.vishvaGUI.closeEditMenu();
                    SNAManager.getSNAManager().enableSnAs(this.meshPicked);
                };
                Vishva.prototype.switchFocusToAV = function () {
                    var avTarget = new Vector3(this.avatar.position.x, (this.avatar.position.y + 1.5), this.avatar.position.z);
                    this.mainCamera.detachControl(this.canvas);
                    this.frames = 25;
                    this.f = this.frames;
                    this.delta = this.saveAVcameraPos.subtract(this.mainCamera.position).scale(1 / this.frames);
                    this.delta2 = avTarget.subtract(this.mainCamera.target).scale(1 / this.frames);
                    this.cameraAnimating = true;
                    this.scene.registerBeforeRender(this.animFunc);
                };
                Vishva.prototype.focusOnMesh = function (mesh, frames) {
                    this.mainCamera.detachControl(this.canvas);
                    this.frames = frames;
                    this.f = frames;
                    this.delta2 = mesh.position.subtract(this.mainCamera.target).scale(1 / this.frames);
                    this.cameraAnimating = true;
                    this.scene.registerBeforeRender(this.animFunc2);
                };
                Vishva.prototype.animateCamera = function () {
                    this.mainCamera.setTarget(this.mainCamera.target.add(this.delta2));
                    this.mainCamera.setPosition(this.mainCamera.position.add(this.delta));
                    this.f--;
                    if (this.f < 0) {
                        this.focusOnAv = true;
                        this.cameraAnimating = false;
                        this.scene.unregisterBeforeRender(this.animFunc);
                        this.mainCamera.attachControl(this.canvas);
                    }
                };
                Vishva.prototype.justReFocus = function () {
                    this.mainCamera.setTarget(this.mainCamera.target.add(this.delta2));
                    this.f--;
                    if (this.f < 0) {
                        this.cameraAnimating = false;
                        this.scene.unregisterBeforeRender(this.animFunc2);
                        this.mainCamera.attachControl(this.canvas);
                    }
                };
                Vishva.prototype.createGround = function (scene) {
                    var groundMaterial = new StandardMaterial("groundMat", scene);
                    groundMaterial.diffuseTexture = new Texture(this.groundTexture, scene);
                    groundMaterial.diffuseTexture.uScale = 6.0;
                    groundMaterial.diffuseTexture.vScale = 6.0;
                    groundMaterial.diffuseColor = new Color3(0.9, 0.6, 0.4);
                    groundMaterial.specularColor = new Color3(0, 0, 0);
                    var grnd = Mesh.CreateGround("ground", 256, 256, 1, scene);
                    grnd.material = groundMaterial;
                    grnd.checkCollisions = true;
                    grnd.isPickable = false;
                    Tags.AddTagsTo(grnd, "Vishva.ground Vishva.internal");
                    grnd.freezeWorldMatrix();
                    grnd.receiveShadows = true;
                    return grnd;
                };
                Vishva.prototype.createSkyBox = function (scene) {
                    var skybox = Mesh.CreateBox("skyBox", 1000.0, scene);
                    var skyboxMaterial = new StandardMaterial("skyBox", scene);
                    skyboxMaterial.backFaceCulling = false;
                    skybox.material = skyboxMaterial;
                    skybox.infiniteDistance = true;
                    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
                    skyboxMaterial.specularColor = new Color3(0, 0, 0);
                    skyboxMaterial.reflectionTexture = new CubeTexture(this.skyboxTextures, scene);
                    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
                    skybox.renderingGroupId = 0;
                    skybox.isPickable = false;
                    Tags.AddTagsTo(skybox, "Vishva.sky Vishva.internal");
                    return skybox;
                };
                Vishva.prototype.createCamera = function (scene, canvas) {
                    var camera = new ArcRotateCamera("v.c-camera", 1, 1.4, 4, new Vector3(0, 0, 0), scene);
                    this.setCameraSettings(camera);
                    camera.attachControl(canvas, true);
                    if (this.avatar != null) {
                        camera.target = new Vector3(this.avatar.position.x, this.avatar.position.y + 1.5, this.avatar.position.z);
                        camera.alpha = -this.avatar.rotation.y - 4.69;
                    }
                    else {
                        camera.target = Vector3.Zero();
                    }
                    camera.checkCollisions = this.cameraCollision;
                    Tags.AddTagsTo(camera, "Vishva.camera");
                    return camera;
                };
                Vishva.prototype.loadAvatar = function () {
                    var _this = this;
                    SceneLoader.ImportMesh("", this.avatarFolder, this.avatarFile, this.scene, function (meshes, particleSystems, skeletons) { return _this.onAvatarLoaded(meshes, particleSystems, skeletons); });
                };
                Vishva.prototype.onAvatarLoaded = function (meshes, particleSystems, skeletons) {
                    this.avatar = meshes[0];
                    (this.shadowGenerator.getShadowMap().renderList).push(this.avatar);
                    this.avatar.receiveShadows = true;
                    var l = meshes.length;
                    for (var i = 1; i < l; i++) {
                        meshes[i].checkCollisions = false;
                        meshes[i].dispose();
                    }
                    this.avatarSkeleton = skeletons[0];
                    l = skeletons.length;
                    for (var i = 1; i < l; i++) {
                        skeletons[i].dispose();
                    }
                    this.fixAnimationRanges(this.avatarSkeleton);
                    this.avatar.skeleton = this.avatarSkeleton;
                    this.avatar.rotation.y = Math.PI;
                    this.avatar.position = new Vector3(0, 0, 0);
                    this.avatar.checkCollisions = true;
                    this.avatar.ellipsoid = new Vector3(0.5, 1, 0.5);
                    this.avatar.ellipsoidOffset = new Vector3(0, 2, 0);
                    this.avatar.isPickable = false;
                    Tags.AddTagsTo(this.avatar, "Vishva.avatar");
                    Tags.AddTagsTo(this.avatarSkeleton, "Vishva.skeleton");
                    this.avatarSkeleton.name = "Vishva.skeleton";
                    this.mainCamera.target = new Vector3(this.avatar.position.x, this.avatar.position.y + 1.5, this.avatar.position.z);
                    this.mainCamera.alpha = -this.avatar.rotation.y - 4.69;
                    var sm = this.avatar.material;
                    if (sm.diffuseTexture != null) {
                        var textureName = sm.diffuseTexture.name;
                        sm.diffuseTexture.name = this.avatarFolder + textureName;
                    }
                };
                Vishva.prototype.setAnimationRange = function (skel) {
                    for (var index139 = 0; index139 < this.anims.length; index139++) {
                        var anim = this.anims[index139];
                        {
                            skel.createAnimationRange(anim.name, anim.s, anim.e);
                        }
                    }
                };
                /**
                 * workaround for bug in blender exporter
                 * 4.4.3 animation ranges are off by 1
                 * 4.4.4 issue with actions with just 2 frames -> from = to
                 *
                 * @param skel
                 */
                Vishva.prototype.fixAnimationRanges = function (skel) {
                    var getAnimationRanges = skel["getAnimationRanges"];
                    var ranges = getAnimationRanges.call(skel);
                    for (var index140 = 0; index140 < ranges.length; index140++) {
                        var range = ranges[index140];
                        {
                            if (range.from == range.to) {
                                range.to++;
                            }
                        }
                    }
                };
                Vishva.prototype.setCameraSettings = function (camera) {
                    camera.lowerRadiusLimit = 0.25;
                    camera.keysLeft = [];
                    camera.keysRight = [];
                    camera.keysUp = [];
                    camera.keysDown = [];
                    camera.panningSensibility = 10;
                    camera.inertia = 0.1;
                    camera.angularSensibilityX = 250;
                    camera.angularSensibilityY = 250;
                };
                Vishva.prototype.backfaceCulling = function (mat) {
                    var index;
                    for (index = 0; index < mat.length; ++index) {
                        mat[index].backFaceCulling = false;
                    }
                };
                return Vishva;
            })();
            babylonjs.Vishva = Vishva;
            var Key = (function () {
                function Key() {
                }
                return Key;
            })();
            babylonjs.Key = Key;
            var AnimData = (function () {
                function AnimData(name, s, e, d) {
                    this.name = name;
                    this.s = s;
                    this.e = e;
                    this.r = d;
                }
                return AnimData;
            })();
            babylonjs.AnimData = AnimData;
            var SNAManager = (function () {
                function SNAManager() {
                    this.sensorList = ["Touch"];
                    this.actuatorList = ["Mover", "Rotator", "Sound"];
                    this.snaDisabledList = new Array();
                    this.sig2actMap = new Object();
                }
                SNAManager.getSNAManager = function () {
                    if (SNAManager.sm == null) {
                        SNAManager.sm = new SNAManager();
                    }
                    return SNAManager.sm;
                };
                SNAManager.prototype.setConfig = function (snaConfig) {
                    this.sensors = snaConfig["sensors"];
                    this.actuators = snaConfig["actuators"];
                    this.sensorList = Object.keys(this.sensors);
                    this.actuatorList = Object.keys(this.actuators);
                };
                SNAManager.prototype.getSensorList = function () {
                    return this.sensorList;
                };
                SNAManager.prototype.getActuatorList = function () {
                    return this.actuatorList;
                };
                SNAManager.prototype.createSensorByName = function (name, mesh, prop) {
                    if (name == "Touch") {
                        if (prop != null)
                            return new SensorTouch(mesh, prop);
                        else
                            return new SensorTouch(mesh, new SenTouchProp());
                    }
                    return null;
                };
                SNAManager.prototype.createActuatorByName = function (name, mesh, prop) {
                    if (name == "Mover") {
                        if (prop != null)
                            return new ActuatorMover(mesh, prop);
                        else
                            return new ActuatorMover(mesh, new ActMoverParm());
                    }
                    else if (name == "Rotator") {
                        if (prop != null)
                            return new ActuatorRotator(mesh, prop);
                        else
                            return new ActuatorRotator(mesh, new ActRotatorParm());
                    }
                    else if (name == "Sound") {
                        if (prop != null)
                            return new ActuatorSound(mesh, prop);
                        else
                            return new ActuatorSound(mesh, new ActSoundProp());
                    }
                    return null;
                };
                SNAManager.prototype.getSensorParms = function (sensor) {
                    var sensorObj = this.sensors[sensor];
                    return sensorObj["parms"];
                };
                SNAManager.prototype.getActuatorParms = function (actuator) {
                    var actuatorObj = this.sensors[actuator];
                    return actuatorObj["parms"];
                };
                SNAManager.prototype.emitSignal = function (signalId) {
                    var _this = this;
                    if (signalId.trim() == "")
                        return;
                    var keyValue = this.sig2actMap[signalId];
                    if (keyValue != null) {
                        window.setTimeout((function (acts) { return _this.actuate(acts); }), 0, keyValue);
                    }
                };
                SNAManager.prototype.actuate = function (acts) {
                    var actuators = acts;
                    for (var index141 = 0; index141 < actuators.length; index141++) {
                        var actuator = actuators[index141];
                        {
                            actuator.start();
                        }
                    }
                };
                /**
                 * this is called to process any signals queued in any of mesh actuators
                 * this could be called after say a user has finished editing a mesh during
                 * edit all actuators are disabled and some events coudl lead to pending
                 * signals one example of such event could be adding a actuator with
                 * "autostart" enabled or enabling an existing actuators "autostart" during
                 * edit.
                 *
                 * @param mesh
                 */
                SNAManager.prototype.processQueue = function (mesh) {
                    var actuators = mesh["actuators"];
                    if (actuators != null) {
                        for (var index142 = 0; index142 < actuators.length; index142++) {
                            var actuator = actuators[index142];
                            {
                                actuator.processQueue();
                            }
                        }
                    }
                };
                /**
                 * this temproraily disables all sensors and actuators on a mesh this could
                 * be called for example when editing a mesh
                 *
                 * @param mesh
                 */
                SNAManager.prototype.disableSnAs = function (mesh) {
                    this.snaDisabledList.push(mesh);
                    var actuators = mesh["actuators"];
                    if (actuators != null) {
                        for (var index143 = 0; index143 < actuators.length; index143++) {
                            var actuator = actuators[index143];
                            {
                                if (actuator.actuating)
                                    actuator.stop();
                            }
                        }
                    }
                };
                SNAManager.prototype.enableSnAs = function (mesh) {
                    var i = this.snaDisabledList.indexOf(mesh);
                    if (i != -1) {
                        this.snaDisabledList.splice(i, 1);
                    }
                    var actuators = mesh["actuators"];
                    if (actuators != null) {
                        for (var index144 = 0; index144 < actuators.length; index144++) {
                            var actuator = actuators[index144];
                            {
                                if (actuator.properties.autoStart)
                                    actuator.start();
                            }
                        }
                    }
                };
                /**
                 * removes all sensors and actuators from a mesh. this would be called when
                 * say disposing off a mesh
                 *
                 * @param mesh
                 */
                SNAManager.prototype.removeSNAs = function (mesh) {
                    var actuators = mesh["actuators"];
                    if (actuators != null) {
                        for (var index145 = 0; index145 < actuators.length; index145++) {
                            var actuator = actuators[index145];
                            {
                                actuator.dispose();
                            }
                        }
                    }
                    var sensors = mesh["sensors"];
                    if (sensors != null) {
                        for (var index146 = 0; index146 < sensors.length; index146++) {
                            var sensor = sensors[index146];
                            {
                                sensor.dispose();
                            }
                        }
                    }
                };
                SNAManager.prototype.subscribe = function (actuator, signalId) {
                    var keyValue = this.sig2actMap[signalId];
                    if (keyValue == null) {
                        var actuators = new Array();
                        actuators.push(actuator);
                        this.sig2actMap[signalId] = actuators;
                    }
                    else {
                        var actuators = keyValue;
                        actuators.push(actuator);
                    }
                };
                SNAManager.prototype.unSubscribe = function (actuator, signalId) {
                    var keyValue = this.sig2actMap[signalId];
                    if (keyValue != null) {
                        var actuators = keyValue;
                        var i = actuators.indexOf(actuator);
                        if (i != -1) {
                            actuators.splice(i, 1);
                        }
                    }
                };
                SNAManager.prototype.unSubscribeAll = function () {
                };
                SNAManager.prototype.serializeSnAs = function (scene) {
                    var snas = new Array();
                    var sna;
                    var meshes = scene.meshes;
                    var meshId;
                    for (var index147 = 0; index147 < meshes.length; index147++) {
                        var mesh = meshes[index147];
                        {
                            meshId = null;
                            var actuators = mesh["actuators"];
                            if (actuators != null) {
                                meshId = this.getMeshVishvaUid(mesh);
                                for (var index148 = 0; index148 < actuators.length; index148++) {
                                    var actuator = actuators[index148];
                                    {
                                        sna = new SNAserialized();
                                        sna.name = actuator.getName();
                                        sna.type = actuator.getType();
                                        sna.meshId = meshId;
                                        sna.properties = actuator.getProperties();
                                        snas.push(sna);
                                    }
                                }
                            }
                            var sensors = mesh["sensors"];
                            if (sensors != null) {
                                if (meshId != null)
                                    meshId = this.getMeshVishvaUid(mesh);
                                for (var index149 = 0; index149 < sensors.length; index149++) {
                                    var sensor = sensors[index149];
                                    {
                                        sna = new SNAserialized();
                                        sna.name = sensor.getName();
                                        sna.type = sensor.getType();
                                        sna.meshId = meshId;
                                        sna.properties = sensor.getProperties();
                                        snas.push(sna);
                                    }
                                }
                            }
                        }
                    }
                    return snas;
                };
                SNAManager.prototype.unMarshal = function (snas, scene) {
                    if (snas == null)
                        return;
                    var act;
                    for (var index150 = 0; index150 < snas.length; index150++) {
                        var sna = snas[index150];
                        {
                            var mesh = scene.getMeshesByTags(sna.meshId)[0];
                            if (mesh != null) {
                                if (sna.type == "SENSOR") {
                                    this.createSensorByName(sna.name, mesh, sna.properties);
                                }
                                else if (sna.type == "ACTUATOR") {
                                    if (sna.name == "Sound") {
                                        var prop = new ActSoundProp();
                                        prop.unmarshall(sna.properties);
                                        act = this.createActuatorByName(sna.name, mesh, prop);
                                    }
                                    else {
                                        act = this.createActuatorByName(sna.name, mesh, sna.properties);
                                    }
                                }
                            }
                        }
                    }
                };
                SNAManager.prototype.getMeshVishvaUid = function (mesh) {
                    if (Tags.HasTags(mesh)) {
                        var tags = Tags.GetTags(mesh, true).split(" ");
                        for (var index151 = 0; index151 < tags.length; index151++) {
                            var tag = tags[index151];
                            {
                                var i = tag.indexOf("Vishva.uid.");
                                if (i >= 0) {
                                    return tag;
                                }
                            }
                        }
                    }
                    var uid = "Vishva.uid." + (new Number(Date.now())).toString();
                    Tags.AddTagsTo(mesh, uid);
                    return uid;
                };
                return SNAManager;
            })();
            babylonjs.SNAManager = SNAManager;
            var SNAserialized = (function () {
                function SNAserialized() {
                }
                return SNAserialized;
            })();
            babylonjs.SNAserialized = SNAserialized;
            var SensorAbstract = (function () {
                function SensorAbstract(mesh, properties) {
                    Object.defineProperty(this, '__interfaces', { configurable: true, value: ["org.ssatguru.babylonjs.Sensor", "org.ssatguru.babylonjs.SensorActuator"] });
                    this.properties = properties;
                    this.mesh = mesh;
                    var sensors = this.mesh["sensors"];
                    if (sensors == null) {
                        sensors = new Array();
                        mesh["sensors"] = sensors;
                    }
                    sensors.push(this);
                }
                SensorAbstract.prototype.dispose = function () {
                    var sensors = this.mesh["sensors"];
                    if (sensors != null) {
                        var i = sensors.indexOf(this);
                        if (i != -1) {
                            sensors.splice(i, 1);
                        }
                    }
                    this.cleanUp();
                };
                SensorAbstract.prototype.cleanUp = function () { };
                SensorAbstract.prototype.getSignalId = function () {
                    return this.properties.signalId;
                };
                SensorAbstract.prototype.setSignalId = function (sid) {
                    this.properties.signalId = sid;
                };
                SensorAbstract.prototype.emitSignal = function (e) {
                    var i = SNAManager.getSNAManager().snaDisabledList.indexOf(this.mesh);
                    if (i >= 0)
                        return;
                    SNAManager.getSNAManager().emitSignal(this.properties.signalId);
                };
                SensorAbstract.prototype.getName = function () { return null; };
                SensorAbstract.prototype.getProperties = function () {
                    return this.properties;
                };
                SensorAbstract.prototype.setProperties = function (prop) {
                    this.properties = prop;
                };
                SensorAbstract.prototype.processUpdateGeneric = function () {
                    this.processUpdateSpecific();
                };
                SensorAbstract.prototype.processUpdateSpecific = function () { };
                SensorAbstract.prototype.getType = function () {
                    return "SENSOR";
                };
                return SensorAbstract;
            })();
            babylonjs.SensorAbstract = SensorAbstract;
            var SensorTouch = (function (_super) {
                __extends(SensorTouch, _super);
                function SensorTouch(mesh, properties) {
                    var _this = this;
                    _super.call(this, mesh, properties);
                    Object.defineProperty(this, '__interfaces', { configurable: true, value: ["org.ssatguru.babylonjs.Sensor", "org.ssatguru.babylonjs.SensorActuator"] });
                    if (this.mesh.actionManager == null) {
                        this.mesh.actionManager = new ActionManager(mesh.getScene());
                    }
                    this.action = new ExecuteCodeAction(ActionManager.OnLeftPickTrigger, function (e) { return _this.emitSignal(e); });
                    this.mesh.actionManager.registerAction(this.action);
                }
                SensorTouch.prototype.getName = function () {
                    return "Touch";
                };
                SensorTouch.prototype.getProperties = function () {
                    return this.properties;
                };
                SensorTouch.prototype.setProperties = function (properties) {
                    this.properties = properties;
                };
                SensorTouch.prototype.cleanUp = function () {
                    var actions = this.mesh.actionManager.actions;
                    var i = actions.indexOf(this.action);
                    actions.splice(i, 1);
                    if (actions.length == 0) {
                        this.mesh.actionManager.dispose();
                        this.mesh.actionManager = null;
                    }
                };
                SensorTouch.prototype.processUpdateSpecific = function () {
                };
                return SensorTouch;
            })(SensorAbstract);
            babylonjs.SensorTouch = SensorTouch;
            var ActuatorAbstract = (function () {
                function ActuatorAbstract(mesh, prop) {
                    this.toggle = true;
                    this.actuating = false;
                    this.ready = true;
                    this.queued = 0;
                    Object.defineProperty(this, '__interfaces', { configurable: true, value: ["org.ssatguru.babylonjs.SensorActuator", "org.ssatguru.babylonjs.Actuator"] });
                    this.properties = prop;
                    this.mesh = mesh;
                    this.processUpdateGeneric();
                    var actuators = this.mesh["actuators"];
                    if (actuators == null) {
                        actuators = new Array();
                        this.mesh["actuators"] = actuators;
                    }
                    actuators.push(this);
                }
                ActuatorAbstract.prototype.start = function () {
                    if (!this.ready)
                        return false;
                    var i = SNAManager.getSNAManager().snaDisabledList.indexOf(this.mesh);
                    if (i >= 0)
                        return false;
                    if (this.actuating) {
                        if (!this.properties.loop) {
                            this.queued++;
                        }
                        return true;
                    }
                    SNAManager.getSNAManager().emitSignal(this.properties.startSigId);
                    this.actuating = true;
                    this.actuate();
                    return true;
                };
                ActuatorAbstract.prototype.actuate = function () { };
                ActuatorAbstract.prototype.stop = function () { };
                ActuatorAbstract.prototype.isReady = function () { return false; };
                ActuatorAbstract.prototype.processQueue = function () {
                    if (this.queued > 0) {
                        this.queued--;
                        this.start();
                    }
                };
                ActuatorAbstract.prototype.getName = function () { return null; };
                ActuatorAbstract.prototype.getType = function () {
                    return "ACTUATOR";
                };
                ActuatorAbstract.prototype.getMesh = function () {
                    return this.mesh;
                };
                ActuatorAbstract.prototype.getProperties = function () {
                    return this.properties;
                };
                ActuatorAbstract.prototype.setProperties = function (prop) {
                    this.properties = prop;
                    this.processUpdateGeneric();
                };
                ActuatorAbstract.prototype.getSignalId = function () {
                    return this.properties.signalId;
                };
                ActuatorAbstract.prototype.processUpdateGeneric = function () {
                    if (this.signalId != null && this.signalId != this.properties.signalId) {
                        SNAManager.getSNAManager().unSubscribe(this, this.signalId);
                        this.signalId = this.properties.signalId;
                        SNAManager.getSNAManager().subscribe(this, this.signalId);
                    }
                    else if (this.signalId == null) {
                        this.signalId = this.properties.signalId;
                        SNAManager.getSNAManager().subscribe(this, this.signalId);
                    }
                    this.processUpdateSpecific();
                };
                ActuatorAbstract.prototype.processUpdateSpecific = function () { };
                ActuatorAbstract.prototype.onActuateEnd = function () {
                    SNAManager.getSNAManager().emitSignal(this.properties.endSigId);
                    this.actuating = false;
                    if (this.queued > 0) {
                        this.queued--;
                        this.start();
                        return null;
                    }
                    if (this.properties.loop) {
                        this.start();
                        return null;
                    }
                    return null;
                };
                ActuatorAbstract.prototype.dispose = function () {
                    SNAManager.getSNAManager().unSubscribe(this, this.properties.signalId);
                    var actuators = this.mesh["actuators"];
                    if (actuators != null) {
                        this.stop();
                        var i = actuators.indexOf(this);
                        if (i != -1) {
                            actuators.splice(i, 1);
                        }
                    }
                    this.cleanUp();
                };
                ActuatorAbstract.prototype.cleanUp = function () { };
                return ActuatorAbstract;
            })();
            babylonjs.ActuatorAbstract = ActuatorAbstract;
            var ActuatorRotator = (function (_super) {
                __extends(ActuatorRotator, _super);
                function ActuatorRotator(mesh, parm) {
                    _super.call(this, mesh, parm);
                    Object.defineProperty(this, '__interfaces', { configurable: true, value: ["org.ssatguru.babylonjs.SensorActuator", "org.ssatguru.babylonjs.Actuator"] });
                }
                ActuatorRotator.prototype.actuate = function () {
                    var _this = this;
                    var properties = this.properties;
                    var cPos = this.mesh.rotationQuaternion.clone();
                    var nPos;
                    var rotX = Quaternion.RotationAxis(Axis.X, properties.x * Math.PI / 180);
                    var rotY = Quaternion.RotationAxis(Axis.Y, properties.y * Math.PI / 180);
                    var rotZ = Quaternion.RotationAxis(Axis.Z, properties.z * Math.PI / 180);
                    var abc = Quaternion.RotationYawPitchRoll(properties.y * Math.PI / 180, properties.x * Math.PI / 180, properties.z * Math.PI / 180);
                    if (properties.toggle) {
                        if (this.toggle) {
                            nPos = cPos.multiply(abc);
                        }
                        else {
                            nPos = cPos.multiply(Quaternion.Inverse(abc));
                        }
                    }
                    else
                        nPos = cPos.multiply(rotX).multiply(rotY).multiply(rotZ);
                    this.toggle = !this.toggle;
                    var cY = this.mesh.position.y;
                    var nY = this.mesh.position.y + 5;
                    this.a = Animation.CreateAndStartAnimation("rotate", this.mesh, "rotationQuaternion", 60, 60 * properties.duration, cPos, nPos, 0, null, function () { return _this.onActuateEnd(); });
                };
                ActuatorRotator.prototype.getName = function () {
                    return "Rotator";
                };
                ActuatorRotator.prototype.stop = function () {
                    this.a.stop();
                    this.onActuateEnd();
                };
                ActuatorRotator.prototype.cleanUp = function () {
                };
                ActuatorRotator.prototype.processUpdateSpecific = function () {
                    if (this.properties.autoStart) {
                        var started = this.start();
                    }
                };
                ActuatorRotator.prototype.isReady = function () {
                    return true;
                };
                return ActuatorRotator;
            })(ActuatorAbstract);
            babylonjs.ActuatorRotator = ActuatorRotator;
            var ActuatorMover = (function (_super) {
                __extends(ActuatorMover, _super);
                function ActuatorMover(mesh, parms) {
                    _super.call(this, mesh, parms);
                    Object.defineProperty(this, '__interfaces', { configurable: true, value: ["org.ssatguru.babylonjs.SensorActuator", "org.ssatguru.babylonjs.Actuator"] });
                }
                ActuatorMover.prototype.actuate = function () {
                    var _this = this;
                    var props = this.properties;
                    var cPos = this.mesh.position.clone();
                    var nPos;
                    var moveBy;
                    if (props.local) {
                        var meshMatrix = this.mesh.getWorldMatrix();
                        var localMove = new Vector3(props.x * (1 / this.mesh.scaling.x), props.y * (1 / this.mesh.scaling.y), props.z * (1 / this.mesh.scaling.z));
                        moveBy = Vector3.TransformCoordinates(localMove, meshMatrix).subtract(this.mesh.position);
                    }
                    else
                        moveBy = new Vector3(props.x, props.y, props.z);
                    if (props.toggle) {
                        if (this.toggle) {
                            nPos = cPos.add(moveBy);
                        }
                        else {
                            nPos = cPos.subtract(moveBy);
                        }
                        this.toggle = !this.toggle;
                    }
                    else {
                        nPos = cPos.add(moveBy);
                    }
                    this.a = Animation.CreateAndStartAnimation("move", this.mesh, "position", 60, 60 * props.duration, cPos, nPos, 0, null, function () { return _this.onActuateEnd(); });
                };
                ActuatorMover.prototype.getName = function () {
                    return "Mover";
                };
                ActuatorMover.prototype.stop = function () {
                    this.a.stop();
                    this.onActuateEnd();
                };
                ActuatorMover.prototype.cleanUp = function () {
                };
                ActuatorMover.prototype.processUpdateSpecific = function () {
                    if (this.properties.autoStart) {
                        var started = this.start();
                    }
                };
                ActuatorMover.prototype.isReady = function () {
                    return true;
                };
                return ActuatorMover;
            })(ActuatorAbstract);
            babylonjs.ActuatorMover = ActuatorMover;
            var ActuatorSound = (function (_super) {
                __extends(ActuatorSound, _super);
                function ActuatorSound(mesh, prop) {
                    _super.call(this, mesh, prop);
                    Object.defineProperty(this, '__interfaces', { configurable: true, value: ["org.ssatguru.babylonjs.SensorActuator", "org.ssatguru.babylonjs.Actuator"] });
                }
                ActuatorSound.prototype.actuate = function () {
                    this.sound.play();
                };
                ActuatorSound.prototype.processUpdateSpecific = function () {
                    var _this = this;
                    var properties = this.properties;
                    if (properties.soundFile.value == null)
                        return;
                    if (this.sound == null || properties.soundFile.value != this.sound.name) {
                        if (this.sound != null) {
                            this.stop();
                            this.sound.dispose();
                        }
                        this.ready = false;
                        this.sound = new Sound(properties.soundFile.value, "vishva/assets/sounds/" + properties.soundFile.value, this.mesh.getScene(), (function (properties) {
                            return function () {
                                _this.updateSound(properties);
                            };
                        })(properties));
                    }
                    else {
                        this.stop();
                        this.updateSound(properties);
                    }
                };
                ActuatorSound.prototype.updateSound = function (properties) {
                    var _this = this;
                    this.ready = true;
                    if (properties.attachToMesh) {
                        this.sound.attachToMesh(this.mesh);
                    }
                    this.sound.onended = function () { return _this.onActuateEnd(); };
                    this.sound.setVolume(properties.volume.value);
                    if (properties.autoStart) {
                        var started = this.start();
                        if (!started)
                            this.queued++;
                    }
                };
                ActuatorSound.prototype.getName = function () {
                    return "Sound";
                };
                ActuatorSound.prototype.stop = function () {
                    if (this.sound != null) {
                        if (this.sound.isPlaying) {
                            this.sound.stop();
                            this.onActuateEnd();
                        }
                    }
                };
                ActuatorSound.prototype.cleanUp = function () {
                };
                ActuatorSound.prototype.isReady = function () {
                    return this.ready;
                };
                return ActuatorSound;
            })(ActuatorAbstract);
            babylonjs.ActuatorSound = ActuatorSound;
            var SNAproperties = (function () {
                function SNAproperties() {
                    this.signalId = "0";
                }
                SNAproperties.prototype.unmarshall = function (obj) { return null; };
                return SNAproperties;
            })();
            babylonjs.SNAproperties = SNAproperties;
            var SenTouchProp = (function (_super) {
                __extends(SenTouchProp, _super);
                function SenTouchProp() {
                    _super.apply(this, arguments);
                }
                SenTouchProp.prototype.unmarshall = function (obj) {
                    return obj;
                };
                return SenTouchProp;
            })(SNAproperties);
            babylonjs.SenTouchProp = SenTouchProp;
            var ActProperties = (function (_super) {
                __extends(ActProperties, _super);
                function ActProperties() {
                    _super.apply(this, arguments);
                    this.autoStart = false;
                    this.loop = false;
                    this.toggle = true;
                    this.startSigId = "";
                    this.endSigId = "";
                }
                ActProperties.prototype.unmarshall = function (obj) { return null; };
                return ActProperties;
            })(SNAproperties);
            babylonjs.ActProperties = ActProperties;
            var ActRotatorParm = (function (_super) {
                __extends(ActRotatorParm, _super);
                function ActRotatorParm() {
                    _super.apply(this, arguments);
                    this.x = 0;
                    this.y = 90;
                    this.z = 0;
                    this.duration = 1;
                }
                ActRotatorParm.prototype.unmarshall = function (obj) {
                    return obj;
                };
                return ActRotatorParm;
            })(ActProperties);
            babylonjs.ActRotatorParm = ActRotatorParm;
            var ActMoverParm = (function (_super) {
                __extends(ActMoverParm, _super);
                function ActMoverParm() {
                    _super.apply(this, arguments);
                    this.x = 1;
                    this.y = 1;
                    this.z = 1;
                    this.duration = 1;
                    this.local = false;
                }
                ActMoverParm.prototype.unmarshall = function (obj) {
                    return obj;
                };
                return ActMoverParm;
            })(ActProperties);
            babylonjs.ActMoverParm = ActMoverParm;
            var ActSoundProp = (function (_super) {
                __extends(ActSoundProp, _super);
                function ActSoundProp() {
                    _super.apply(this, arguments);
                    this.soundFile = new babylonjs.SelectType();
                    this.attachToMesh = false;
                    this.volume = new babylonjs.Range(0.0, 1.0, 1.0, 0.1);
                }
                ActSoundProp.prototype.unmarshall = function (obj) {
                    var inObj = obj;
                    var out = this;
                    out.attachToMesh = inObj.attachToMesh;
                    out.autoStart = inObj.autoStart;
                    out.loop = inObj.loop;
                    out.signalId = inObj.signalId;
                    out.endSigId = inObj.endSigId;
                    out.startSigId = inObj.startSigId;
                    out.toggle = inObj.toggle;
                    out.soundFile.value = inObj.soundFile.value;
                    out.soundFile.values = inObj.soundFile.values;
                    out.volume.max = inObj.volume.max;
                    out.volume.min = out.volume.min;
                    out.volume.value = inObj.volume.value;
                    out.volume.step = inObj.volume.step;
                    return out;
                };
                return ActSoundProp;
            })(ActProperties);
            babylonjs.ActSoundProp = ActSoundProp;
        })(babylonjs = ssatguru.babylonjs || (ssatguru.babylonjs = {}));
    })(ssatguru = org.ssatguru || (org.ssatguru = {}));
})(org || (org = {}));