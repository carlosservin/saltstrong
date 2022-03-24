let gpsMain= 
{   
    originCoords :
        {
            lat:0,
            lng: 0
        },
    currentCoords :
        {
            lat:0,
            lng: 0
        },
        pose: "",
        _onDeviceOrientation : "",
        heading : "",
        
        /* 
        test coordinates mi casa
        */
       
        testCoordinates: [
            {lat:19.359886, lng: -98.980933},//avind-hora
            {lat:19.359337, lng:-98.980989}, //avind-pueb
            {lat:19.359141, lng:-98.979514}, //avsim-pueb
            {lat:19.359719, lng: -98.979399}], //avsim-hora
            // {lat:19.359891, lng:-98.980932},
            // {lat:19.359904, lng:-98.980599}],
          
           
        testCoordinates1:[   {"lat":27.4995,"lng":-82.556286},
                            {"lat":27.499451,"lng":-82.556323},
                            {"lat":27.49934,"lng":-82.556339},
                            {"lat":27.499279,"lng":-82.556341},
                            {"lat":27.499276,"lng":-82.556388},
                            {"lat":27.499306,"lng":-82.556427},
                            {"lat":27.499476,"lng":-82.556384},
                            {"lat":27.499545,"lng":-82.556325}],
        
        testCoordinates2:[  {"lat":27.499668,"lng":-82.556634},
                            {"lat":27.499621,"lng":-82.556744},
                            {"lat":27.499523,"lng":-82.556771},
                            {"lat":27.499481,"lng":-82.556701},
                            {"lat":27.499533,"lng":-82.556579},
                            {"lat":27.499628,"lng":-82.556555}],

        
    SetCameraGps: function ()
    {
            if (navigator.geolocation) {
                //navigator.geolocation.watchPosition(showPosition);
                navigator.geolocation.getCurrentPosition(function (position)
                {
                    gpsMain.originCoords.lat = position.coords.latitude;
                    gpsMain.originCoords.lng = position.coords.longitude;
                });
                navigator.geolocation.watchPosition((position)=>
                {
                    gpsMain.currentCoords.lat = position.coords.latitude;
                    gpsMain.currentCoords.lng = position.coords.longitude;
                    document.getElementById("Test").innerHTML =("your lat: "+position.coords.latitude + "lng: "+  position.coords.longitude)
                })
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
        }
        var eventName = this._getDeviceOrientationEventName();
        gpsMain._onDeviceOrientation = gpsMain._onDeviceOrientation.bind(this);
        window.addEventListener(eventName, gpsMain._onDeviceOrientation, false);
        console.log(gpsMain._onDeviceOrientation)
    },


    checkCalibrado :false,
    poligonosCreados : false,
    i:0.0, // borrar
    updateRotation(transform)
    {
        var heading =360- gpsMain.heading;
        gpsMain.cubeRF.lookAt(transform.position.x, gpsMain.cubeRF.position.y,transform.position.z)
        gpsMain.cubeRF.position.set(gpsMain.pose.transform.position.x,gpsMain.cubeRF.position.y,gpsMain.pose.transform.position.z)
        
        var camaraRotationY =gpsMain.toAngle(gpsMain.angleMagnitude(gpsMain.cubeRF.quaternion).y)
        camaraRotationY = gpsMain.normalizeAngle0_360(camaraRotationY)
        
        let difHeading = gpsMain.angulo180(gpsMain.heading)
        let difCamara = (camaraRotationY) //eje z
        let dif = difCamara +difHeading
        
        // document.getElementById("Test").innerHTML = difHeading
        // document.getElementById("Test2").innerHTML = difCamara
        // document.getElementById("Test3").innerHTML = dif
        if (!gpsMain.checkCalibrado)
        {
            gpsMain.pivote.rotation.set(0,(dif)* Math.PI/180,0)
            gpsMain.pivote.position.set(gpsMain.pose.transform.position.x,gpsMain.pivote.position.y,gpsMain.pose.transform.position.z)         
        }else
        {

        }
    },
    angulo180(x)
    {
        if (x<180)
        {
            return x
        }else
        {
            return x-360
        }
    },
    /**
     * Axis with angle magnitude (radians) [x, y, z]
     * @param {q} quaternion 
     * @returns vector 3
     */
    angleMagnitude:function(quaternion)
    {
        let q = quaternion.clone();
        let angle = 2 * Math.acos(quaternion.w);
        var axis = [0, 0, 0];
        if (1 - (q.w * q.w) < 0.000001)
        {
            axis[0] = q.x;
            axis[1] = q.y;
            axis[2] = q.z;
        }
        else
        {
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/
            var s = Math.sqrt(1 - (q.w * q.w));
            axis[0] = q.x / s;
            axis[1] = q.y / s;
            axis[2] = q.z / s;
        }
        return new THREE.Vector3(axis[0]*angle,axis[1]*angle,axis[2]*angle)
    },
    /**
     * 
     * @param {radians} x 
     * @returns Angle
     */
    toAngle: function(x)
    {
        return x * 180 / Math.PI;
    },
    cubeRF : "",
    pivote :"",
    crearcuboReferencia(scene)
    {
        /**
         * plane Compass
         */
         const geometry = new THREE.PlaneGeometry( .2, .2 );
         const texture =new THREE.TextureLoader().load( 'Texture/north.png' );
         const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, map:texture, transparent:true} );
         const plane = new THREE.Mesh( geometry, material );
         plane.position.set(00,-1,0)
         plane.rotation.set(1.5708,1.5708*2,0);
         
        //
        // const geometry = new THREE.BoxGeometry( .1, .1, .8 );
        // const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        // const cube = new THREE.Mesh( geometry, material );
        // cube. position.set(0,-1.5,0);
        // //cube.visible = false;
        // //scene.add(cube)
        const referencia = new THREE.Object3D();
        //referencia.add(plane)
        gpsMain.cubeRF = referencia;
        scene.add(referencia)


        // //2
        // const geometry2 = new THREE.BoxGeometry( .15, .15, .15 );
        // const material2 = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        // const cube2 = new THREE.Mesh( geometry2, material2 );
        // cube2.position.set(0,0,.4)
        // cube.add(cube2);
        // //gpsMain.pivote =  cube.clone();
        gpsMain.pivote = new THREE.Object3D();
        gpsMain.pivote.add(plane)
        scene.add(gpsMain.pivote);
        //gpsMain.pivote.materials[0].color = 0xffffff
    },
    
    normalizeAngle0_360(angle){
        if (angle<0)
        {
            while(angle<0)
            {
                angle+= 360
            }
        }else if (angle>= 360)
        {
            while (angle>=360)
            {
                angle-= 360;
            }
        }
        return angle;
    },

    _loadVertexPolygon:function(reticle)
    {
        console.log(reticle);
        console.log(gpsMain.pivote)
        gpsMain.pivote.position.set(gpsMain.pivote.position.x,reticle.position.y,gpsMain.pivote.position.z);
         gpsMain._getVertexPolygon({"lat":27.4866521,"lng":-82.4035506})
        //gpsMain._getVertexPolygon({"lat":gpsMain.currentCoords.lat,"lng":gpsMain.currentCoords.lng})
    },
    
    /*
       get
    */
   _getVertexPolygon:function(_position)
   {
        const params = 
        {
            key : '8542e207809d040319d4ba71dd4fec9f93fa83ce524d93d27e0738bf8807d130',
            for : 'sumeru',
            lat : _position.lat,
            lng: _position.lng,
            dist_miles: '.126',
            url:'https://community.saltstrong.com/api/get_polygons.php?'
        };


        const url = `${params.url}&key=${params.key}&for=${params.for}&lat=${params.lat}&lng=${params.lng}`;
        console.log(url)
        fetch(url)
        .then(res=>{
            console.log(res)
            res.json()
            .then(data=>
                {
                    console.log(data.result)
                    if (data.result != "No record found")
                    {
                    //let polygons = JSON.parse( data.result)
                    //console.log(data.result.length)

                    let polygon =data.result

                        for(let i = 0; i<polygon.length;i++)
                        {
                            let grupo = JSON.parse(polygon[i].PolygonCoords);
                            for (let j = 0; j<grupo.length; j++)
                            {
                                gpsMain.createPolygon(_position,grupo[j],polygon[i].color)
                                //console.log (grupo[j]);

                            }
                            
                        }
                    //console.log(polygons)
                    }else
                    {
                        document.getElementById("Test").innerHTML = "no polygon";
                    }

                    
                })
        })
   },
   /**
     * 
     * @param {Array[json]} dstcoordinates 
     */
    createPolygon(originCoords,dstcoordinates, color)
    {
        let clon = ""
        //console.log(dstcoordinates);
       const areaPts = [];
       for (let i = 0;i<dstcoordinates.length; i++)
        {
           areaPts.push(gpsMain.coordinateToVirtualSpace(originCoords,dstcoordinates[i]));
        };
        const areaShape =new THREE.Shape( areaPts );
        gpsMain.addShape(areaShape,color,gpsMain.pivote );  

    },       
 
    addShape:function(shape,color,parent)
    {


        // flat shape
        let geometry = new THREE.ShapeGeometry( shape );
        let mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color, side: THREE.DoubleSide, transparent:true, opacity:.45 } ) );

        mesh.position.set( 0, 0, 0 );
        mesh.rotation.set(1.5708,0,0);
       
        parent.add(mesh)
        //line
        shape.autoClose = true;
        const points = shape.getPoints();
        const geometryPoints = new THREE.BufferGeometry().setFromPoints( points );

        let line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial( { color: color,linewidth:20 } ) );
	    mesh.add( line );

    },

    /**
     * 
     * @param {Json lng,lat } dstCoords 
     * @returns {vector2  X, Z}
     */
    coordinateToVirtualSpace(originCoords,dstCoords)
    {
        
        let x,z;
        //z = lat
        z = gpsMain.computeDistanceMeters({lng:0 , lat: originCoords.lat},{lng:0, lat:dstCoords.lat})
        z *= originCoords.lat> dstCoords.lat ? -1:1
        //x = lng
        x = gpsMain.computeDistanceMeters({lng:originCoords.lng, lat:0}, {lng:dstCoords.lng,lat:0})
        x *= originCoords.lng>dstCoords.lng ? 1:-1;
        console.log("Distance:"+gpsMain.computeDistanceMeters(originCoords,dstCoords) )
        return new THREE.Vector2(x,z)
    },
    

    createLitScene() {
        const scene = new THREE.Scene();
    
        // The materials will render as a black mesh
        // without lights in our scenes. Let's add an ambient light
        // so our material can be visible, as well as a directional light
        // for the shadow.
        const light = new THREE.AmbientLight(0xffffff, 1);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(10, 15, 10);
    
        // We want this light to cast shadow.
        directionalLight.castShadow = true;
    
        // Make a large plane to receive our shadows
        const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
        // Rotate our plane to be parallel to the floor
        planeGeometry.rotateX(-Math.PI / 2);
    
        // Create a mesh with a shadow material, resulting in a mesh
        // that only renders shadows once we flip the `receiveShadow` property.
        const shadowMesh = new THREE.Mesh(planeGeometry, new THREE.ShadowMaterial({
          color: 0x111111,
          opacity: 0.2,
        }));
    
        // Give it a name so we can reference it later, and set `receiveShadow`
        // to true so that it can render our model's shadow.
        shadowMesh.name = 'shadowMesh';
        shadowMesh.receiveShadow = true;
        shadowMesh.position.y = 10000;
    
        // Add lights and shadow material to scene.
        scene.add(shadowMesh);
        scene.add(light);
        scene.add(directionalLight);
    
        return scene;
      },
          /*
        Distance in meters from coordinate
     */
    computeDistanceMeters: function (src, dest) {
        var dlng = THREE.Math.degToRad(dest.lng - src.lng);
        var dlat = THREE.Math.degToRad(dest.lat - src.lat);

        var a = (Math.sin(dlat / 2) * Math.sin(dlat / 2)) + Math.cos(THREE.Math.degToRad(src.lat)) * Math.cos(THREE.Math.degToRad(dest.lat)) * (Math.sin(dlng / 2) * Math.sin(dlng / 2));
        var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var distance = angle * 6378160;


        return distance;
    },
      /**
     * Compute compass heading.
     *
     * @param {number} alpha
     * @param {number} beta
     * @param {number} gamma
     *
     * @returns {number} compass heading
     */
    _computeCompassHeading: function (alpha, beta, gamma) {

        // Convert degrees to radians
        var alphaRad = alpha * (Math.PI / 180);
        var betaRad = beta * (Math.PI / 180);
        var gammaRad = gamma * (Math.PI / 180);

        // Calculate equation components
        var cA = Math.cos(alphaRad);
        var sA = Math.sin(alphaRad);
        var sB = Math.sin(betaRad);
        var cG = Math.cos(gammaRad);
        var sG = Math.sin(gammaRad);

        // Calculate A, B, C rotation components
        var rA = - cA * sG - sA * sB * cG;
        var rB = - sA * sG + cA * sB * cG;

        // Calculate compass heading
        var compassHeading = Math.atan(rA / rB);

        // Convert from half unit circle to whole unit circle
        if (rB < 0) {
            compassHeading += Math.PI;
        } else if (rA < 0) {
            compassHeading += 2 * Math.PI;
        }

        // Convert radians to degrees
        compassHeading *= 180 / Math.PI;

        return compassHeading;
    },
          /**
     * Handler for device orientation event.
     *
     * @param {Event} event
     * @returns {void}
     */
    _onDeviceOrientation: function (event) {
        if (event.webkitCompassHeading !== undefined) {
            if (event.webkitCompassAccuracy < 50) {
                gpsMain.heading = event.webkitCompassHeading;
            } else {
                console.warn('webkitCompassAccuracy is event.webkitCompassAccuracy');
            }
        } else if (event.alpha !== null) {
            if (event.absolute === true || event.absolute === undefined) {
                gpsMain.heading = gpsMain._computeCompassHeading(event.alpha, event.beta, event.gamma);
                // console.log("heading " +gpsMain.heading)
                // document.getElementById("Test").innerHTML = gpsMain.heading;
            } else {
                console.warn('event.absolute === false');
            }
        } else {
            console.warn('event.alpha === null');
        }
    },
          /**
     * Get device orientation event name, depends on browser implementation.
     * @returns {string} event name
     */
    _getDeviceOrientationEventName: function () {
        if ('ondeviceorientationabsolute' in window) {
            var eventName = 'deviceorientationabsolute'
        } else if ('ondeviceorientation' in window) {
            var eventName = 'deviceorientation'
        } else {
            var eventName = ''
            console.error('Compass not supported')
        }

        return eventName
    }
   
}
