var express = require ( 'express' );
var app = express();
var path = require( 'path' );
var pg = require( 'pg' );
var bodyParser = require( 'body-parser' );
var urlencodedParser = bodyParser.urlencoded( { extended: false } );
var connectionString = 'postgres://localhost:3000/zoo_data';

app.listen( 3000, 'localhost', function( req, res ){
  console.log( 'server is listening on 3000.' );

});

app.use(express.static( 'public' ) );

app.get( '/', function( req, res ) {
  res.sendFile( path.resolve( 'views/index.html' ) );
});

app.post( '/postPath', urlencodedParser, function( req, res ) {
  console.log( 'Post received: ' + req.body.name + ', ' + req.body.quantity );
  pg.connect( connectionString, function( err, client, done ) {
    if( err ){
        console.log( err );
    }
    else {
      client.query( "INSERT INTO critters ( creature, population ) VALUES ( $1, $2 )", [req.body.name, req.body.quantity] );
    }
    res.end();
  });
});

app.get( '/getPath', function(req, res) {
  var results = [];
  pg.connect( connectionString, function( err, client, done ){
    var query = client.query( 'SELECT * FROM critters' );
    var rows = 0;
    query.on( 'row', function( row ){
      results.push( row );
    });
    query.on( 'end', function() {
      return res.json( results );
    });
  });
});
