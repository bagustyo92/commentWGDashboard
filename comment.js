exports.commentData = function(req, res, db) {
  var _year = req.params.year;
  var _month = req.params.month;
  //_month = (_month.length < 2 ? "0" : "") + _month;
  var _location = req.params.location;  

  //var _query = "SELECT * FROM db_mobile_comment WHERE location = ? AND month_loc = ? AND year_loc = ? ORDER BY time_stamp";
  var _query = "SELECT db_mobile_user.name, db_mobile_comment.comment, db_mobile_comment.location, db_mobile_user.photo_link, db_mobile_comment.time_stamp, db_mobile_comment.hour, db_mobile_comment.date, db_mobile_comment.month_loc, db_mobile_comment.year_loc FROM db_mobile_comment INNER JOIN db_mobile_user ON db_mobile_comment.name = db_mobile_user.username WHERE location = ? AND month_loc = ? AND year_loc = ? ORDER BY time_stamp";
  db.query(
    _query, [_location, _month, _year],
    function(err, rows) {
      if (err) throw err;
      res.json(rows);
    }
  );
};

exports.commentDataCount = function(req, res, db) {
  var _year = req.params.year;
  var _month = req.params.month;
  //_month = (_month.length < 2 ? "0" : "") + _month;
  var _yearMonth = _year + "-" + _month; 

  var _query = "SELECT COUNT(*) AS totalComment FROM db_mobile_comment WHERE month_loc = ? AND year_loc = ?"
  //console.log("QUERY = ", _query);
  db.query(
    _query,[_month, _year],
    function(err, rows) {
      if (err) throw err;
      var totalComment = rows[0].totalComment
      res.json({totalComment: totalComment});
    }
  );
}

exports.commentPerMonth = function(req, res, db) {
  var _year = req.params.year;
  var _month = req.params.month;
  var _query = "SELECT db_mobile_user.name, db_mobile_comment.comment, db_mobile_comment.location, db_mobile_user.photo_link, db_mobile_comment.time_stamp, db_mobile_comment.hour, db_mobile_comment.date, db_mobile_comment.month_loc, db_mobile_comment.year_loc FROM db_mobile_comment INNER JOIN db_mobile_user ON db_mobile_comment.name = db_mobile_user.username WHERE month_loc = ? AND year_loc = ? AND length(db_mobile_comment.location) < 10 ORDER BY location ASC, time_stamp ASC";
  //var _query = "SELECT * FROM db_mobile_comment WHERE month_loc = ? AND year_loc = ? ORDER BY location ASC, time_stamp ASC";

  db.query(
    _query, [_month, _year],
    function(err, rows) {
      if(err) throw err;
      res.json(rows);
    }
  );
}

exports.commentPerProject = function(req, res, db) {
  var _year = req.params.year;
  var _month = req.params.month;
  var _location = req.params.location;
  var _username = req.params.username;
  var _idproyek = req.params.idproyek;
  var _querycheck = "SELECT * FROM db_mobile_manajer WHERE name IN (SELECT name FROM db_mobile_user WHERE username = ? )";
  var _query = "SELECT db_mobile_user.name, db_mobile_comment.comment, db_mobile_comment.location, db_mobile_user.photo_link, db_mobile_comment.time_stamp, db_mobile_comment.hour, db_mobile_comment.date, db_mobile_comment.month_loc, db_mobile_comment.year_loc FROM db_mobile_comment INNER JOIN db_mobile_user ON db_mobile_comment.name = db_mobile_user.username WHERE location = ? AND month_loc = ? AND year_loc = ? ORDER BY time_stamp";

  db.query(
    _querycheck, [_username],
    function(err, rows) {
      if (err) throw err;   
      console.log(rows[0].id_proyek);

      if (_idproyek == rows[0].id_proyek) {
        db.query(
          _query, [_location, _month, _year],
          function(err, rows) {
            if (err) throw err;

            if(rows.length > 0 ) {
              //rows.push({status: 0})
              res.json(rows);
            } else {
              console.log("Comment Kosong");
              res.json(rows);
            }            
          }
        );
      } else {
        console.log("Tidak Punya Akses");
        res.json({status: false});
      }
  }
  )
}