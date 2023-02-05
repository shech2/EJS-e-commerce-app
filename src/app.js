// Express app initialization
const express = require("express");
const app = express();

// DOTENV:
const dotenv = require("dotenv");
dotenv.config();


// SOCKET IO

const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = new Server(server);

io.on("connect", (socket) => {
  socket.on("new_product", (data) => {
    io.emit("notification", `check our new product: ${data}!`);
  });
});

// COOKIES:
const cookieparser = require("cookie-parser");
app.use(cookieparser());

// Layouts:
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "./layouts/full-width");

// Middleware:
const authmw = require("./middleware/authMiddleWare");
const pgMiddleware = require("./middleware/paginationMiddleWare");
const bp = require("body-parser");
const morgan = require("morgan");
app.use(morgan("tiny"));
//const d3 = require('d3');

// Models:
const ProductModel = require("./models/Product");
const Brand = require("./models/brand");
const Order = require("./models/order");
const Cart = require("./models/cart");
const User = require("./models/User");
const Category = require("./models/category");

// Routers:
const cartRouter = require("./routes/cart");
const authRouter = require("./routes/auth");
const ProductRouter = require("./routes/products");
const userRouters = require("./routes/users");
const orderRouters = require("./routes/orders");
const categoryRouters = require("./routes/categories");
const brandRouters = require("./routes/brand");

// EXPRESS:
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(bp.urlencoded({ extended: false, limit: "50mb" }));
app.use(bp.json());

// Mongo DB Connection:
const mongoose = require("mongoose"); // adds MongoDB to the Project
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfully!"))
  .catch((err) => {
    console.log(err);
  });

// Session + Flash:
const express_session = require("express-session");
const flash = require("connect-flash");
app.use(
  express_session({
    secret: process.env.SESSION_SEC,
    cookie: { maxAge: 6000 },
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Passport:
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

// EJS + Views:
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public"));
app.use("/images", express.static(__dirname + "public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// GET for login,signup and logout:
app.get("/login", (req, res) => {
  const error = req.flash("error"); // flash errors
  res.render("./pages/login.ejs", {
    error,
    title: "Login",
    headercss: "/css/header.css",
    footercss: "/css/footer.css",
    cssfile: "/css/style-login.css",
    user: req.cookies.user,
  });
});

app.get("/register", (req, res) => {
  const error = req.flash("error"); // flash errors
  res.render("./pages/register.ejs", {
    error,
    title: "Register",
    headercss: "/css/header.css",
    footercss: "/css/footer.css",
    cssfile: "/css/register.css",
    user: req.cookies.user,
  });
});

// LOGOUT:
app.get("/logout", authRouter); // no need to create a new route for logout, just use the authRouter

// GET THE PRODUCTS AT THE HOMEPAGE
app.get("/homepage", (req, res) => {
  var updatedItems = [];
  ProductModel.find({}, async function (err, items) {
    if (err) {
      console.log(err);
    }
    if (req.query.search) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].category.name == req.query.search) {
          updatedItems.push(items[i]);
        }
      }
      res.render("./pages/homePage.ejs", {
        title: "Home-Page",
        headercss: "/css/header.css",
        footercss: "/css/footer.css",
        cssfile: "/css/homepage.css",
        user: req.cookies.user,
        ProductModel: updatedItems,
      });
    } else {
      ProductModel.find({}, async function (err, products) {
        if (err) {
          console.log(err);
        }
        Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
          if (err) {
            console.log(err);
          }
          res.render("./pages/homePage.ejs", {
            title: "Home-Page",
            ProductModel: products,
            headercss: "/css/header.css",
            footercss: "/css/footer.css",
            cssfile: "/css/homepage.css",
            user: req.cookies.user,
            Cart: cart,
          });
        }).populate({
          path: "cartItems.product",
          populate: [{ path: "category" }, { path: "brand" }], // Multiple populate populate([{},{}]) --> this is the syntax .
        });
      });
    }
  })
    .populate("category")
    .populate("brand");
});

// Pagination +  Pagination Sorted by Price:
const Newest = pgMiddleware.Newest(ProductModel);
const LowToHigh =
  pgMiddleware.LowToHigh(ProductModel);
const HighToLow =
  pgMiddleware.HighToLow(ProductModel);
const Rating =
  pgMiddleware.Rating(ProductModel);

// GET SHOP:
app.get("/shop", Newest, LowToHigh, HighToLow, Rating, (req, res) => {
  if (req.query.sorter) {
    const sorter = req.query.sorter;
    if (sorter == "LowToHigh") {
      ProductModel.find({}, async function (err) {
        if (err) {
          console.log(err);
        }
        Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
          if (err) {
            console.log(err);
          }
          res.render("./pages/shop.ejs", {
            title: "Shop",
            ProductModel: res.LowToHigh,
            headercss: "/css/header.css",
            footercss: "/css/footer.css",
            cssfile: "/css/shop.css",
            user: req.cookies.user,
            Cart: cart,
            search: req.query.search,
          });
        }).populate({
          path: "cartItems.product",
          populate: [{ path: "category" }, { path: "brand" }], // Multiple populate populate([{},{}]) --> this is the syntax .
        });
      });
    }
    if (sorter == "HighToLow") {
      ProductModel.find({}, async function (err) {
        if (err) {
          console.log(err);
        }
        Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
          if (err) {
            console.log(err);
          }
          res.render("./pages/shop.ejs", {
            title: "Shop",
            ProductModel: res.HighToLow,
            headercss: "/css/header.css",
            footercss: "/css/footer.css",
            cssfile: "/css/shop.css",
            user: req.cookies.user,
            Cart: cart,
            search: req.query.search,
          });
        }).populate({
          path: "cartItems.product",
          populate: [{ path: "category" }, { path: "brand" }], // Multiple populate populate([{},{}]) --> this is the syntax .
        });
      });
    }
    if (sorter == "Newest") {
      ProductModel.find({}, async function (err) {
        if (err) {
          console.log(err);
        }
        Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
          if (err) {
            console.log(err);
          }
          res.render("./pages/shop.ejs", {
            title: "Shop",
            ProductModel: res.Newest,
            headercss: "/css/header.css",
            footercss: "/css/footer.css",
            cssfile: "/css/shop.css",
            user: req.cookies.user,
            Cart: cart,
            search: req.query.search,
          });
        }).populate({
          path: "cartItems.product",
          populate: [{ path: "category" }, { path: "brand" }], // Multiple populate populate([{},{}]) --> this is the syntax .
        });
      });
    }
    if (sorter == "Rating") {
      ProductModel.find({}, async function (err) {
        if (err) {
          console.log(err);
        }
        Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
          if (err) {
            console.log(err);
          }
          res.render("./pages/shop.ejs", {
            title: "Shop",
            ProductModel: res.Rating,
            headercss: "/css/header.css",
            footercss: "/css/footer.css",
            cssfile: "/css/shop.css",
            user: req.cookies.user,
            Cart: cart,
            search: req.query.search,
          });
        }).populate({
          path: "cartItems.product",
          populate: [{ path: "category" }, { path: "brand" }], // Multiple populate populate([{},{}]) --> this is the syntax .
        });
      });
    }
  }

  var updatedItems = {
    results: [],
  };
  ProductModel.find({}, async function (err, items) {
    if (err) {
      console.log(err);
    }
    if (req.query.search) {
      const search = await ProductModel.find({
        Product_name: { $regex: req.query.search, $options: "i" },
      })
        .populate("category")
        .exec();
      if (search) {
        if (
          req.query.search == "Men" ||
          "Women" ||
          "Nike" ||
          "Adidas" ||
          "men" ||
          "women"
        ) {
          for (var i = 0; i < items.length; i++) {
            if (items[i].category.name == req.query.search) {
              updatedItems.results.push(items[i]);
            }
            if (items[i].brand.name == req.query.search) {
              updatedItems.results.push(items[i]);
            }
          }
        }
        for (let index = 0; index < search.length; index++) {
          updatedItems.results.push(search[index]);
        }
      }
      Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
        if (err) {
          console.log(err);
        }
        res.render("./pages/shop.ejs", {
          title: "Shop",
          headercss: "/css/header.css",
          footercss: "/css/footer.css",
          cssfile: "/css/shop.css",
          user: req.cookies.user,
          ProductModel: updatedItems,
          Cart: cart,
          search: req.query.search,
        });
      }).populate({
        path: "cartItems.product",
        populate: [{ path: "category" }, { path: "brand" }], // Multiple populate populate([{},{}]) --> this is the syntax .
      });
    } else {
      ProductModel.find({}, async function (err) {
        if (err) {
          console.log(err);
        }
        Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
          if (err) {
            console.log(err);
          }
          res.render("./pages/shop.ejs", {
            title: "Shop",
            ProductModel: res.Newest,
            headercss: "/css/header.css",
            footercss: "/css/footer.css",
            cssfile: "/css/shop.css",
            user: req.cookies.user,
            Cart: cart,
            search: req.query.search,
          });
        }).populate({
          path: "cartItems.product",
          populate: [{ path: "category" }, { path: "brand" }], // Multiple populate populate([{},{}]) --> this is the syntax .
        });
      });
    }
  })
    .populate("category")
    .populate("brand");
});

// GET ABOUT:
app.get("/about", (req, res) => {
  Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
    if (err) {
      console.log(err);
    }
    res.render("./pages/about.ejs", {
      title: "About",
      headercss: "/css/header.css",
      footercss: "/css/footer.css",
      cssfile: "/css/about.css",
      user: req.cookies.user,
      Cart: cart,
    });
  });
});

// GET Product-page:
app.get("/product-page", (req, res) => {
  ProductModel.find({}, async function (err, products) {
    if (err) {
      console.log(err);
    }
    Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
      if (err) {
        console.log(err);
      }
      ProductModel.findOne(
        { _id: req.query.id },
        async function (err, product) {
          res.render("./pages/product-page.ejs", {
            title: "Product-Page",
            headercss: "/css/header.css",
            footercss: "/css/footer.css",
            Size: product.size,
            ProductModel: product,
            ProductModels: products,
            cssfile: "/css/product-page.css",
            user: req.cookies.user,
            Cart: cart,
          });
        }
      );
    });
  })
    .populate("category")
    .populate("brand");
});

// GET Admin page:
app.get("/admin", authmw.authAdmin, (req, res) => {
  // authmw.authAdmin --> this is the middleware
  User.find({}, async function (err, users) {
    if (err) {
      console.log(err);
    } else {
      Cart.findOne({ user: req.user.id }, async function (err, cart) {
        if (err) {
          console.log(err);
        }
        ProductModel.find({}, async function (err, products) {
          if (err) {
            console.log(err);
          }
          Order.find({}, async function (err, orders) {
            if (err) {
              console.log(err);
            }
            res.render("./pages/admin.ejs", {
              title: "Admin page",
              headercss: "/css/header.css",
              footercss: "/css/footer.css",
              cssfile: "/css/admin.css",
              users: users,
              user: req.cookies.user,
              Cart: cart,
              Products: products,
              Orders: orders,
            });
          })
            .populate({ path: "orderItems", populate: { path: "product" } })
            .populate("user");
        })
          .populate("category")
          .populate("brand")
          .populate("size");
      });
    }
  });
});

app.get("/ordersStatistics", authmw.authAdmin, async (req, res) => {

  const Orders = await Order.aggregate(
    [
      {
        $project:
        {
          _id: 0,
          orderDayInWeek: { $dayOfWeek: "$dateOrdered" }
        }
      }
    ]
  );
  const ordersByUsers = await Order.aggregate(
    [
      {
        $project: {
          _id: 0,
          user: "$user"
        }
      }
    ]
  );
  await Order.populate(ordersByUsers, { path: "user" });

  const orderByDays = [
    { day: "Sunday", amount: 0 },
    { day: "Monday", amount: 0 },
    { day: "Tuesday", amount: 0 },
    { day: "Wednesday", amount: 0 },
    { day: "Thursday", amount: 0 },
    { day: "Friday", amount: 0 },
    { day: "Saturday", amount: 0 }
  ]


  // Get all users from DB
  const users = await User.find({});


  var amountOfOrdersPerUser = [['Users', 'Orders']];

  // Get amount of orders per user 
  users.forEach(user => {
    var amount = 0;
    ordersByUsers.forEach(order => {
      if (order.user._id.toString() === user._id.toString()) {
        amount++;
      }
    });
    amountOfOrdersPerUser.push([user.username, amount]);
  });

  for (let index = 0; index < Orders.length; index++) {
    const day = Orders[index].orderDayInWeek;
    orderByDays[day - 1].amount++;
  }


  const answer = [orderByDays, amountOfOrdersPerUser];
  res.send(answer)
})


// GET Create-Product page:
app.get("/create-product", authmw.authAdmin, (req, res) => {
  Cart.findOne({ user: req.user.id }, async function (err, cart) {
    if (err) {
      console.log(err);
    }
    Category.find({}, async function (err, categories) {
      if (err) {
        console.log(err);
      }
      Brand.find({}, async function (err, brands) {
        if (err) {
          console.log(err);
        }
        res.render("./pages/createProduct.ejs", {
          title: "Create Product",
          headercss: "/css/header.css",
          footercss: "/css/footer.css",
          cssfile: "/css/create-product.css",
          user: req.cookies.user,
          Cart: cart,
          category: categories,
          brand: brands,
          token: process.env.FACEBOOK_TOKEN,
        });
      });
    });
  });
});

// GET Checkout page:
app.get("/checkout", authmw.authMiddleware, (req, res) => {
  Cart.findOne({ user: req.cookies.user }, function (err, cart) {
    if (err) {
      console.log(err);
    }
    var total = 0;
    cart.cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    if (cart) {
      res.render("./pages/checkout.ejs", {
        title: "Checkout",
        headercss: "/css/header.css",
        footercss: "/css/footer.css",
        cssfile: "/css/checkout.css",
        user: req.cookies.user,
        total: total,
        Cart: cart,
        cartItems: cart.cartItems,
      });
    }
  }).populate({
    path: "cartItems.product",
    populate: [{ path: "category" }, { path: "brand" }], // Multiple populate populate([{},{}]) --> this is the syntax .
  });
});

// GET Cart page:
app.get("/cart", (req, res) => {
  if (req.cookies.user) {
    Cart.findOne({ user: req.cookies.user }, (err, cart) => {
      if (err) {
        console.log(err);
      }
      res.render("./pages/cart.ejs", {
        title: "Cart",
        headercss: "/css/header.css",
        footercss: "/css/footer.css",
        cssfile: "/css/cart.css",
        user: req.cookies.user,
        cartItems: cart.cartItems,
        Cart: cart,
      });
    }).populate({ path: "cartItems.product", populate: { path: "brand" } });
  } else {
    res.redirect("/login");
  }
});

// GET User Profile Page:
app.get("/profile", authmw.authMiddleware, (req, res) => {
  Order.find({ user: req.cookies.user }, async function (err, orders) {
    if (err) {
      console.log(err);
    }
    Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
      if (err) {
        console.log(err);
      }
      console.log("orders", orders);
      res.render("./pages/profile.ejs", {
        title: "Profile",
        headercss: "/css/header.css",
        footercss: "/css/footer.css",
        cssfile: "/css/profile.css",
        user: req.cookies.user,
        orders: orders,
        Cart: cart,
      });
    })
  })
    .populate({ path: "orderItems", populate: { path: "product" } })
    .populate("user");
});

// POST for login and signup:
app.post("/register", authRouter);
app.post("/login", authRouter);

// ROUTES:
app.use("/api/", ProductRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouters);
app.use("/api/", categoryRouters);
app.use("/api/", brandRouters);
app.use("/", orderRouters);
app.use("/", cartRouter);

// Server Connection:
server.listen(3000, () => console.log(`Example app listening on port 3000!`));
