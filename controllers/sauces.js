const Sauce = require('../models/Sauce');
/* Package fs (file system) de node pour assurer la suppression de l'image dans chaque sauce */
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce créee avec succès !'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
	...JSON.parse(req.body.sauce),
	imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body};
  Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id }).then(
    () => {
      res.status(200).json({
        message: 'Sauce mis à jour !'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then( sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.likeDislikeSauce = (req, res, next) => {
	const user = req.body.userId;
	const like = req.body.like;
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			if (like == 1) {
				if (!sauce.usersLiked.includes(user)) {
					sauce.likes++;
					sauce.usersLiked.push(user);
				}
			} else if (like == 0) {
				if (sauce.usersLiked.includes(user)) {
					sauce.likes--;
					const indexL = sauce.usersLiked.indexOf(user);
					sauce.usersLiked.splice(indexL, 1);
				} else if (sauce.usersDisliked.includes(user)) {
					sauce.dislikes--;
					const indexD = sauce.usersDisliked.indexOf(user);
					sauce.usersDisliked.splice(indexD, 1);
				}
			} else if (like == -1) {
				if (!sauce.usersDisliked.includes(user)) {
					sauce.dislikes++;
					sauce.usersDisliked.push(user);
				}
			} else {
				throw "La requête est erronnée!";
			}
			sauce
				.save()
				.then(() =>
					res.status(200).json({ message: "Préférences enregistrées!" })
				)
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};