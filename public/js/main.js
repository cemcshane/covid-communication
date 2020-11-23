/*
 * Root file that handles instances of all the charts and loads the visualization
 */
(function(){
    let instance = null;

    /**
     * Creates instances for every chart (classes created to handle each chart;
     * the classes are defined in the respective javascript files.
     */
    function init() {
        //Creates instances for visualizations (init and update)
        const files = [[], //index 0, empty
        [], //January
        ["data/PressBriefings/COUNTS_2020-02-29.txt.csv"], //February
        ["data/PressBriefings/COUNTS_2020-03-02.txt.csv", "data/PressBriefings/COUNTS_2020-03-06.txt.csv", "data/PressBriefings/COUNTS_2020-03-07.txt.csv", "data/PressBriefings/COUNTS_2020-03-09.txt.csv", "data/PressBriefings/COUNTS_2020-03-10.txt.csv",
         "data/PressBriefings/COUNTS_2020-03-11.txt.csv", "data/PressBriefings/COUNTS_2020-03-13.txt.csv", "data/PressBriefings/COUNTS_2020-03-14.txt.csv", "data/PressBriefings/COUNTS_2020-03-15.txt.csv", "data/PressBriefings/COUNTS_2020-03-16.txt.csv", 
         "data/PressBriefings/COUNTS_2020-03-17.txt.csv", "data/PressBriefings/COUNTS_2020-03-18.txt.csv", "data/PressBriefings/COUNTS_2020-03-19.txt.csv", "data/PressBriefings/COUNTS_2020-03-20.txt.csv", "data/PressBriefings/COUNTS_2020-03-21.txt.csv", 
         "data/PressBriefings/COUNTS_2020-03-22.txt.csv", "data/PressBriefings/COUNTS_2020-03-23.txt.csv", "data/PressBriefings/COUNTS_2020-03-24.txt.csv", "data/PressBriefings/COUNTS_2020-03-25.txt.csv", "data/PressBriefings/COUNTS_2020-03-26.txt.csv", 
         "data/PressBriefings/COUNTS_2020-03-27.txt.csv", "data/PressBriefings/COUNTS_2020-03-28.txt.csv", "data/PressBriefings/COUNTS_2020-03-29.txt.csv", "data/PressBriefings/COUNTS_2020-03-30.txt.csv"], //March
        ["data/PressBriefings/COUNTS_2020-04-01.txt.csv", "data/PressBriefings/COUNTS_2020-04-03.txt.csv", "data/PressBriefings/COUNTS_2020-04-05.txt.csv", "data/PressBriefings/COUNTS_2020-04-06.txt.csv", "data/PressBriefings/COUNTS_2020-04-07.txt.csv",
         "data/PressBriefings/COUNTS_2020-04-08.txt.csv", "data/PressBriefings/COUNTS_2020-04-09.txt.csv", "data/PressBriefings/COUNTS_2020-04-10.txt.csv", "data/PressBriefings/COUNTS_2020-04-14.txt.csv", "data/PressBriefings/COUNTS_2020-04-16.txt.csv",
         "data/PressBriefings/COUNTS_2020-04-17.txt.csv", "data/PressBriefings/COUNTS_2020-04-18.txt.csv", "data/PressBriefings/COUNTS_2020-04-21.txt.csv", "data/PressBriefings/COUNTS_2020-04-22.txt.csv", "data/PressBriefings/COUNTS_2020-04-23.txt.csv",
         "data/PressBriefings/COUNTS_2020-04-27.txt.csv"], //April
        ["data/PressBriefings/COUNTS_2020-05-05.txt.csv", "data/PressBriefings/COUNTS_2020-05-15.txt.csv", "data/PressBriefings/COUNTS_2020-05-22.txt.csv", "data/PressBriefings/COUNTS_2020-05-29.txt.csv", "data/PressBriefings/COUNTS_2020-05-30.txt.csv"], //May
        [], //June
        ["data/PressBriefings/COUNTS_2020-07-20.txt.csv", "data/PressBriefings/COUNTS_2020-07-21.txt.csv", "data/PressBriefings/COUNTS_2020-07-27.txt.csv", "data/PressBriefings/COUNTS_2020-07-28.txt.csv", "data/PressBriefings/COUNTS_2020-07-30.txt.csv"], //July
        ["data/PressBriefings/COUNTS_2020-08-03.txt.csv", "data/PressBriefings/COUNTS_2020-08-05.txt.csv", "data/PressBriefings/COUNTS_2020-08-12.txt.csv", "data/PressBriefings/COUNTS_2020-08-13.txt.csv", "data/PressBriefings/COUNTS_2020-08-23.txt.csv"], //August
        ["data/PressBriefings/COUNTS_2020-09-10.txt.csv", "data/PressBriefings/COUNTS_2020-09-16.txt.csv", "data/PressBriefings/COUNTS_2020-09-23.txt.csv", "data/PressBriefings/COUNTS_2020-09-28.txt.csv"], //September
        ["data/PressBriefings/COUNTS_2020-10-03.txt.csv", "data/PressBriefings/COUNTS_2020-10-05.txt.csv"], //October
        ["data/PressBriefings/COUNTS_2020-11-13.txt.csv"], //November
        [] //December
        ]

        let wordMap = new WordMap(files);

        
    }

    /**
     *
     * @constructor
     */
    function Main(){
        if(instance  !== null){
            throw new Error("Cannot instantiate more than one Class");
        }
    }

    /**
     *
     * @returns {Main singleton class |*}
     */
    Main.getInstance = function(){
        let self = this
        if(self.instance == null){
            self.instance = new Main();

            //called only once when the class is initialized
            init();
        }
        return instance;
    }

    Main.getInstance();
})();