// src/scenes/utils/layout-config.js
export const GAME_LAYOUT = {
  "containers": {
    "video_container": {
      "portrait": {
        "x": 0.5001343639775253,
        "y": 0.24975212867716043,
        "width": 1.000566670521968,
        "height": 0.5006609365529116
      },
      "landscape": {
        "x": 0.5009190337108727,
        "y": 0.23940369759442645,
        "width": 0.998928743319266,
        "height": 0.4772339534160405
      },
      "assets": {
        "3658fc66-3c21-4a6f-bdb5-35c031bf77bf": {
          "id": "3658fc66-3c21-4a6f-bdb5-35c031bf77bf",
          "name": "video",
          "type": "video",
          "key": "video",
          "portrait": {
            "position": {
              "reference": "container",
              "x": 0,
              "y": 0
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fill",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "container",
              "x": 0,
              "y": 0
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fill",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "b422d95f-9c5d-4f09-a411-69105040fe39": {
          "id": "b422d95f-9c5d-4f09-a411-69105040fe39",
          "name": "bench_glow1",
          "type": "image",
          "key": "bench_glow",
          "portrait": {
            "position": {
              "reference": "3658fc66-3c21-4a6f-bdb5-35c031bf77bf",
              "x": -0.32819402303709455,
              "y": -0.017728911091003604
            },
            "size": {
              "width": 0.18495546596905907,
              "height": 0.12495546596905903
            },
            "origin": {
              "x": 0.3,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "3658fc66-3c21-4a6f-bdb5-35c031bf77bf",
              "x": -0.3150520912974496,
              "y": -0.02247498428685675
            },
            "size": {
              "width": 0.12141074860389782,
              "height": 0.08141074860389784
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "508d1143-1761-409e-9054-a1012d083004": {
          "id": "508d1143-1761-409e-9054-a1012d083004",
          "name": "object_bench1",
          "type": "image",
          "key": "heart_mask",
          "portrait": {
            "position": {
              "reference": "b422d95f-9c5d-4f09-a411-69105040fe39",
              "x": 0.15,
              "y": -0.060000000000000005
            },
            "size": {
              "width": 0.7,
              "height": 0.7
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "b422d95f-9c5d-4f09-a411-69105040fe39",
              "x": -0.056637995460155674,
              "y": -0.03822818554957413
            },
            "size": {
              "width": 0.5699999999999998,
              "height": 0.7
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "563b4627-3cd2-4880-a024-a96f053e4dbb": {
          "id": "563b4627-3cd2-4880-a024-a96f053e4dbb",
          "name": "bench_glow2",
          "type": "image",
          "key": "bench_glow",
          "portrait": {
            "position": {
              "reference": "3658fc66-3c21-4a6f-bdb5-35c031bf77bf",
              "x": 0.1888463187758651,
              "y": 0.36216454124057507
            },
            "size": {
              "width": 0.18495546596905907,
              "height": 0.12495546596905903
            },
            "origin": {
              "x": 0.3,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "3658fc66-3c21-4a6f-bdb5-35c031bf77bf",
              "x": -0.41260787294310036,
              "y": -0.06278129292671931
            },
            "size": {
              "width": 0.12,
              "height": 0.08
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "0f06e5a5-653d-4275-8d56-0831401c571c": {
          "id": "0f06e5a5-653d-4275-8d56-0831401c571c",
          "name": "bench_glow3",
          "type": "image",
          "key": "bench_glow",
          "portrait": {
            "position": {
              "reference": "3658fc66-3c21-4a6f-bdb5-35c031bf77bf",
              "x": -0.41880934067441744,
              "y": 0.32637747689049884
            },
            "size": {
              "width": 0.18495546596905907,
              "height": 0.12495546596905903
            },
            "origin": {
              "x": 0.3,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "3658fc66-3c21-4a6f-bdb5-35c031bf77bf",
              "x": -0.13945168433527827,
              "y": 0.037984478672937104
            },
            "size": {
              "width": 0.12,
              "height": 0.08
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "50cd5297-9ec8-454b-bc76-19a1ce95b68f": {
          "id": "50cd5297-9ec8-454b-bc76-19a1ce95b68f",
          "name": "bench_glow4",
          "type": "image",
          "key": "bench_glow",
          "portrait": {
            "position": {
              "reference": "3658fc66-3c21-4a6f-bdb5-35c031bf77bf",
              "x": -0.22158776699318533,
              "y": -0.2764969148530934
            },
            "size": {
              "width": 0.18495546596905907,
              "height": 0.12495546596905903
            },
            "origin": {
              "x": 0.3,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "3658fc66-3c21-4a6f-bdb5-35c031bf77bf",
              "x": 0.012134991760271293,
              "y": -0.10308760156658188
            },
            "size": {
              "width": 0.12,
              "height": 0.08
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "090aa601-dd51-4bd0-a497-0d35265a4351": {
          "id": "090aa601-dd51-4bd0-a497-0d35265a4351",
          "name": "bench_glow5",
          "type": "image",
          "key": "bench_glow",
          "portrait": {
            "position": {
              "reference": "3658fc66-3c21-4a6f-bdb5-35c031bf77bf",
              "x": -0.04568744452073517,
              "y": -0.18289997732212476
            },
            "size": {
              "width": 0.18495546596905907,
              "height": 0.12495546596905903
            },
            "origin": {
              "x": 0.3,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "3658fc66-3c21-4a6f-bdb5-35c031bf77bf",
              "x": 0.30180062033889576,
              "y": -0.0720827487666876
            },
            "size": {
              "width": 0.12,
              "height": 0.08
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "b76b3d97-b666-4fa8-b665-54cd86bb6f52": {
          "id": "b76b3d97-b666-4fa8-b665-54cd86bb6f52",
          "name": "bench_glow6",
          "type": "image",
          "key": "bench_glow",
          "portrait": {
            "position": {
              "reference": "3658fc66-3c21-4a6f-bdb5-35c031bf77bf",
              "x": 0.21016756998464695,
              "y": -0.07553878427189602
            },
            "size": {
              "width": 0.18495546596905907,
              "height": 0.12495546596905903
            },
            "origin": {
              "x": 0.3,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "3658fc66-3c21-4a6f-bdb5-35c031bf77bf",
              "x": -0.38859414207647863,
              "y": 0.03023326547296353
            },
            "size": {
              "width": 0.12,
              "height": 0.08
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "bcdb5c46-8bd0-4a93-a39b-3be3bcda68ea": {
          "id": "bcdb5c46-8bd0-4a93-a39b-3be3bcda68ea",
          "name": "bench_glow7",
          "type": "image",
          "key": "bench_glow",
          "portrait": {
            "position": {
              "reference": "3658fc66-3c21-4a6f-bdb5-35c031bf77bf",
              "x": 0.3834027360559994,
              "y": 0.16946496397093372
            },
            "size": {
              "width": 0.18495546596905907,
              "height": 0.12495546596905903
            },
            "origin": {
              "x": 0.3,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "3658fc66-3c21-4a6f-bdb5-35c031bf77bf",
              "x": 0.35583151478879466,
              "y": 0.05658739035287367
            },
            "size": {
              "width": 0.12,
              "height": 0.08
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "20bd16d5-7423-4797-bf2e-67a56c329cf0": {
          "id": "20bd16d5-7423-4797-bf2e-67a56c329cf0",
          "name": "object_bench2",
          "type": "image",
          "key": "heart_mask",
          "portrait": {
            "position": {
              "reference": "563b4627-3cd2-4880-a024-a96f053e4dbb",
              "x": 0.15,
              "y": -0.060000000000000005
            },
            "size": {
              "width": 0.7,
              "height": 0.7
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "563b4627-3cd2-4880-a024-a96f053e4dbb",
              "x": -0.056637995460155674,
              "y": -0.03822818554957413
            },
            "size": {
              "width": 0.5699999999999998,
              "height": 0.7
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "159e4901-1ab2-402f-b986-8f4f30e7a59d": {
          "id": "159e4901-1ab2-402f-b986-8f4f30e7a59d",
          "name": "object_bench3",
          "type": "image",
          "key": "heart_mask",
          "portrait": {
            "position": {
              "reference": "0f06e5a5-653d-4275-8d56-0831401c571c",
              "x": 0.15,
              "y": -0.060000000000000005
            },
            "size": {
              "width": 0.7,
              "height": 0.7
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "0f06e5a5-653d-4275-8d56-0831401c571c",
              "x": -0.056637995460155674,
              "y": -0.03822818554957413
            },
            "size": {
              "width": 0.5699999999999998,
              "height": 0.7
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "944457b7-60a7-4430-a7cf-2c576dee01db": {
          "id": "944457b7-60a7-4430-a7cf-2c576dee01db",
          "name": "object_bench4",
          "type": "image",
          "key": "heart_mask",
          "portrait": {
            "position": {
              "reference": "50cd5297-9ec8-454b-bc76-19a1ce95b68f",
              "x": 0.15,
              "y": -0.060000000000000005
            },
            "size": {
              "width": 0.7,
              "height": 0.7
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "50cd5297-9ec8-454b-bc76-19a1ce95b68f",
              "x": -0.056637995460155674,
              "y": -0.03822818554957413
            },
            "size": {
              "width": 0.5699999999999998,
              "height": 0.7
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "b43d8788-1427-47d1-b927-27cbf792a649": {
          "id": "b43d8788-1427-47d1-b927-27cbf792a649",
          "name": "object_bench5",
          "type": "image",
          "key": "heart_mask",
          "portrait": {
            "position": {
              "reference": "090aa601-dd51-4bd0-a497-0d35265a4351",
              "x": 0.15,
              "y": -0.060000000000000005
            },
            "size": {
              "width": 0.7,
              "height": 0.7
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "090aa601-dd51-4bd0-a497-0d35265a4351",
              "x": -0.056637995460155674,
              "y": -0.03822818554957413
            },
            "size": {
              "width": 0.5699999999999998,
              "height": 0.7
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "6827e161-1107-452d-9761-764909ec3d42": {
          "id": "6827e161-1107-452d-9761-764909ec3d42",
          "name": "object_bench6",
          "type": "image",
          "key": "heart_mask",
          "portrait": {
            "position": {
              "reference": "b76b3d97-b666-4fa8-b665-54cd86bb6f52",
              "x": 0.15,
              "y": -0.060000000000000005
            },
            "size": {
              "width": 0.7,
              "height": 0.7
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "b76b3d97-b666-4fa8-b665-54cd86bb6f52",
              "x": -0.056637995460155674,
              "y": -0.03822818554957413
            },
            "size": {
              "width": 0.5699999999999998,
              "height": 0.7
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "2674fc4f-9ca1-437d-b66a-af4ad681fa44": {
          "id": "2674fc4f-9ca1-437d-b66a-af4ad681fa44",
          "name": "object_bench7",
          "type": "image",
          "key": "heart_mask",
          "portrait": {
            "position": {
              "reference": "bcdb5c46-8bd0-4a93-a39b-3be3bcda68ea",
              "x": 0.15,
              "y": -0.060000000000000005
            },
            "size": {
              "width": 0.7,
              "height": 0.7
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "bcdb5c46-8bd0-4a93-a39b-3be3bcda68ea",
              "x": -0.056637995460155674,
              "y": -0.03822818554957413
            },
            "size": {
              "width": 0.5699999999999998,
              "height": 0.7
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "31d55adc-a593-4d3a-83b7-f76b162c7f63": {
          "id": "31d55adc-a593-4d3a-83b7-f76b162c7f63",
          "name": "hand",
          "type": "image",
          "key": "hand",
          "portrait": {
            "position": {
              "reference": "508d1143-1761-409e-9054-a1012d083004",
              "x": -0.09,
              "y": -0.2700000000000001
            },
            "size": {
              "width": 3,
              "height": 3
            },
            "origin": {
              "x": 0,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "508d1143-1761-409e-9054-a1012d083004",
              "x": -0.09999999999999999,
              "y": -0.20000000000000004
            },
            "size": {
              "width": 3,
              "height": 3
            },
            "origin": {
              "x": 0,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        }
      }
    },
    "wall_stairs_container": {
      "portrait": {
        "x": 0.5013169464927867,
        "y": 0.7508262710594422,
        "width": 1.001620641105096,
        "height": 0.5011314926294812
      },
      "landscape": {
        "x": 0.4999804168732054,
        "y": 0.7522652051447253,
        "width": 0.9999428899531695,
        "height": 0.5002862817986987
      },
      "assets": {
        "22125c4b-d156-48db-83a7-748b0abdb904": {
          "id": "22125c4b-d156-48db-83a7-748b0abdb904",
          "name": "wall_stairs",
          "type": "image",
          "key": "wall_stairs",
          "portrait": {
            "position": {
              "reference": "container",
              "x": -0.5026623519496608,
              "y": -0.4925206737310307
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 0,
              "y": 0.04
            },
            "scaleMode": "fill",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "container",
              "x": -0.5,
              "y": -0.5
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 0,
              "y": 0.04
            },
            "scaleMode": "fill",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "adcd1dff-7a18-4a9b-8a13-0594516a8ab8": {
          "id": "adcd1dff-7a18-4a9b-8a13-0594516a8ab8",
          "name": "acid_stream",
          "type": "image",
          "key": "acid_stream",
          "portrait": {
            "position": {
              "reference": "22125c4b-d156-48db-83a7-748b0abdb904",
              "x": 0.064,
              "y": 0.14558789160536081
            },
            "size": {
              "width": 0.2764875479348628,
              "height": 0.9123090931857929
            },
            "origin": {
              "x": 0.5,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "22125c4b-d156-48db-83a7-748b0abdb904",
              "x": 0.06482759702816629,
              "y": 0.16022490298221512
            },
            "size": {
              "width": 0.32181269370230264,
              "height": 1.0618657113498362
            },
            "origin": {
              "x": 0.5,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "06cf0f42-3bfe-4bbb-9988-e26419afb3c1": {
          "id": "06cf0f42-3bfe-4bbb-9988-e26419afb3c1",
          "name": "stream_mask_white",
          "type": "image",
          "key": "stream_mask_white",
          "portrait": {
            "position": {
              "reference": "adcd1dff-7a18-4a9b-8a13-0594516a8ab8",
              "x": 0,
              "y": 0
            },
            "size": {
              "width": 1,
              "height": 4.361023384901388
            },
            "origin": {
              "x": 0.5,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "adcd1dff-7a18-4a9b-8a13-0594516a8ab8",
              "x": 0,
              "y": 0
            },
            "size": {
              "width": 1,
              "height": 3.6763535558235634
            },
            "origin": {
              "x": 0.5,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "0ad9d601-4c34-4161-85ef-fca80068f5e6": {
          "id": "0ad9d601-4c34-4161-85ef-fca80068f5e6",
          "name": "stream_mask_white2",
          "type": "image",
          "key": "stream_mask_white",
          "portrait": {
            "position": {
              "reference": "06cf0f42-3bfe-4bbb-9988-e26419afb3c1",
              "x": 0,
              "y": -1
            },
            "size": {
              "width": 1,
              "height": 4.361023384901388
            },
            "origin": {
              "x": 0.5,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "06cf0f42-3bfe-4bbb-9988-e26419afb3c1",
              "x": 0,
              "y": -1
            },
            "size": {
              "width": 1,
              "height": 3.6763535558235634
            },
            "origin": {
              "x": 0.5,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "f7c23953-3e23-4c62-828e-e27eb71065c2": {
          "id": "f7c23953-3e23-4c62-828e-e27eb71065c2",
          "name": "stream_mask_black",
          "type": "image",
          "key": "stream_mask_black",
          "portrait": {
            "position": {
              "reference": "adcd1dff-7a18-4a9b-8a13-0594516a8ab8",
              "x": 0,
              "y": 0
            },
            "size": {
              "width": 1,
              "height": 3.59427739265943
            },
            "origin": {
              "x": 0.5,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "adcd1dff-7a18-4a9b-8a13-0594516a8ab8",
              "x": 0,
              "y": 0
            },
            "size": {
              "width": 1,
              "height": 3.0985680225961048
            },
            "origin": {
              "x": 0.5,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "a4024e48-c2d1-4b9d-bb64-55e538ef2f83": {
          "id": "a4024e48-c2d1-4b9d-bb64-55e538ef2f83",
          "name": "stream_mask_black2",
          "type": "image",
          "key": "stream_mask_black",
          "portrait": {
            "position": {
              "reference": "adcd1dff-7a18-4a9b-8a13-0594516a8ab8",
              "x": 0,
              "y": 0
            },
            "size": {
              "width": 1,
              "height": 3.59427739265943
            },
            "origin": {
              "x": 0.5,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "adcd1dff-7a18-4a9b-8a13-0594516a8ab8",
              "x": 0,
              "y": 0
            },
            "size": {
              "width": 1,
              "height": 3.0985680225961048
            },
            "origin": {
              "x": 0.5,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "2b2b9cd1-f7af-4cc1-ae36-5301b4033055": {
          "id": "2b2b9cd1-f7af-4cc1-ae36-5301b4033055",
          "name": "acid_river",
          "type": "image",
          "key": "acid_river",
          "portrait": {
            "position": {
              "reference": "container",
              "x": 0.5058468704355545,
              "y": 0.005983461015175287
            },
            "size": {
              "width": 1.46,
              "height": 1.5
            },
            "origin": {
              "x": 1,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "container",
              "x": 0.5082749046650775,
              "y": -0.192321799130565
            },
            "size": {
              "width": 1.5,
              "height": 1.5
            },
            "origin": {
              "x": 1,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "09815790-f4d2-4823-b332-7836dd653b5e": {
          "id": "09815790-f4d2-4823-b332-7836dd653b5e",
          "name": "acid_river2",
          "type": "image",
          "key": "acid_river",
          "portrait": {
            "position": {
              "reference": "2b2b9cd1-f7af-4cc1-ae36-5301b4033055",
              "x": -0.997,
              "y": 0
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 1,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "2b2b9cd1-f7af-4cc1-ae36-5301b4033055",
              "x": -0.997,
              "y": 0
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 1,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "09815790-f4d2-4823-b332-7836dd652b5e": {
          "id": "09815790-f4d2-4823-b332-7836dd652b5e",
          "name": "acid_river3",
          "type": "image",
          "key": "acid_river",
          "portrait": {
            "position": {
              "reference": "09815790-f4d2-4823-b332-7836dd653b5e",
              "x": -0.997,
              "y": 0
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 1,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "09815790-f4d2-4823-b332-7836dd653b5e",
              "x": -0.997,
              "y": 0
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 1,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "77ceff62-a3ee-4588-91e3-e884c9a50b91": {
          "id": "77ceff62-a3ee-4588-91e3-e884c9a50b91",
          "name": "acid_bubble11",
          "type": "image",
          "key": "acid_bubble",
          "portrait": {
            "position": {
              "reference": "2b2b9cd1-f7af-4cc1-ae36-5301b4033055",
              "x": 0,
              "y": 0.5
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 1,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "2b2b9cd1-f7af-4cc1-ae36-5301b4033055",
              "x": 0,
              "y": 0.4076084555905917
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 1,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "2e194881-185b-474b-8acf-c7d69f28a1aa": {
          "id": "2e194881-185b-474b-8acf-c7d69f28a1aa",
          "name": "acid_bubble12",
          "type": "image",
          "key": "acid_bubble",
          "portrait": {
            "position": {
              "reference": "2b2b9cd1-f7af-4cc1-ae36-5301b4033055",
              "x": 0,
              "y": 0.65
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 1,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "2b2b9cd1-f7af-4cc1-ae36-5301b4033055",
              "x": 0,
              "y": 0.65
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 1,
              "y": 0
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "6904ba4c-4ce1-4b66-b11a-331df4fa81b4": {
          "id": "6904ba4c-4ce1-4b66-b11a-331df4fa81b4",
          "name": "acid_wave",
          "type": "image",
          "key": "acid_wave",
          "portrait": {
            "position": {
              "reference": "2b2b9cd1-f7af-4cc1-ae36-5301b4033055",
              "x": -0.5030785482470399,
              "y": 0.46572954409513656
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "2b2b9cd1-f7af-4cc1-ae36-5301b4033055",
              "x": -0.5068495447285443,
              "y": 0.48291768991795536
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "acc39a6e-7521-4e10-8c45-ff259f378239": {
          "id": "acc39a6e-7521-4e10-8c45-ff259f378239",
          "name": "acid_wave2",
          "type": "image",
          "key": "acid_wave",
          "portrait": {
            "position": {
              "reference": "09815790-f4d2-4823-b332-7836dd653b5e",
              "x": -0.5030785482470399,
              "y": 0.45572954409513655
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "09815790-f4d2-4823-b332-7836dd653b5e",
              "x": -0.5068495447285443,
              "y": 0.48291768991795536
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "acc39a6e-7521-4e10-8c45-ff259f318239": {
          "id": "acc39a6e-7521-4e10-8c45-ff259f318239",
          "name": "acid_wave3",
          "type": "image",
          "key": "acid_wave",
          "portrait": {
            "position": {
              "reference": "acc39a6e-7521-4e10-8c45-ff259f378239",
              "x": -0.5030785482470399,
              "y": 0.45572954409513655
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "acc39a6e-7521-4e10-8c45-ff259f378239",
              "x": -0.5068495447285443,
              "y": 0.48291768991795536
            },
            "size": {
              "width": 1,
              "height": 1
            },
            "origin": {
              "x": 0.5,
              "y": 0.5
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        "f9068ef7-4611-4289-a42f-cd011ce39606": {
          "id": "f9068ef7-4611-4289-a42f-cd011ce39606",
          "name": "black_tank",
          "type": "image",
          "key": "black_tank",
          "portrait": {
            "position": {
              "reference": "2b2b9cd1-f7af-4cc1-ae36-5301b4033055",
              "x": -0.8365631418262599,
              "y": 0.5197467809211845
            },
            "size": {
              "width": 0.4234614153563444,
              "height": 0.2801607022175231
            },
            "origin": {
              "x": 0.5,
              "y": 1
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          },
          "landscape": {
            "position": {
              "reference": "2b2b9cd1-f7af-4cc1-ae36-5301b4033055",
              "x": -0.4431381045531221,
              "y": 0.4201527982988856
            },
            "size": {
              "width": 2.88444779209654,
              "height": 0.23188650993024407
            },
            "origin": {
              "x": 0.5,
              "y": 1
            },
            "scaleMode": "fit",
            "maintainAspectRatio": true,
            "rotation": 0,
            "isVisible": true
          }
        },
        
      },
      "children": {
        "waldo_container": {
          "portrait": {
            "x": -0.15,
            "y": 0.35,
            "width": 0.4990838970084801,
            "height": 0.1231089592085296
          },
          "landscape": {
            "x": -0.3,
            "y": 0.35,
            "width": 0.24460379395235055,
            "height": 0.22799398116652378
          },
          "assets": {
            "c680909f-b794-4fcd-b592-21dcd620587e": {
              "id": "c680909f-b794-4fcd-b592-21dcd620587e",
              "name": "waldo_bench",
              "type": "image",
              "key": "waldo_bench",
              "portrait": {
                "position": {
                  "reference": "container",
                  "x": 0.002431146670626147,
                  "y": 0.3660393668424745
                },
                "size": {
                  "width": 0.7,
                  "height": 0.7
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              },
              "landscape": {
                "position": {
                  "reference": "container",
                  "x": -0.10647531898760695,
                  "y": 0.333837544430372
                },
                "size": {
                  "width": 0.7,
                  "height": 2.5
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              }
            },
            "b5903ced-4ed7-4703-bb6c-70bebf0b2f37": {
              "id": "b5903ced-4ed7-4703-bb6c-70bebf0b2f37",
              "name": "heart_bg",
              "type": "image",
              "key": "heart_bg",
              "portrait": {
                "position": {
                  "reference": "c680909f-b794-4fcd-b592-21dcd620587e",
                  "x": 0.473695075303049,
                  "y": -1.8394499147082877
                },
                "size": {
                  "width": 1.9190740889237503,
                  "height": 2.1594961246456985
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              },
              "landscape": {
                "position": {
                  "reference": "c680909f-b794-4fcd-b592-21dcd620587e",
                  "x": 0.5885972012604456,
                  "y": -1.7165107618625062
                },
                "size": {
                  "width": 2.198772926592737,
                  "height": 2.312004813841942
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              }
            },
            "6ca1e567-f057-47f6-bd13-ac552e393f60": {
              "id": "6ca1e567-f057-47f6-bd13-ac552e393f60",
              "name": "waldo_seating_body",
              "type": "image",
              "key": "waldo_seating_body",
              "portrait": {
                "position": {
                  "reference": "c680909f-b794-4fcd-b592-21dcd620587e",
                  "x": -0.18241730267530828,
                  "y": -0.25882479423576643
                },
                "size": {
                  "width": 3,
                  "height": 3
                },
                "origin": {
                  "x": 0.35,
                  "y": 1
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              },
              "landscape": {
                "position": {
                  "reference": "c680909f-b794-4fcd-b592-21dcd620587e",
                  "x": -0.03855866543855488,
                  "y": -0.31154477695116795
                },
                "size": {
                  "width": 3,
                  "height": 3
                },
                "origin": {
                  "x": 0.35,
                  "y": 1
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              }
            },
            "e9c1aa1e-48ec-4b6c-9397-d99a863b287a": {
              "id": "e9c1aa1e-48ec-4b6c-9397-d99a863b287a",
              "name": "waldo_seating_right_hand",
              "type": "image",
              "key": "waldo_seating_right_hand",
              "portrait": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.04714926799081724,
                  "y": -0.42810834863548
                },
                "size": {
                  "width": 0.7000000000000004,
                  "height": 0.4700000000000001
                },
                "origin": {
                  "x": 0.1,
                  "y": 0.05
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              },
              "landscape": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.06232723913301073,
                  "y": -0.41864727594398654
                },
                "size": {
                  "width": 0.21681913926733248,
                  "height": 0.5048830806050969
                },
                "origin": {
                  "x": 0.1,
                  "y": 0.05
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              }
            },
            "4a8fee90-fb02-40a8-8068-5ee48cf24273": {
              "id": "4a8fee90-fb02-40a8-8068-5ee48cf24273",
              "name": "heart_mask",
              "type": "image",
              "key": "heart_mask",
              "portrait": {
                "position": {
                  "reference": "b5903ced-4ed7-4703-bb6c-70bebf0b2f37",
                  "x": 0.03972056254726153,
                  "y": 0.37
                },
                "size": {
                  "width": 0.8,
                  "height": 0.8
                },
                "origin": {
                  "x": 0.5,
                  "y": 1
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              },
              "landscape": {
                "position": {
                  "reference": "b5903ced-4ed7-4703-bb6c-70bebf0b2f37",
                  "x": 0.041773462966064994,
                  "y": 0.35
                },
                "size": {
                  "width": 0.75,
                  "height": 0.75
                },
                "origin": {
                  "x": 0.5,
                  "y": 1
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              }
            },
            "0f5dd0ea-540d-46f5-af01-f17a972d580b": {
              "id": "0f5dd0ea-540d-46f5-af01-f17a972d580b",
              "name": "mouth1",
              "type": "image",
              "key": "mouth1",
              "portrait": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.24000000000000007,
                  "y": -0.37
                },
                "size": {
                  "width": 0.1399999999999999,
                  "height": 0.84
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              },
              "landscape": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.23000000000000007,
                  "y": -0.37
                },
                "size": {
                  "width": 0.15999999999999992,
                  "height": -0.35
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              }
            },
            "34929e0b-8a9e-4d1a-8e1f-abdf803d9c48": {
              "id": "34929e0b-8a9e-4d1a-8e1f-abdf803d9c48",
              "name": "eye1",
              "type": "image",
              "key": "eye1",
              "portrait": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.3079948992748051,
                  "y": -0.5176366051633197
                },
                "size": {
                  "width": 0.24640879548652994,
                  "height": 0.3564087954865301
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              },
              "landscape": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.30845408187600537,
                  "y": -0.5163820839465678
                },
                "size": {
                  "width": 0.22563062593181094,
                  "height": 0.1856306259318109
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              }
            },
            "d3275915-00be-4e07-83a1-f2b7d562a39d": {
              "id": "d3275915-00be-4e07-83a1-f2b7d562a39d",
              "name": "waldo_standing",
              "type": "image",
              "key": "waldo_standing",
              "portrait": {
                "position": {
                  "reference": "c680909f-b794-4fcd-b592-21dcd620587e",
                  "x": -0.024018612472874373,
                  "y": -0.4397882941474201
                },
                "size": {
                  "width": 3,
                  "height": 5
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.9
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              },
              "landscape": {
                "position": {
                  "reference": "c680909f-b794-4fcd-b592-21dcd620587e",
                  "x": -0.042880980453104345,
                  "y": -0.24008459046341932
                },
                "size": {
                  "width": 3,
                  "height": 4
                },
                "origin": {
                  "x": 0.5,
                  "y": 1
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              }
            },
            "0469793e-d689-4601-91b8-4faf2e736194": {
              "id": "0469793e-d689-4601-91b8-4faf2e736194",
              "name": "waldo_standing_right_hand",
              "type": "image",
              "key": "waldo_standing_right_hand",
              "portrait": {
                "position": {
                  "reference": "d3275915-00be-4e07-83a1-f2b7d562a39d",
                  "x": -0.17869183472574043,
                  "y": -0.339901284795273
                },
                "size": {
                  "width": 0.5,
                  "height": 0.5
                },
                "origin": {
                  "x": 0.931,
                  "y": 0.075
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              },
              "landscape": {
                "position": {
                  "reference": "d3275915-00be-4e07-83a1-f2b7d562a39d",
                  "x": -0.16932304796243003,
                  "y": -0.4472486403200453
                },
                "size": {
                  "width": 0.5,
                  "height": 0.5
                },
                "origin": {
                  "x": 0.931,
                  "y": 0.075
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              }
            },
            "7d18e832-02bc-4956-92b3-77e686892d50": {
              "id": "7d18e832-02bc-4956-92b3-77e686892d50",
              "name": "waldo_standing_left_hand",
              "type": "image",
              "key": "waldo_standing_left_hand",
              "portrait": {
                "position": {
                  "reference": "d3275915-00be-4e07-83a1-f2b7d562a39d",
                  "x": 0.1517008011171026,
                  "y": -0.3699012847952736
                },
                "size": {
                  "width": 0.5,
                  "height": 0.5
                },
                "origin": {
                  "x": 0.07,
                  "y": 0.06
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              },
              "landscape": {
                "position": {
                  "reference": "d3275915-00be-4e07-83a1-f2b7d562a39d",
                  "x": 0.14627387224450022,
                  "y": -0.480993353416082
                },
                "size": {
                  "width": 0.5,
                  "height": 0.5
                },
                "origin": {
                  "x": 0.01,
                  "y": 0.06
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": true
              }
            },
            "4bf8337f-7edb-46ea-b25f-f185ba116714": {
              "id": "4bf8337f-7edb-46ea-b25f-f185ba116714",
              "name": "mouth2",
              "type": "image",
              "key": "mouth2",
              "portrait": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.24000000000000007,
                  "y": -0.37
                },
                "size": {
                  "width": 0.1399999999999999,
                  "height": 0.84
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": false
              },
              "landscape": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.23000000000000007,
                  "y": -0.37
                },
                "size": {
                  "width": 0.15999999999999992,
                  "height": -0.35
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": false
              }
            },
            "d4ee0848-98b2-4804-b313-2800788b37f1": {
              "id": "d4ee0848-98b2-4804-b313-2800788b37f1",
              "name": "mouth3",
              "type": "image",
              "key": "mouth3",
              "portrait": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.24000000000000007,
                  "y": -0.37
                },
                "size": {
                  "width": 0.1399999999999999,
                  "height": 0.84
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": false
              },
              "landscape": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.23000000000000007,
                  "y": -0.37
                },
                "size": {
                  "width": 0.15999999999999992,
                  "height": -0.35
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": false
              }
            },
            "19853ff5-cd80-4d50-9abd-82d1ec4f60ca": {
              "id": "19853ff5-cd80-4d50-9abd-82d1ec4f60ca",
              "name": "mouth4",
              "type": "image",
              "key": "mouth4",
              "portrait": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.24000000000000007,
                  "y": -0.37
                },
                "size": {
                  "width": 0.1399999999999999,
                  "height": 0.84
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": false
              },
              "landscape": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.23000000000000007,
                  "y": -0.37
                },
                "size": {
                  "width": 0.15999999999999992,
                  "height": -0.35
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": false
              }
            },
            "2533b75d-d5aa-4eca-87a3-628176d5885d": {
              "id": "2533b75d-d5aa-4eca-87a3-628176d5885d",
              "name": "eye2",
              "type": "image",
              "key": "eye3",
              "portrait": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.33799489927480514,
                  "y": -0.49763660516331965
                },
                "size": {
                  "width": 0.24640879548652994,
                  "height": 0.3564087954865301
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": false
              },
              "landscape": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.3384540818760054,
                  "y": -0.4763820839465678
                },
                "size": {
                  "width": 0.22563062593181094,
                  "height": 0.1856306259318109
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": false
              }
            },
            "465ac434-95ef-4ba3-a7a3-2a29f89971d7": {
              "id": "465ac434-95ef-4ba3-a7a3-2a29f89971d7",
              "name": "eye3",
              "type": "image",
              "key": "eye3",
              "portrait": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.2779948992748051,
                  "y": -0.5276366051633197
                },
                "size": {
                  "width": 0.24640879548652994,
                  "height": 0.3564087954865301
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": false
              },
              "landscape": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.27845408187600534,
                  "y": -0.5363820839465678
                },
                "size": {
                  "width": 0.22563062593181094,
                  "height": 0.1856306259318109
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": false
              }
            },
            "2ba6e71e-31a0-458f-8f8c-9b7113f14610": {
              "id": "2ba6e71e-31a0-458f-8f8c-9b7113f14610",
              "name": "eye4",
              "type": "image",
              "key": "eye4",
              "portrait": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.3100000000000001,
                  "y": -0.5
                },
                "size": {
                  "width": 0.25000000000000006,
                  "height": 0.35
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": false
              },
              "landscape": {
                "position": {
                  "reference": "6ca1e567-f057-47f6-bd13-ac552e393f60",
                  "x": 0.3100000000000001,
                  "y": -0.5
                },
                "size": {
                  "width": 0.25000000000000006,
                  "height": -0.5
                },
                "origin": {
                  "x": 0.5,
                  "y": 0.5
                },
                "scaleMode": "fit",
                "maintainAspectRatio": true,
                "rotation": 0,
                "isVisible": false
              }
            }
          }
        }
      }
    },
    "mask_container": {
      "portrait": {
        "x": 0.5,
        "y": 0.75,
        "width": 1,
        "height": 0.5
      },
      "landscape": {
        "x": 0.5,
        "y": 0.75,
        "width": 1,
        "height": 0.5
      }
    }
  }
};