var fs = require('fs')
const mongoose = require('mongoose');

const Hurricane = require('./hurricane');
const Point = require('./point');

let filePath = 'HURDAT.txt';


var topline = /(AL\d+),\s+([A-Z]+),\s+(\d+)/;
var subline = /(\d{4})\d{2}\d{2},\s+\d+,(\s+|\s(L|C|G|I|L|P|R|S|T|W)),\s+(HU|TS|TD|EX|SD|SS|LO|WV|DB), ((\d+.\d)N),\s+(\d+.\d(W)),\s+(\d+)/;

var name;
var _id;

let map = {
    points : []
}



fs.readFileSync(filePath)
.toString()
.split('\n')
.forEach(function(line){

    let hur = topline.exec(line);
    let landFall = false;
    
   
    

    if(hur!= null){
        
        name = hur[2];
        _id = hur[1];
        landFall = false;

    }else {
        try{
        
            var data = subline.exec(line);

            if(data[3] ==  'L') landFall = !landFall;

            if(landFall){

            var hurricane = {

                name: name,
                windspeed: data[9],
                year: data[1],
                type: data[4],
                id: _id

            }

           var point = {
                north : data[5].substr(0,4),
                west : data[7].substr(0,4),
                hurricanes: []
            };

            var added = false;

            map.points.forEach(function(element){

                if(point.north == element.north && 
                    point.west == element.west){
                        
                        element.hurricanes.push(hurricane); 
                        added = true;
                }
            })

            if(!added){
                point.hurricanes.push(hurricane);
                map.points.push(point);
            }

            }
        }catch(err){

        }
    }

});

mongoose.connect("mongodb+srv://cat:<password>@cluster0-kkafa.gcp.mongodb.net/test?retryWrites=true",{
    useNewUrlParser : true
}).catch(function(error){
    console.log(error);
})

map.points.forEach(function(point){
    let p = new Point({
        north : point.north,
        west : point.west,
        _id : new mongoose.Types.ObjectId()
    })
    point.hurricanes.forEach(function(hurricane){

        let hurId = new mongoose.Types.ObjectId();

        let h = new Hurricane({
            _id: hurId,
            name: hurricane.name,            
            windspeed: hurricane.windspeed,
            year: hurricane.year,
            type: hurricane.type,
        })

        p.hurricanes.push(hurId);
        h.save();
    })

    p.save();

})
















