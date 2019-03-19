const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    //apk will be hosted here
    res.download('./downloads/test.txt');
  })

  module.exports = router