const Product = require('../models/product');
const mongoose = require('mongoose');
const fs = require('fs');
mongoose.Promise = require('bluebird');

/** @module Product */

/**
 * Egy nevet átkonvertál használható formátúmuvá, úgy hogy a space-et kicseréli kötőjelre
 * a betűket pedig átírja ékezet nélkülire
 * @param {string} namestr - konvertálandó név
 * @return {string} - konvertált string, ha nem kap paramétert akkor "default-name"-el tér vissza
 */
function nameConverter(namestr) {
  if (!namestr) {
    return 'default-name';
  }
  let name = namestr.toLocaleLowerCase();

  // cseretömb
  const hunChars = {
    á: 'a',
    é: 'e',
    í: 'i',
    ó: 'o',
    ú: 'u',
    ö: 'o',
    ő: 'o',
    ü: 'u',
    ű: 'u',
  };
  //  ékezetes karaktert cseréli angol megfelelőjére a hunChars tömb alapján
  name = name.replace(/[áéíúóöőüű]/g, c => hunChars[c]);
  // ami nem normál karakter az kidobja
  name = name.replace(/[^a-z0-9 -]/g, '');
  //  bármennyi space-t és kötőjelet egy kötőjellre cserél
  name = name.replace(/[ -]+/g, '-');
  return name;
}

module.exports = {
  /**
   * kilistáz minden productot
   * @param {Object} req - HTTP request objektum
   * @param {Object} res - HTTP response objektum
   * @return {Array} - visszatér a product-ok tömbjével
   */
  list: (req, res) => {
    Product.find({})
      .populate('category', 'title')
      .then(product => res.json(product))
      .catch(err => res.send(err));
  },
  /**
   * mongo _id alapján megkeres egy productot
   * @param {object} req - HTTP request objektum
   * @param {object} res - HTTP response objektum
   */
  find: (req, res) => {
    Product.findById(req.params.id)
      .then(product => res.json(product))
      .catch(err => res.send(err));
  },
  /**
   * url alapján megkeres egy productot
   * @param {Object} req - HTTP request objektum
   * @param {Object} res - HTTP response objektum
   * @return {Object} - product object-jét küldi vissza
   */
  findByUrl: (req, res) => {
    Product.findOne({
      producturl: req.params.producturl,
    })
      .then(product => res.json(product))
      .catch(err => res.send(err));
  },
  /**
   * Generál egy productot, a producturl-t és a imgurl generálja a file.path-ból
   * csak admin jogosultsággal fut le ha nem admin akkor visszadob egy hibát
   * @param {Object} req - HTTP request objektum
   * @param {Object} res - HTTP response objektum
   * @return létrehozott product object-jét küldi vissza
   */
  create: (req, res) => {
    req.user = JSON.stringify(req.user);
    req.user = JSON.parse(req.user);
    if (req.user.isAdmin === 'true') {
      if (req.file) {
        req.body.imgurl = `http://localhost:8080/${req.file.path.replace(/\\/, '/')}`;
      }
      req.body.producturl = nameConverter(req.body.productname);

      Product.create(req.body)
        .then(product => res.send(product))
        .catch(err => res.send(err));
    } else {
      res.send({
        err: 'You are not an admin!',
      });
      // res.send({ err: 'You are not an admin!', data: req.user.isAdmin });
    }
  },
  /**
   * update-el egy productot az id alapján
   * a productname-ből generálja a product url-t és imgurl-t.
   * csak admin jogosultsággal működik.
   * Amennyiben az imgurl property létezik törli az url-ből kinyert nevű imaget.
   * @param {Object} req - HTTP request objektum
   * @param {Object} res - HTTP response objektum
   * @return {Object} - az update-d product régi értékével tér vissza
   */
  update: (req, res) => {
    req.user = JSON.stringify(req.user);
    req.user = JSON.parse(req.user);
    if (req.user.isAdmin === 'true') {
      if (req.file) {
        req.body.imgurl = `http://localhost:8080/${req.file.path.replace(/\\/, '/')}`;
      } else {
        req.body.imgurl = '';
      }
      req.body.producturl = nameConverter(req.body.productname);
      Product.findByIdAndUpdate(req.params.id, req.body)
        .then((product) => {
          if (product.imgurl !== '') {
            const imgpath = `./${product.imgurl.substring(22)}`;
            fs.unlink(imgpath, (err) => {
              if (err) {
                throw err;
              }
              console.log('img file was deleted');
            });
          }

          res.json(product);
        })
        .catch(err => res.send(err));
    } else {
      res.send({
        err: 'You are not an admin!',
      });
    }
  },
  /**
   * Eltávolít egy productot az id alapján
   * és törli a hozzátartozó képet az imgurl-ből nyert img fájlnév és útvonal alapján.
   * Csak admin jogosultsággal működik.
   *@param {object} req - HTTP request objektum
   *@param {object} res - HTTP response objektum
   *@return {Object} - A törölt elemmet küldi vissza
   */
  remove: (req, res) => {
    req.user = JSON.stringify(req.user);
    req.user = JSON.parse(req.user);
    if (req.user.isAdmin === 'true') {
      Product.findByIdAndRemove(req.params.id)
        .then((product) => {
          if (product.imgurl) {
            const imgpath = `./${product.imgurl.substring(22)}`;
            fs.unlink(imgpath, (err) => {
              if (err) throw err;
              console.log('img file was deleted');
            });
          }
          res.json(product);
        })
        .catch(err => res.send(err));
    } else {
      res.send({
        err: 'You are not an admin!',
      });
    }
  },
  addComment: (req, res) => {
    req.user = JSON.stringify(req.user);
    req.user = JSON.parse(req.user);
    if (req.user) {
      Product.findByIdAndUpdate(req.params.id, req.body)
        .then((product) => {
          if (product.imgurl !== '') {
            const imgpath = `./${product.imgurl.substring(22)}`;
            fs.unlink(imgpath, (err) => {
              if (err) {
                throw err;
              }
              console.log('img file was deleted');
            });
          }
          res.json(product);
        })
        .catch(err => res.send(err));
    } else {
      res.send({
        err: 'You are not an admin!',
      });
    }
  },
};
