// reference: https://medium.com/@PavelLaptev/three-js-for-beginers-32ce451aabda

var scene, renderer, camera, controls, cube, circle, mouseX=0, mouseY=0, materials=[], parameters;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();
function init(){
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 7;
    camera.position.y = 3;
    

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );
    // scene.position.set(0,2,0);
    // Renderer
    var container = document.querySelector('.canvas-container');
    renderer = new THREE.WebGLRenderer({antialias:true});
    // renderer.shadowMapEnabled = true;
    // renderer.shadowMapSoft = true;
    // renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x757575);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild(renderer.domElement);
    // camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
    // camera.position.z = 1000;

    // scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );

    // camera.position.y = 5;
    // scene.add(camera)
    
    // ORBIT CONTROLS
    controls = new THREE.OrbitControls( camera, renderer.domElement);
    // controls.enableZoom = false;
            
    //LIGHTNING
    //first point light
    var light = new THREE.PointLight( 0x757575, 4, 200 );
    light.position.set( 50, 50, 20 );
    light.castShadow = true;
    scene.add( light )
    // let controls = new OrbitControls(camera);
    
    // white spotlight shining from the side, casting a shadow

    // var spotLight = new THREE.SpotLight( 0xffffff );
    // spotLight.position.set( 1, 1, 1 );

    // spotLight.castShadow = true;

    // spotLight.shadow.mapSize.width = 1024;
    // spotLight.shadow.mapSize.height = 1024;

    // spotLight.shadow.camera.near = 500;
    // spotLight.shadow.camera.far = 4000;
    // spotLight.shadow.camera.fov = 30;

    // scene.add( spotLight );

    // White directional light at half intensity shining from the top.
    var light = new THREE.PointLight( 0xeeeeee, 1, 100 );
    light.position.set( -50, 50, 50 );
    light.castShadow = true;
    scene.add( light );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );

    // var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    // scene.add( light );

    var light2 = new THREE.AmbientLight( 0x20202A, 6, 100 );
    light2.position.set( 10, 10, 10 );
    scene.add( light2 );

    // var light2 = new THREE.AmbientLight( 0x424242, 6, 100 );
    // light2.position.set( 50, 50, 50 );
    // scene.add( light2 );
    
    //OBJECTS
    //here we add objects by functions which we will write below
    // loadModels();
    // createDiamond();
    // createSpace();
    
    
    circle = new THREE.Mesh( new THREE.CircleGeometry( 7, 32 ),  new THREE.MeshLambertMaterial ({
		color: 0xEEEEEE,
		shading:THREE.FlatShading
    }));
    // circle.position.set(0,0,-1);
    circle.rotation.x = - Math.PI / 2;
    // scene.add( circle );
    circle.castShadow = true;
    circle.receiveShadow = true;
    scene.add( circle );

    // var plane = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10, 32, 32 ), new THREE.MeshLambertMaterial ({
	// 	color: 0x757575,
	// 	shading:THREE.FlatShading
    // }));
    // plane.rotation.x = - Math.PI / 2;
    // plane.castShadow = true;
    // plane.receiveShadow = true;
    // scene.add( plane );


    // //Create a sphere that cast shadows (but does not receive them)
    // var sphereGeometry = new THREE.SphereBufferGeometry( 1, 32, 32 );
    // var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
    // var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    // sphere.castShadow = true; //default is false
    // sphere.receiveShadow = false; //default
    // // sphere.position.y = 2;
    // scene.add( sphere );


    var geometry = new THREE.BufferGeometry();
    var vertices = [];

    var textureLoader = new THREE.TextureLoader();

    var sprite1 = textureLoader.load( '/assets/images/textures/snowflake1.png' );
    var sprite2 = textureLoader.load( '/assets/images/textures/snowflake2.png' );
    var sprite3 = textureLoader.load( '/assets/images/textures/snowflake3.png' );
    var sprite4 = textureLoader.load( '/assets/images/textures/snowflake4.png' );
    var sprite5 = textureLoader.load( '/assets/images/textures/snowflake5.png' );

    for ( var i = 0; i < 3000; i ++ ) {

        var x = Math.random() * 20 - 10;
        var y = Math.random() * 20 - 10;
        var z = Math.random() * 20 - 10;

        vertices.push( x, y, z );

    }

    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    parameters = [
        [[ 1.0, 0.2, 0.5 ], sprite2, 20/100 ],
        [[ 0.95, 0.1, 0.5 ], sprite3, 15/100 ],
        [[ 0.90, 0.05, 0.5 ], sprite1, 10/100 ],
        [[ 0.85, 0, 0.5 ], sprite5, 8/100 ],
        [[ 0.80, 0, 0.5 ], sprite4, 5/100 ]
    ];

    for ( var i = 0; i < parameters.length; i ++ ) {

        var color = parameters[ i ][ 0 ];
        var sprite = parameters[ i ][ 1 ];
        var size = parameters[ i ][ 2 ];

        materials[ i ] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );
        materials[ i ].color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ] );

        var particles = new THREE.Points( geometry, materials[ i ] );

        particles.rotation.x = Math.random() * 6;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;

        scene.add( particles );

    }

    loadModels();
    


    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false );
    
}
function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
	requestAnimationFrame( animate );
    controls.update();
    render();
}
function render() {

    var time = Date.now() * 0.00005;
    // console.log(mouseX/window.innerWidth, mouseY/window.innerHeight)
    camera.position.x += (10*mouseX/window.innerWidth - camera.position.x ) * (0.05);
    camera.position.y += (10*mouseY/window.innerHeight - (camera.position.y)) * 0.05;
    if (camera.position.y<=1.0){
        camera.position.y=1.0;
    }
    camera.lookAt( scene.position.clone().add(new THREE.Vector3(0,2,0)) );

    for ( var i = 0; i < scene.children.length; i ++ ) {

        var object = scene.children[ i ];

        if ( object instanceof THREE.Points ) {

            object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );

        }

    }

    for ( var i = 0; i < materials.length; i ++ ) {

        var color = parameters[ i ][ 0 ];

        var h = ( 360 * ( color[ 0 ] + time ) % 360 ) / 360;
        materials[ i ].color.setHSL( h, color[ 1 ], color[ 2 ] );

    }

    renderer.render( scene, camera );

}

function loadModels() {
            // scene.traverse( function( node ) {

        //     if ( node instanceof THREE.Mesh ) {
        //         node.castShadow = true;
        //         node.receiveShadow = true;
        
        //     }
        
        // } );

    var loader = new THREE.GLTFLoader();
    // loader.setPath( 'assets/files/models/tree/' );
    // loader.load( 'model.gltf', gltf=>{
    //     scene.add( gltf.scene);
    //     gltf.scene.position.set(1,-2,-1);
    //     gltf.scene.scale.set(2,2,2)
    // }, undefined, 
    //     error=>console.error( error ));

    loader.setPath( 'assets/files/models/penguin/' );
    loader.load( 'model.gltf', gltf=>{
        scene.add( gltf.scene);
        gltf.scene.traverse( function( node ) {
            if ( node instanceof THREE.Mesh ) {
                node.rotation.y=-Math.PI/4;
                // node.position.set(2,-1.5,3);
                node.position.set(-0.3,-1.5,2);
                // node.scale.set(1.2,1.2,1.2);
            }

        });
    }, undefined, 
        error=>console.error( error ));

    loader.setPath( 'assets/files/models/tree2/' );
        loader.load( 'model.gltf', gltf=>{
            scene.add( gltf.scene);
            gltf.scene.scale.set(4.5,4.5,4.5)
            gltf.scene.position.set(6,-4.8,-2);
        }, undefined, 
            error=>console.error( error ));
    loader.setPath( 'assets/files/models/cabin/' );
    loader.load( 'model.gltf', gltf=>{
        scene.add( gltf.scene);
        
        gltf.scene.traverse( function( node ) {
            if ( node instanceof THREE.Mesh ) {
                node.rotation.y=-Math.PI/4;
                node.position.set(-4,0,1.0);
                node.scale.set(2,2,2);
            }

        });
    }, undefined, 
        error=>console.error( error ));


    loader.setPath( 'assets/files/models/sleigh/' );
    loader.load( 'model.gltf', gltf=>{
        scene.add( gltf.scene);
        gltf.scene.traverse( function( node ) {
            if ( node instanceof THREE.Mesh ) {
                node.castShadow = true;
                node.rotation.y =Math.PI/4;
                gltf.scene.position.set(3.5,-1,2);
                gltf.scene.scale.set(1.5,1.5,1.5)
            }
 
        });
        
    }, undefined, 
        error=>console.error( error ));

    loader.setPath( 'assets/files/models/snowman/' );
    loader.load( 'model.gltf', gltf=>{
        scene.add( gltf.scene);
        gltf.scene.traverse( function( node ) {
            if ( node instanceof THREE.Mesh ) {
                node.castShadow = true;
                node.rotation.y = -Math.PI/2;
                node.position.set(1.2,2,1);
                gltf.scene.scale.set(2,2,2)
            }
 
        });
        
    }, undefined, 
        error=>console.error( error ));
    
    loader.setPath( 'assets/files/models/santa/' );
    loader.load( 'model.gltf', gltf=>{
        
        scene.add( gltf.scene);
        gltf.scene.traverse( function( node ) {
            
            if ( node instanceof THREE.Mesh ) {
                node.castShadow = true;
                node.receiveShadow = true;
                node.rotation.y = -Math.PI/4;
                gltf.scene.position.set(0.3,-1.0,3.2);
                // let lambert = new THREE.MeshLambertMaterial ({
                // 	color: 0xEEEEEE,
                // 	shading:THREE.FlatShading
                // });
            }
        });
    }, undefined, 
        error=>console.error( error ));
}


function onDocumentMouseMove(event){
    mouseX = event.clientX - window.innerWidth/2;
    mouseY = event.clientY - window.innerHeight/2;

}