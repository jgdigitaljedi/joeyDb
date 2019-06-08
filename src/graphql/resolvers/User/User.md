# User Mutations and Queries

- Queries
  - me (return user):
    ```
    query {
      me {
        admin,
        name,
        email,
        _id,
        admin,
        created,
        updated
      }
    }
    ```
  - users (returns array of users/must be admin):
    ```
    query {
      users {
        name,
        _id,
        email,
        created,
        updated,
        admin
      }
    }
    ```

- Mutations
  - signup (returns token): 
    ```
    mutation {
        signup(email: "test@test.com", name: "joey", password: "8675309")
    }
    ```
  - login (returns token):
    ```
    mutation {
      login(email: "digitaljedi@outlook.com", password: "8675309")
    }
    ```
  - editUser (returns user):
    ```
    mutation {
      editUser(name: "Joey Gauthier") {
        name,
        email,
        admin,
        created,
        updated,
        _id
      }
    }
    ```
  - deleteMe (returns user):
    ```
    mutation {
      deleteMe {
        name,
        email,
        admin,
        created,
        updated,
        _id
      }
    }
    ```
  - deleteUser (returns user & all user created data from other collections/must be admin):
    ```
    mutation {
      deleteUser(key: "email", value: "test@test.com") {
        name,
        _id,
        email,
        created,
        updated,
        admin
      }
}
    ```
