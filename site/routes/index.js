var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  //pymongo
  res.render('index', { title: 'Express' });
});

router.get('/ddg', function(req, res) {
  //pymongo
  res.render('ddg', { title: 'Data-Driven Guides' });
});
router.get('/nolitory', function(req, res) {
  //pymongo
  res.render('nolitory', { title: 'Nolitory' });
});

module.exports = router;
