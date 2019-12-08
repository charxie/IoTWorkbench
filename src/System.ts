/*
 * @author Charles Xie
 */

declare var firebase;

export class System {

  static database;

  constructor() {

    if (!System.database) {
      let config = {
        apiKey: "AIzaSyAT_mdZ9yMGg6BWkB1NWPIqAjXtP4cBwcA",
        authDomain: "raspberry-pi-java.firebaseapp.com",
        databaseURL: "https://raspberry-pi-java.firebaseio.com",
        projectId: "raspberry-pi-java",
        storageBucket: "raspberry-pi-java.appspot.com",
        messagingSenderId: "498912746820"
      };
      firebase.initializeApp(config);
      // Get a reference to the database service
      System.database = firebase.database();
    }

  }

}
