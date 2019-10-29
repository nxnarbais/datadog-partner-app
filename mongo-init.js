// Create user to read and write records
db.createUser(
    {
        user: "dduser",
        pwd: "dtdgpwd123",
        roles: [
            {
                role: "readWrite",
                db: "todoDb" // Look for env variable: MONGO_INITDB_DATABASE
            }
        ]
    }
);

// Insert a few records
// db.dogs.insert({ name: "bits1" });

// Create an admin user
// FIXME: At the moment, this create an admin user in the dtdg database. To make it work, it should be created on the admin database.
// use admin;
db.createUser(
    {
        user: "datadog",
        pwd: "ddpwd123",
        roles : [
            {role: 'read', db: 'admin' },
            {role: 'clusterMonitor', db: 'admin'},
            {role: 'read', db: 'local' }
        ]
    }
);
