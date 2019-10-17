## Sequelize Playgound Readme

### Introduction

This is simple repository for practicing with sequelize. I used it for trying queries and architectures before implementing it in my projects.

### Started

-Install mysql-server
-Create database
-Add you database info to mysqlConfig in sequelize.js
-Run the file: node "name of the file" 

### Tests

-oneToMany.js : Testes a one to many associations with on cascade delete.
-manyToMany.js : Testes a many to many associations with on cascade delete. (BelongsToMany)
-manyToManyTwoSteps.js : Testes a many to many associations but creating it with two 1 to many relathionships . (hadMany, belongsTo)