# Accesory Queries and Mutations
- Queries
  - userAcc (returns user accessories and takes arguments of combination of id, wl, clone, platform or no argments for complete list)
    ```
    query {
      userAcc (id: "5d14a74ede267d3c5eaefc97") {
        name,
        _id,
        company,
        wishlist,
        officialLicensed,
        forClones {
          name,
          _id
        },
        forPlatforms {
          igdbId,
          name,
          _id
        },
        howAcquired,
        type,
        image,
        notes,
        purchaseDate,
        pricePaid,
        created,
        updated
      }
    }
    ```
- Mutations
  - addAcc (saves new accessory to DB)
    ```
    mutation {
      addAcc (
        name: "Test",
        company: "Fake Compny",
        forPlatforms: ["as8d9h9ehrhad8hqeu"],
        forClones: ["asd89hq39e8ansd"],
        image: "https://test.com/image",
        type: "Controller",
        notes: "test",
        pricePaid: 100.50,
        purchaseDate: "6/28/19",
        howAcquired: "GameOver",
        officialLicensed: true,
        wishlist: false
      )
    }
    ```
  - editAcc (takes accessory data with _id as id and all other keys will be saved as changes)
    ```
    mutation {
      addAcc (
        id: "n89awner9nf8sert8h",
        name: "Test 2",
        company: "Fake Company",
        forPlatforms: ["as8d9h9ehrhad8hqeu"],
        forClones: ["asd89hq39e8ansd"],
        image: "https://test.com/image",
        type: "Controller",
        notes: "test editted",
        pricePaid: 100,
        purchaseDate: "6/28/19",
        howAcquired: "GameOver",
        officialLicensed: false,
        wishlist: true
      )
    }
    ```
  - deleteAcc (takes _id as id and deletes accessory then returns number if successful)
    ```
    mutation {
      deleteAcc (id: "89as8rj89entr9sdf9")
    }
    ```