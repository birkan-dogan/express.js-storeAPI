# express.js-storeAPI
```javascript
[
  {
    '$addFields': {
      'toplamBeden': 1
    }
  }, 
  {
    '$group': {
      '_id': {
        'Maincode': '$Maincode', 
        'Renkcode': '$Renkcode'
      }, 
      'toplam': {
        '$sum': '$toplamBeden'
      }
    }
  }, 
  {
    '$project': {
      'Maincode': '$_id.Maincode', 
      'Renkcode': '$_id.Renkcode', 
      'toplam': 1, 
      '_id': 0
    }
  }, 
  {
    '$lookup': {
      'from': 'AllegroProductsYeni', 
      'let': {
        'pMaincode': 'Maincode', 
        'pRenkcode': 'Renkcode'
      }, 
      'pipeline': [
        {
          '$match': {
            '$expr': {
              '$and': [
                {
                  '$eq': [
                    '$modelcode', '$pMaincode'
                  ]
                }, {
                  '$eq': [
                    '$colorcode', '$pRenkcode'
                  ]
                }
              ]
            }
          }
        }
      ], 
      'as': 'Allegro'
    }
  }, 
  {
    '$lookup': {
      'from': 'Pictures', 
      'let': {
        'pMaincode': 'Maincode', 
        'pRenkcode': 'Renkcode'
      }, 
      'pipeline': [
        {
          '$match': {
            '$expr': {
              '$and': [
                {
                  '$eq': [
                    '$anacode', '$pMaincode'
                  ]
                }, {
                  '$eq': [
                    '$Colorcode', '$pRenkcode'
                  ]
                }
              ]
            }
          }
        }
      ], 
      'as': 'Pictures'
    }
  }, 
  {
    '$lookup': {
      'from': 'Colors', 
      'localField': 'Renkcode', 
      'foreignField': 'Code', 
      'as': 'Colors'
    }
  }, 
  {
    '$unwind': {
      'path': '$Colors'
    }
  }, 
  {
    '$lookup': {
      'from': 'Categori', 
      'localField': 'Maincode', 
      'foreignField': 'Maincode', 
      'as': 'Categori'
    }
  }, 
  {
    '$unwind': {
      'path': '$Categori'
    }
  }, 
  {
    '$unwind': {
      'path': '$Pictures'
    }
  }, 
  {
    '$project': {
      'toplamBeden': '$toplam', 
      'Maincode': 1, 
      'Renkcode': 1, 
      'productsAllegro': '$Allegro', 
      'colorName': '$Colors.TR', 
      'image': '$Pictures.Url', 
      'name': {
        '$concat': [
          '$Maincode', ',', '$Renkcode'
        ]
      }, 
      'forUrl': {
        '$concat': [
          '$Maincode', '.', '$Renkcode'
        ]
      }, 
      'Kata1': '$Categori.Kata1', 
      'Kata3': '$Categori.Kata3'
    }
  }, 
  {
    '$addFields': {
      'toplamAlBeden': {
        '$cond': {
          'if': {
            '$and': [
              {
                '$isArray': '$productsAllegro'
              }, {
                '$gt': [
                  {
                    '$size': '$productsAllegro'
                  }, 0
                ]
              }
            ]
          }, 
          'then': {
            '$size': '$productsAllegro'
          }, 
          'else': 0
        }
      }
    }
  }, 
  {
    '$unwind': {
      'path': '$productsAllegro'
    }
  }, 
  {
    '$addFields': {
      'AlBeden': '$productsAllegro.variations'
    }
  }, 
  {
    '$addFields': {
      'toplamAlBeden': {
        '$size': '$productsAllegro.variations'
      }
    }
  }, 
  {
    '$unset': 'AlBeden'
  }
]
```
