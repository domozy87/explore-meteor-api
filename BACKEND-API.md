Meteor Method Call
------------

All Meteor method call need meteor package:

For Web:
```
import { Meteor } from 'meteor/meteor'
```

For React-Native:
```
import { Meteor } from 'react-native-meteor'
```

1. Search Query
    ```
    Meteor.call('searchQuery', searchString, (err, result) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(result);
        }
    });
    ```
    - searchString: is the string from input searchbox.
    - result: is the return searched data from Meteor server. It has 2 objects:
        - repositories -> Array
        - sites -> Array

2. Order Detail
    ```
    Meteor.call('order.detail', orderId, (err, result) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(result);
        }
    });
    ```
    - orderId: The ID of the order when click on the map
    - result: The returning of order object
    
3. List Order by Tour
    ```
    Meteor.call('order.listByTour', tourObj, (err, result) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(result);
        }
    });
    ```
    - tourObj: The Tour object
    - result: The returning of order collections (array)

4. Get active tour
    ```
    Meteor.call('tours.getActive', driverId, currentDate, (err, result) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(result);
        }
    });
    ```
    - driverId: The ID of the driver
    - currentDate: Current date object
    - result: The returning of the active tour (array)
    
5. Get tour list
    ```
    Meteor.call('tours.list', driverId, limit, (err, result) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(result);
        }
    });
    ```
    - driverId: The ID of the driver
    - limit: Limit number of the returning result (default 10)
    - result: The returning active, upcoming, passed tours (array)
