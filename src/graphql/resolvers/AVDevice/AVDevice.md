# AVDevice Queries and Mutations

- Queries
  - userAVDevices (returns array of user added AV Devices/pass wl: "true" or "false"/pass id: "device id" to get 1):
    ```
    query {
      userAVDevices(wl: "false") {
        name,
        brand,
        wishlist,
        image,
        inputs,
        output,
        _id,
        channels,
        updated,
        created
      }
    }
    ```

- Mutations
  - addDevice (returns newly added device):
    ```
    mutation {
      addAVDevice(device: {
        name: "test",
        brand: "Tester",
        channels: ["1", "2"],
        inputs: ["HDMI"],
        output: "HDMI",
        image: "yeah",
        location: "somewhere",
        wishlist: false
      }) {
        name,
        brand,
        wishlist,
        image,
        inputs,
        output,
        _id,
        channels,
        updated,
        created
      }
    }
    ```
  - deleteDevice (returns 1 for success and 0 for failure):
    ```
    mutation {
      deleteAVDevice (id: "5cfbb4c9e443b660632a79b7")
    }
    ```
  - editAVDevice (edits device and returns new device data/can send any single fields or multiple):
    ```
    mutation {
      editAVDevice(device: {name: "test device", id: "5cfbb2c62c2c395f20928ac0"}) {
        name,
        brand,
        channels,
        inputs,
        output,
        location,
        created,
        updated,
        wishlist
      }
    }
    ```