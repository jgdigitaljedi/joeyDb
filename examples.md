# Mutations and Queries

## User

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
    - users (returns array of users):
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
