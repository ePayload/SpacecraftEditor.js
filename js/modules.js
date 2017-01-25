materials = {
  "default": {
    diffuse: "atlas_diffuse.jpg",
    specular: "atlas_specular.png",
    normal: "atlas_normal.jpg",
    illumination: "atlas_selfillumination.jpg"
  },
  "diamond": {
    diffuse: "atlas_diffuse.jpg",
    specular: "atlas_specular.png",
    normal: "atlas_normal.jpg",
    diffuse_color: new THREE.Vector3(3, 3, 3),
    specular_color: new THREE.Vector3(0.2, 0.2, 0.2)
  },
  "silver": {
    diffuse: "atlas_diffuse.jpg",
    specular: "atlas_specular.png",
    normal: "atlas_normal.jpg",
    diffuse_color: new THREE.Vector3(0.2, 0.2, 0.2),
    specular_color: new THREE.Vector3(2, 2, 2)
  },
  "gold": {
    diffuse: "atlas_diffuse.jpg",
    specular: "atlas_specular.png",
    normal: "atlas_normal.jpg",
    diffuse_color: new THREE.Vector3(0.3, 0.2, 0),
    specular_color: new THREE.Vector3(3, 2, 0)
  },
  "empty_frames": {
    diffuse: "empty_frame_diffuse.png",
    specular: "empty_frame_specular.png",
    normal: "empty_frame_normal.jpg"
  },
  "hyper_ring": {
    diffuse: "hyper_ring_diff.jpg",
    specular: "hyper_ring_spec.png",
    normal: "hyper_ring_norm.jpg",
    illumination: "hyper_ring_emis.jpg"
  },
  "hyper_ring_thick": {
    diffuse: "thick_hyper_ring_diff.jpg",
    specular: "thick_hyper_ring_spec.png",
    normal: "thick_hyper_ring_norm.jpg",
    illumination: "thick_hyper_ring_emis.jpg"
  }
}

// List of main frames
main_frames = {
  "main_frame_base": {
    model: "frame6_roll.obj",
    //model: "sb/siege.obj",
    material: "default",
    mass: 3 * 2 * 2, // tn
    strength: 0.3 * 20000000, // tn
    rollovers: {
      "3": "frame6_roll_x3.obj",
      "9": "frame6_roll_x9.obj"
    }
  },
  "main_frame_empty": {
    model: "frame6_empty.obj",
    //model: "sb/habbitat.obj",
    material: "empty_frames",
    mass: 3 * 2, // tn 40 m^3 * 2 gr / cm^3
    strength: 0.3 * 20000000, // tn = 4 m^2 * 200 GPa / 10N / 1000kg
    rollovers: {
      "3": "frame6_empty_x3.obj",
      "9": "frame6_empty_x9.obj"
    }
  }
}

// List of secondary frames
sec_frames = {
  "sec_frame_base": {
    model: "frame4.obj",
    material: "default",
    mass: 2 * 2 * 2,
    strength: 0.2 * 20000000
  },
  "sec_frame_empty": {
    model: "frame4_empty.obj",
    material: "empty_frames",
    mass: 2 * 2,
    strength: 0.2 * 20000000
  }
}

// List of shields
shields = {
  "shield_base": {
    model: "shild_plate.obj",
    material: "default",
    mass: 1 * 1 + 1 * 2
  },
  "shield_diamond": {
    model: "shild_plate.obj",
    material: "diamond",
    mass: 1 * 1 + 1 * 3.5
  },
  "shield_silver": {
    model: "shild_plate.obj",
    material: "silver",
    mass: 1 * 1 + 1 * 2.5
  },
  "shield_gold": {
    model: "shild_plate.obj",
    material: "gold",
    mass: 1 * 1 + 1 * 3
  }
}

// Modules list
modules = {
  "hyper_ring_thick_1" : {
    "name" : "Thick Ring Hyper drive",
    "model" : "thick_hyper_ring_1.obj",
    material : "hyper_ring_thick",
    "category" : "hyper_ring_thick",
    "attachment" : [[3, 0, 0, 3], [1, 3, 0, 4], [-2, 3, 0, 5], [-3, 0, 0, 0], [-2, -3, 0, 1], [1, -3, 0, 2]],
    mass: 200
  },
  "hyper_ring_thick_2" : {
    "name" : "Thick Ring Hyper drive",
    "model" : "thick_hyper_ring_2.obj",
    material : "hyper_ring_thick",
    "category" : "hyper_ring_thick",
    "attachment" : [[6, 0, 0, 3], [3, 6, 0, 4], [-3, 6, 0, 5], [-6, 0, 0, 0], [-3, -6, 0, 1], [3, -6, 0, 2]],
    mass: 1600
  },
  "hyper_ring_thick_3" : {
    "name" : "Thick Ring Hyper drive",
    "model" : "thick_hyper_ring_3.obj",
    material : "hyper_ring_thick",
    "category" : "hyper_ring_thick",
    "attachment" : [[9, 0, 0, 3], [4, 9, 0, 4], [-5, 9, 0, 5], [-9, 0, 0, 0], [-5, -9, 0, 1], [4, -9, 0, 2]],
    mass: 5400
  },
  "hyper_ring_thick_4" : {
    "name" : "Thick Ring Hyper drive",
    "model" : "thick_hyper_ring_4.obj",
    material : "hyper_ring_thick",
    "category" : "hyper_ring_thick",
    "attachment" : [[12, 0, 0, 3], [6, 12, 0, 4], [-6, 12, 0, 5], [-12, 0, 0, 0], [-6, -12, 0, 1], [6, -12, 0, 2]],
    mass: 12800
  },
  "hyper_ring_thick_5" : {
    "name" : "Thick Ring Hyper drive",
    "model" : "thick_hyper_ring_5.obj",
    material : "hyper_ring_thick",
    "category" : "hyper_ring_thick",
    "attachment" : [[18, 0, 0, 3], [9, 18, 0, 4], [-9, 18, 0, 5], [-18, 0, 0, 0], [-9, -18, 0, 1], [9, -18, 0, 2]],
    mass: 43200
  },
  "hyper_ring_thick_6" : {
    "name" : "Thick Ring Hyper drive",
    "model" : "thick_hyper_ring_6.obj",
    material : "hyper_ring_thick",
    "category" : "hyper_ring_thick",
    "attachment" : [[24, 0, 0, 3], [12, 24, 0, 4], [-12, 24, 0, 5], [-24, 0, 0, 0], [-12, -24, 0, 1], [12, -24, 0, 2]],
    mass: 102400
  },
  "hyper_ring_1" : {
    "name" : "Ring Hyper drive",
    "model" : "hyper_ring_1.obj",
    material : "hyper_ring",
    "category" : "hyper_ring",
    "attachment" : [[3, 0, 0, 3], [1, 3, 0, 4], [-2, 3, 0, 5], [-3, 0, 0, 0], [-2, -3, 0, 1], [1, -3, 0, 2]],
    mass: 200
  },
  "hyper_ring_2" : {
    "name" : "Ring Hyper drive",
    "model" : "hyper_ring_2.obj",
    material : "hyper_ring",
    "category" : "hyper_ring",
    "attachment" : [[6, 0, 0, 3], [3, 6, 0, 4], [-3, 6, 0, 5], [-6, 0, 0, 0], [-3, -6, 0, 1], [3, -6, 0, 2]],
    mass: 1600
  },
  "hyper_ring_3" : {
    "name" : "Ring Hyper drive",
    "model" : "hyper_ring_3.obj",
    material : "hyper_ring",
    "category" : "hyper_ring",
    "attachment" : [[9, 0, 0, 3], [4, 9, 0, 4], [-5, 9, 0, 5], [-9, 0, 0, 0], [-5, -9, 0, 1], [4, -9, 0, 2]],
    mass: 5400
  },
  "hyper_ring_4" : {
    "name" : "Ring Hyper drive",
    "model" : "hyper_ring_4.obj",
    material : "hyper_ring",
    "category" : "hyper_ring",
    "attachment" : [[12, 0, 0, 3], [6, 12, 0, 4], [-6, 12, 0, 5], [-12, 0, 0, 0], [-6, -12, 0, 1], [6, -12, 0, 2]],
    mass: 12800
  },
  "hyper_ring_5" : {
    "name" : "Ring Hyper drive",
    "model" : "hyper_ring_5.obj",
    material : "hyper_ring",
    "category" : "hyper_ring",
    "attachment" : [[18, 0, 0, 3], [9, 18, 0, 4], [-9, 18, 0, 5], [-18, 0, 0, 0], [-9, -18, 0, 1], [9, -18, 0, 2]],
    mass: 43200
  },
  "hyper_ring_6" : {
    "name" : "Ring Hyper drive",
    "model" : "hyper_ring_6.obj",
    material : "hyper_ring",
    "category" : "hyper_ring",
    "attachment" : [[24, 0, 0, 3], [12, 24, 0, 4], [-12, 24, 0, 5], [-24, 0, 0, 0], [-12, -24, 0, 1], [12, -24, 0, 2]],
    mass: 102400
  },
  "linear_nf_engine" : {
    "name" : "Linear nuclear fusion engine",
    "model" : "linear_nf_engine.obj",
    //model: "sb/idle.obj",
    "category" : "engines",
    material : "default",
    "attachment" : [
      [1, 0, 5, 0], [1, 0, 6, 0], [1, 0, -5, 0], [1, 0, -6, 0],
      [-1, 0, 5, 3], [-1, 0, 6, 3], [-1, 0, -5, 3], [-1, 0, -6, 3],
      [0, 1, 5, 1], [0, 1, 6, 1], [0, 1, -5, 1], [0, 1, -6, 1],
      [0, -1, 5, 5], [0, -1, 6, 5], [0, -1, -5, 5], [0, -1, -6, 5],
      [-1, 1, 5, 2], [-1, 1, 6, 2], [-1, 1, -5, 2], [-1, 1, -6, 2],
      [-1, -1, 5, 4], [-1, -1, 6, 4], [-1, -1, -5, 4], [-1, -1, -6, 4]
    ],
    mass: 2000,
    MainEngines: 600000
  },
  "linear_nf_engine_2sided" : {
    "name" : "2-sided linear nuclear fusion engine",
    "model" : "linear_nf_engine_2sided.obj",
    //model: "sb/marching.obj",
    "category" : "engines",
    material : "default",
    "attachment" : [
      [1, 0, 5, 0], [1, 0, 6, 0], [1, 0, -5, 0], [1, 0, -6, 0],
      [-1, 0, 5, 3], [-1, 0, 6, 3], [-1, 0, -5, 3], [-1, 0, -6, 3],
      [0, 1, 5, 1], [0, 1, 6, 1], [0, 1, -5, 1], [0, 1, -6, 1],
      [0, -1, 5, 5], [0, -1, 6, 5], [0, -1, -5, 5], [0, -1, -6, 5],
      [-1, 1, 5, 2], [-1, 1, 6, 2], [-1, 1, -5, 2], [-1, 1, -6, 2],
      [-1, -1, 5, 4], [-1, -1, 6, 4], [-1, -1, -5, 4], [-1, -1, -6, 4]
    ],
    mass: 2000,
    MainEngines: 600000,
    RetroEngines: 600000
  },
  "shunting_engine" : {
    "name" : "Shunting engine",
    "model" : "shunting_engine.obj",
    material : "default",
    "attachment" : [[0, 0, 0, 0]],
    "multiple" : true,
    mass: 5 * 2,
    CorrEngines: 5000
  },
  "thruster" : {
    "name" : "Thruster",
    "model" : "thruster.obj",
    material : "default",
    "attachment" : [[0, 0, 0, 0]],
    "multiple" : true,
    mass: 5 * 2,
    CorrEngines: 5000
  },
  "antenna" : {
    "name" : "Communication and navigation module",
    "model" : "antenna.obj",
    material : "default",
    "attachment" : [[0, 0, 0, 0]],
    "multiple" : true,
    mass: 2
  },
  "torpedo" : {
    "name" : "Photon torpedo",
    "model" : "torpedo.obj",
    material : "default",
    "attachment": [[0, 0, 0, 0], [0, 0, 1, 0], [0, 0, -1, 0]],
    "multiple" : true,
    mass: 150
  },
  "radiator_lateral_2sided" : {
    "name" : "Lateral 2-sided radiator",
    "model" : "radiator_lateral_2sided.obj",
    "category" : "radiators",
    material : "default",
    "attachment": [[0, 0, 0, 0], [0, 0, 1, 0], [0, 0, -1, 0]],
    "multiple" : true,
    mass: 100
  },
  "radiator_lateral_1sided" : {
    "name" : "Lateral 1-sided radiator",
    "model" : "radiator_lateral_1sided.obj",
    "category" : "radiators",
    material : "default",
    "attachment": [[0, 0, 0, 0], [0, 0, 1, 0], [0, 0, -1, 0]],
    "multiple" : true,
    mass: 200
  },
  "propellent_tank" : {
    "name" : "Propellent tank (metallic H)",
    "model" : "propellent_tank.obj",
    //model: "sb/battle.obj",
    material : "default",
    "attachment" : [[3, 0, 0, 0], [1, 3, 0, 1], [-2, 3, 0, 2], [-3, 0, 0, 3], [-2, -3, 0, 4], [1, -3, 0, 5]],
    mass: 180000 * 1.15 + 3000 * 2 + 10000 * 3
    // Me H + Shell + Magnets
  },
  "fuel_tank" : {
    "name" : "Fuel tank (De+He3)",
    "model" : "fuel_tank.obj",
    //model: "sb/siege.obj",
    material : "default",
    "attachment" : [
      [1, 0, 3, 0], [-1, 0, 3, 3], [0, 1, 3, 1], [0, -1, 3, 5], [-1, 1, 3, 2], [-1, -1, 3, 4], 
      [1, 0, -3, 0], [-1, 0, -3, 3], [0, 1, -3, 1], [0, -1, -3, 5], [-1, 1, -3, 2], [-1, -1, -3, 4]
    ],
    mass: 30000 * 0.2 + 500 * 2
  },
  "toroidal_living_module" : {
    "name" : "Toroidal living module",
    "model" : "toroidal_living_module.obj",
    "category" : "habbitat",
    material : "default",
    "attachment" : [[3, 0, 0, 3], [1, 3, 0, 4], [-2, 3, 0, 5], [-3, 0, 0, 0], [-2, -3, 0, 1], [1, -3, 0, 2]],
    mass: 400
  },
  "shuttle_deck_front" : {
    "name" : "Shuttle deck front attachment",
    "model" : "shuttle_deck_front.obj",
    material : "default",
    "attachment" : [[3, 0, 0, 3], [1, 3, 0, 4], [-2, 3, 0, 5], [-3, 0, 0, 0], [-2, -3, 0, 1], [1, -3, 0, 2]],
    mass: 30 * 12
  },
  "shuttle_deck_back" : {
    "name" : "Shuttle deck back attachment",
    "model" : "shuttle_deck_back.obj",
    material : "default",
    "attachment" : [[3, 0, 0, 3], [1, 3, 0, 4], [-2, 3, 0, 5], [-3, 0, 0, 0], [-2, -3, 0, 1], [1, -3, 0, 2]],
    mass: 30 * 12
  },
  "cargo" : {
    "name" : "Small cargo",
    "model" : "cargo.obj",
    material : "default",
    "attachment" : [
      [1, 0, 1, 0], [-1, 0, 1, 3], [0, 1, 1, 1], [0, -1, 1, 5], [-1, 1, 1, 2], [-1, -1, 1, 4], 
      [1, 0, -1, 0], [-1, 0, -1, 3], [0, 1, -1, 1], [0, -1, -1, 5], [-1, 1, -1, 2], [-1, -1, -1, 4]
    ],
    mass: 500
  },
  "hyper_drive" : {
    "name" : "3 unit Hyper drive",
    "model" : "hyper_drive.obj",
    material : "default",
    "attachment" : [[3, 0, 0, 0], [-3, 0, 0, 3]],
    mass: 10000
  }
};

// Modules list
modules_cat = [
  {
    "name" : "Propulsion engines",
    "icon" : "0",
    "modules" : [
      {
        "name" : "Linear nuclear fusion engine",
        "model" : "linear_nf_engine.obj",
        "icon" : "1",
        "attachment" : [
          [1, 0, 7, 0], [1, 0, 8, 0], [1, 0, -7, 0], [1, 0, -8, 0],
          [-1, 0, 7, 3], [-1, 0, 8, 3], [-1, 0, -7, 3], [-1, 0, -8, 3],
          [0, 1, 7, 1], [0, 1, 8, 1], [0, 1, -7, 1], [0, 1, -8, 1],
          [0, -1, 7, 5], [0, -1, 8, 5], [0, -1, -7, 5], [0, -1, -8, 5],
          [-1, 1, 7, 2], [-1, 1, 8, 2], [-1, 1, -7, 2], [-1, 1, -8, 2],
          [-1, -1, 7, 4], [-1, -1, 8, 4], [-1, -1, -7, 4], [-1, -1, -8, 4]
        ]
      },
      {
        "name" : "2-sided linear nuclear fusion engine",
        "model" : "linear_nf_engine_2sided.obj",
        "icon" : "2",
        "attachment" : [
          [1, 0, 7, 0], [1, 0, 8, 0], [1, 0, -7, 0], [1, 0, -8, 0],
          [-1, 0, 7, 3], [-1, 0, 8, 3], [-1, 0, -7, 3], [-1, 0, -8, 3],
          [0, 1, 7, 1], [0, 1, 8, 1], [0, 1, -7, 1], [0, 1, -8, 1],
          [0, -1, 7, 5], [0, -1, 8, 5], [0, -1, -7, 5], [0, -1, -8, 5],
          [-1, 1, 7, 2], [-1, 1, 8, 2], [-1, 1, -7, 2], [-1, 1, -8, 2],
          [-1, -1, 7, 4], [-1, -1, 8, 4], [-1, -1, -7, 4], [-1, -1, -8, 4]
        ]
      }
    ]
  },
  {
    "name" : "Shunting engines",
    "icon" : "8",
    "modules" : [
      {
        "name" : "Shunting engine",
        "model" : "shunting_engine.obj",
        "icon" : "9",
        "attachment" : [[0, 0, 0, 0]]
      }
    ]
  },
  {
    "name" : "Radiators",
    "icon" : "16",
    "modules" : [
      {
        "name" : "Lateral 2-sided radiator",
        "model" : "radiator_lateral_2sided.obj",
        "icon" : "17",
        "attachment" : [[0, 0, 0, 0]]
      }
    ]
  },
  {
    "name" : "Tanks",
    "icon" : "24",
    "modules" : [
      {
        "name" : "Propellent tank (metallic H)",
        "model" : "propellent_tank.obj",
        "icon" : "25",
        "attachment" : [[3, 0, 0, 0], [1, 3, 0, 1], [-2, 3, 0, 2], [-3, 0, 0, 3], [-2, -3, 0, 4], [1, -3, 0, 5]]
      },
      {
        "name" : "Fuel tank (De+He3)",
        "model" : "fuel_tank.obj",
        "icon" : "26",
        "attachment" : [
          [1, 0, 3, 0], [-1, 0, 3, 3], [0, 1, 3, 1], [0, -1, 3, 5], [-1, 1, 3, 2], [-1, -1, 3, 4], 
          [1, 0, -3, 0], [-1, 0, -3, 3], [0, 1, -3, 1], [0, -1, -3, 5], [-1, 1, -3, 2], [-1, -1, -3, 4]
        ]
      }
    ]
  },
  {
    "name" : "Living modules",
    "icon" : "32",
    "modules" : [
      {
        "name" : "Toroidal living module",
        "model" : "toroidal_living_module.obj",
        "icon" : "33",
        "attachment" : [[3, 0, 0, 0], [1, 3, 0, 1], [-2, 3, 0, 2], [-3, 0, 0, 3], [-2, -3, 0, 4], [1, -3, 0, 5]]
      }
    ]
  },
  {
    "name" : "Cargos",
    "icon" : "40",
    "modules" : [
      {
        "name" : "Small cargo",
        "model" : "cargo.obj",
        "icon" : "41",
        "attachment" : [
          [1, 0, 1, 0], [-1, 0, 1, 3], [0, 1, 1, 1], [0, -1, 1, 5], [-1, 1, 1, 2], [-1, -1, 1, 4], 
          [1, 0, -1, 0], [-1, 0, -1, 3], [0, 1, -1, 1], [0, -1, -1, 5], [-1, 1, -1, 2], [-1, -1, -1, 4]
        ]
      }
    ]
  },
  {
    "name" : "Hyper drives",
    "icon" : "48",
    "modules" : [
      {
        "name" : "3 unit Hyper drive",
        "model" : "hyper_drive.obj",
        "icon" : "49",
        "attachment" : [[3, 0, 0, 0], [-3, 0, 0, 3]]
      }
    ]
  },
  /*{
    "name" : "Shilds",
    "icon" : "56",
    "modules" : [
      {
        "name" : "Base shild",
        "model" : "shild_plate.obj",
        "icon" : "57",
        "attachment" : [[0, 0, 0, 0], [0, 1, 0, 0], [1, 0, 0, 0]]
      }
    ]
  }*/
];