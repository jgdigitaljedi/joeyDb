# Platform Queries and Mutations

- Queries
  - platformLookup (returns search data from IGDB database):
    ```
    query {
      platformLookup(name: "playstation") {
        igdbId,
        name,
        alternative_name,
        category,
        generation,
        versions {
          name,
          storage,
          first_release_date,
          id
        }
      }
    }
    ```

  - myPlatforms (returns list of user's platforms/sending wishlist: true returns platform wishlist):
    ```
    query {
      myPlatforms {
        _id,
        user,
        igdbId,
        name,
        category,
        generation,
        versionName,
        first_release_date,
        alternative_name,
        storage,
        unit,
        notes,
        box,
        connectedBy,
        upscaler,
        condition,
        datePurchased,
        howAcquired,
        region,
        ghostConsole,
        wishlist,
        created,
        updated,
        mods
      }
    }
    ```
  - getPlatformCategories (returns array of platform category data):
    ```
    query {
      getPlatformCategories {
        id,
        name
      }
    }
    ```

- Mutations
  - addPlatform (returns new platform data):
    ```
    mutation {
      addPlatform(
        platform: {
          igdbId: 18,
          name: "Test",
          category: "console",
          generation: 3,
          versionName: null,
          first_release_date: null,
          alternative_name: "Nintendo, Famicom, Family Computer, Control Deck, FC, FDS, NES",
          storage: "",
          unit: "",
          notes: "",
          box: false,
          connectedBy: "Composite",
          upscaler: true,
          condition: "Good",
          datePurchased: null,
          howAcquired: "Brandy's friend from BCBS",
          region: "US",
          ghostConsole: false,
          wishlist: false,
          mods: null
        }
      ){
        _id,
        user,
        igdbId,
        name,
        category,
        generation,
        versionName,
        first_release_date,
        alternative_name,
        storage,
        unit,
        notes,
        box,
        connectedBy,
        upscaler,
        condition,
        datePurchased,
        howAcquired,
        region,
        ghostConsole,
        wishlist,
        created,
        updated,
        mods
      }
    }
    ```
  - deletePlatform (returns number to represent number of platforms deleted):
    ```
    mutation {
      deletePlatform(id: "5cfbad9879aa944116f94a46")
    }
    ```
  - editPlatform (returns new platform data):
    ```
    mutation {
      editPlatform(platform: {id: "5cfbac488d7bcc400af437e9", name: "Test2"}) {
        _id,
        user,
        igdbId,
        name,
        category,
        generation,
        versionName,
        first_release_date,
        alternative_name,
        storage,
        unit,
        notes,
        box,
        connectedBy,
        upscaler,
        condition,
        datePurchased,
        howAcquired,
        region,
        ghostConsole,
        wishlist,
        created,
        updated,
        mods
      }
    }
    ```