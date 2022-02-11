db.createUser(
        {
            user: "bhsoft",
            pwd: "bhsoft@132",
            roles: [
                {
                    role: "readWrite",
                    db: "people-profile"
                }
            ]
        }
);