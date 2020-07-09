const express = require('express');
const app = express();
const axios = require('axios');
const Weather = require('./Weather');
const { ApiKey } = require('./Weather');
const uuidAPIKey = require('uuid-apikey');
const nodemailer = require('nodemailer');
var path = require('path');
const port = process.env.PORT||5000;
//const apikey = '385e80';
const apikey = 'e55f37ddf75aa5c1f80c356fad572961';
const apikey1 = '9619d5999296a389c50e108526c5b6b41dac433f';

//localhost:5000/recoverkey?email=${email}
app.get('/recoverkey', (req, res) => {
  const email = req.query.email;
  if(email == "" || email == undefined){
    res.status(200).json('Invalid Email');
    return;
  }
  Weather.ApiKey.find({email: email})
    .then(response => {
      if (response.length) {
        var transporter = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          //host: "smtp.elasticemail.com",
          //port: "465",//465 for ssl, 587 for tsl, 2525 for unencrypted
          tls: {
             //do not fail on invalid certs
            rejectUnauthorized: false
        },
          auth: {
            user: "bdfe809d2820b1",
            //user:"p18010695@student.newinti.edu.my",
            pass:"2db1bde5142acc"
            //pass: "5C9D7090158D0119B3EF7CC3F2F3CAEE579C"
          }
          //sendMail: true
        });
    
        var mailOptions = {
          from: 'The weather api team <p18010695@student.newinti.edu.my>',
          to: email,
          subject: 'Api Key for weather',
          html: '<h1>Welcome to weather api!</h1><p>Your api key is ' + uuidAPIKey.toAPIKey(response[0].key) + ' and registered email is '+ email +'<p>Use the follow address to access to the api:</p>getweather?location=${locationname}&apikey=${apikey}userid=${registeredemail}</p>'
        };
    
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error)
            res.status(400).json(error);
          } else {
            res.status(200).json("Your api info have sent to the registered email, please check your email for more details");
          }
        });
      }else{
        res.status(200).json("The email didn't registered, please use the generate api key function!");
      }
  })
  .catch(error => {
    console.log(error)
    res.status(400).json(error);
  });
});

//localhost:5000/generatekey?email=${email}
app.get('/generatekey', (req, res) => {
  const email = req.query.email;
  if(email == "" || email == undefined){
    res.status(200).json('Invalid Email');
    return;
  }
  Weather.ApiKey.find({email: email})
    .then(response => {
      if (response.length) {
        res.status(200).json('The email have been used, please use the key provided or insert another email!');
        return;
      }
    const create = uuidAPIKey.create({noDashes:true});
    const api = new Weather.ApiKey({
    key: create.uuid,
    email: email
  });
  if (!api.key) {
    console.log(key);
    res.status(200).json('Fail to generate api key, please try again');
    return;
  }
  api
  .save()
  .then(response => {
    var transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      //host: "smtp.elasticemail.com",
      //port: "465",//465 for ssl, 587 for tsl, 2525 for unencrypted
      tls: {
         //do not fail on invalid certs
        rejectUnauthorized: false
    },
      auth: {
        user: "bdfe809d2820b1",
        //user:"p18010695@student.newinti.edu.my",
        pass:"2db1bde5142acc"
        //pass: "5C9D7090158D0119B3EF7CC3F2F3CAEE579C"
      }
      //sendMail: true
    });

    var mailOptions = {
      from: 'The weather api team <p18010695@student.newinti.edu.my>',
      to: email,
      subject: 'Api Key for weather',
      html: '<h1>Welcome to weather api!</h1><p>Your api key is ' + create.apiKey + ' and registered email is '+ email +'<p>Use the follow address to access to the api:</p>getweather?location=${locationname}&apikey=${apikey}userid=${registeredemail}</p>'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error)
        res.status(400).json(error);
      } else {
        res.status(200).json("Your api key have sent to your email, please check your email for more details");
      }
    });
  })
  .catch(error => {
    console.log(error)
    res.status(400).json(error);
  });
  })
  
  .catch(error => {
    console.log(error)
    res.status(400).json(error);
  });
});

//localhost:5000/getweather?location=${locationname}&apikey=${apikey}&userid=${registeredemail}
app.get('/getweather', (req, res) => {
  const cityname = req.query.location;
  const userkey = req.query.apikey;
  const useremail = req.query.userid;
  const checkkeyformat = uuidAPIKey.isAPIKey(userkey);
  if(cityname == "" || cityname == undefined){
    res.status(200).json('Please enter location');
    return;
  }
  if(checkkeyformat == false){
    res.status(200).json('Invalid Key Format');
        return;
  }
  Weather.ApiKey.find({key: uuidAPIKey.toUUID(userkey)}&&{email: useremail})
    .then(response => {
      if (!response.length) {
        res.status(200).json('Invalid Key or User ID');
        return;
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).json(error);
    });
 

  const querystr = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apikey}&units=metric`;

  axios
    .get(querystr)
    .then(response => {
      lat = response.data.coord.lat;
      lon = response.data.coord.lon
      temperature = response.data.main.temp;
      city = response.data.name;
      icon = response.data.weather[0].icon;
      const querystr1 = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${apikey1}`;
      axios.get(querystr1).then( (response) =>{
        status = response.data.status;
        airstation = response.data.data.city.name;
        airurl = response.data.data.city.url;
        airindex = response.data.data.aqi;
        latestupdate = response.data.data.time.s;
    
        const weather = new Weather.Weather({
          temp: temperature,
          location: city,
          station: airstation,
          airpollution: airindex,
          time : latestupdate,
          url: airurl,
          icon: "http://openweathermap.org/img/wn/"+icon+"@2x.png"
        });
        if (!weather.temp) {
          res.status(200).json('No weather info found');
          return;
        }
        weather
        .save()
        .then(response => {
          res.status(200).json(response);
        })

        .catch(error => {
          res.status(200).json('Failed to access database');
        });
        })
      
        .catch(error => {
           res.status(400).json('Weather Not Found');
        });
        
    })
    .catch(error => {
      res.status(200).json('No weather info found');
    });
});
//localhost:5000/getrecord?title=location
app.get('/getrecord', (req, res) => {
  const cityname = req.query.title;
  if(cityname == "" || cityname == undefined){
    res.status(200).json('Please enter city name');
    return;
  }
  const querystr = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apikey}&units=metric`;

  axios
    .get(querystr)
    .then(response => {
      lat = response.data.coord.lat;
      lon = response.data.coord.lon
      temperature = response.data.main.temp;
      city = response.data.name;
      icon = response.data.weather[0].icon;
      const querystr1 = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${apikey1}`;
      axios.get(querystr1).then( (response) =>{
        status = response.data.status;
        airstation = response.data.data.city.name;
        airurl = response.data.data.city.url;
        airindex = response.data.data.aqi;
        latestupdate = response.data.data.time.s;
        console.log(status);
        console.log(response.data.data.iaqi.p);
    
        const weather = new Weather.Weather({
          temp: temperature,
          location: city,
          station: airstation,
          airpollution: airindex,
          time : latestupdate,
          url: airurl,
          icon: "http://openweathermap.org/img/wn/"+icon+"@2x.png"
        });
        if (!weather.temp) {
          res.status(200).json('Weather info not found');
          return;
        }
        weather
        .save()
        .then(response => {
          res.status(200).json("Add weather detail succesfully");
        })

        .catch(error => {
          console.log(error)
          res.status(200).json('Failed to save into database');
        });
        })
      
        .catch(error => {
          console.log(error)
          res.status(400).json('Weather Not Found');
        });
        
    })
    .catch(error => {
      console.log(error)
      res.status(200).json('Weather Not Found');
    });
});

//localhost:5000/getallrecords
app.get('/getallrecords', (req, res) => {
  Weather.Weather.find({})
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      console.log(error)
      res.status(400).json(error);
    });
});

//localhost:5000/deletemovie?title=location
app.get('/deleterecord', (req, res) => {
  Weather.Weather.deleteMany({ _id: req.query.id })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      console.log(error)
      res.status(400).json(error);
    });
});
if (process.env.NODE_ENV === 'production') {

  //method 1
 /* app.use(express.static('client/build'))
  app.get('*', (req, res) => {
     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
   });*/

  //method 2 (not working)
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  //Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
app.listen(port, () => {
  console.log('server listening on port 5000');
});