const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helpers')
/* GET home page. */
router.get('/', function(req, res, next) {
  let user = req.session.user
  productHelpers.getAllProducts().then((products)=>{
    console.log(products)
    res.render('user/view-products',{products,user});
  })
});
const verifyLogin = (req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('user/login')
  }
  res.render('user/login')
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    // console.log(response)
    req.session.loggedIn = true
    req.session.user = response
    res.redirect('/')
  })
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      res.redirect('/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/register',(req,res)=>{
  res.render('./admin/add-product')
})
router.get('/cart',verifyLogin,async(req,res)=>{
  let products = await userHelpers.getCartProducts(req.session.user._id)
  console.log(products)
  res.render('user/cart',{products})
})
router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/')
  })
})

router.get('/dashboard',(req,res)=>{
  res.render('./user/dash.hbs')
})

module.exports = router;
