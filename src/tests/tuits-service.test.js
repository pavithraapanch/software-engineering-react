import {
    createTuit,
    deleteTuit,
    findAllTuits, findTuitById
} from "../services/tuits-service";

import {
    createUser, deleteUser
} from "../services/users-service";

describe('can create tuit with REST API', () => {
    const testTuit = {
        tuit: 'Hello Tuiter, From Test User!'
    };
    const user = {
        id : "62359d71694d5bfdeb3a440e",
        username : "testUser"
    }
    let tid;
    // setup test before running test
    beforeAll(() => {
        //since a user can create multiple tuits with same content, no unique check for tuit is required
    })

    // clean up after test runs
    afterAll( () => {
        // remove any tuit we created
        return deleteTuit(tid);
    })

    test('can insert new tuit with REST API', async () => {
        // insert new tuit in the database
        const newTuit = await createTuit(user.id, testTuit);
        tid = newTuit._id;
        // verify inserted tuit's properties match with the return result
        expect(newTuit.postedBy).toEqual(user.id);
        expect(newTuit.tuit).toEqual(testTuit.tuit);
    });
});

describe('can delete tuit with REST API', () => {
    const testTuit = {
        tuit: 'Hello Tuiter, From Test User!'
    }
    const user = {
        id : "62359d71694d5bfdeb3a440e",
        username : "testUser"
    }
    let tid;
    // set up the tests before verification
    beforeAll(async () => {
        // insert the sample tuit we then try to remove
        const newTuit = await createTuit(user.id, testTuit);
        tid = newTuit._id;
        return newTuit;
    });

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return deleteTuit(tid);
    })

    test('can delete users from REST API by username', async () => {
        // delete a tuit by their tuit id. Assumes tuit already exists
        const status = await deleteTuit(tid);

        //verify we deleted the tuit with the given id
        expect(status.deletedCount).toBeGreaterThanOrEqual(1);
    });
});

describe('can retrieve a tuit by their primary key with REST API', () => {
    const testTuit = {
        tuit: 'Hello Tuiter, From Test User!'
    }
    const user = {
        id : "62359d71694d5bfdeb3a440e",
        username : "testUser"
    }
    let tid;

    // setup before running test
    beforeAll(() => {
        // clean up before the test making sure the tuit doesn't already exist
        //return deleteTuit(tid);
    });

    // clean up
    afterAll( () => {
        // remove any data we inserted
        return deleteTuit(tid);
    });

    test('can retrieve user from REST API by primary key', async () => {
        // insert the tuit in the database
        const newTuit = await createTuit(user.id, testTuit);
        tid = newTuit._id;

        // verify inserted tuit's properties match with the return result
        expect(newTuit.postedBy).toEqual(user.id);
        expect(newTuit.tuit).toEqual(testTuit.tuit);

        // retrieve the tuit from the database by its primary key
        const existingTuit = await findTuitById(newTuit._id);

        // verify retrieved tuit matches parameter tuit
        expect(existingTuit.postedBy._id).toContain(user.id);
        expect(existingTuit.tuit).toEqual(testTuit.tuit);
    });
});

describe('can retrieve all tuits with REST API', () => {
    // sample users we'll insert to then retrieve
    const users = [{
        username: 'User1',
        password: 'user1@123',
        email: 'user1@aliens.com'
    },{
        username: 'User2',
        password: 'user2@123',
        email: 'user1@aliens.com'
    },{
        username: 'User3',
        password: 'user3@123',
        email: 'user1@aliens.com'
    }];

    const tuits = [{
        tuit: "User1's Tuit"
    },{
        tuit: "User2's Tuit"
    },{
        tuit: "User3's Tuit"
    }
    ];

    let userIds;
    let tuitIds;
    // setup data before test
    beforeAll(async () => {
        // insert new tuit
        userIds = await Promise.all(users.map(user => createUser(user)));
    }
    );
    // clean up after ourselves
    afterAll(async () => {
            // delete the users we inserted
            await Promise.all(userIds.map(user => deleteUser(user._id)));
            await Promise.all(tuitIds.map(tuit => deleteTuit(tuit._id)));
    }
    );
    test('can retrieve all tuits from REST API', async () => {
        tuitIds = await Promise.all(userIds.map((user, index) => {
                return createTuit(user._id, tuits[index]);
            }
        ));
        // retrieve all the users
        const tuitsFromDB = await findAllTuits();

        // there should be a minimum number of tuits
        expect(tuitsFromDB.length).toBeGreaterThanOrEqual(tuitIds.length);

        // let's check each tuit we inserted
        const tuitsInserted = tuitsFromDB.filter(
            tuitFromDB => tuitIds.some(
                createdTuit => createdTuit._id === tuitFromDB._id));

        // compare the actual tuits in database with the ones we created
        tuitsInserted.forEach(currentTuit => {
            const selectedTuit = tuitIds.find(tuit => tuit._id === currentTuit._id);
            expect(currentTuit.postedBy._id).toEqual(selectedTuit.postedBy);
            expect(currentTuit.tuit).toEqual(selectedTuit.tuit);
        });
    });
});